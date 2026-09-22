import crypto from "node:crypto";
import { getAnalyticsSummary } from "./analytics.js";
import { readClientConfig, writeClientConfig } from "./client-config.js";

const ADMIN_COOKIE_NAME = "csvfilters_admin";
const VALID_TABS = new Set(["ads", "notice", "update", "analytics"]);

export function registerAdminRoutes(app, config) {
  app.get("/admin", (_req, res) => {
    res.redirect("/admin/ads");
  });

  app.get("/admin/analytics", (_req, res) => {
    res.redirect("/admin/ads?tab=analytics");
  });

  app.get("/admin/ads", async (req, res, next) => {
    try {
      if (!hasAdminConfig(config)) {
        res.status(503).type("html").send(renderSetupRequiredPage());
        return;
      }

      if (!isAuthenticated(req, config)) {
        res.type("html").send(renderLoginPage());
        return;
      }

      const activeTab = normalizeTab(req.query?.tab);
      const clientConfig = await readClientConfig(config);
      const analyticsSummary = activeTab === "analytics" ? await getAnalyticsSummary(config) : null;
      res.type("html").send(renderConfigPage(clientConfig, { activeTab, analyticsSummary }));
    } catch (err) {
      next(err);
    }
  });

  app.post("/admin/login", (req, res) => {
    if (!hasAdminConfig(config)) {
      res.status(503).type("html").send(renderSetupRequiredPage());
      return;
    }

    const password = String(req.body?.password || "");
    if (password !== config.adminPassword) {
      res.status(401).type("html").send(renderLoginPage("密码不正确，请重试。"));
      return;
    }

    res.setHeader("Set-Cookie", buildCookie(createAdminToken(config), 60 * 60 * 24 * 7));
    res.redirect("/admin/ads");
  });

  app.post("/admin/logout", (_req, res) => {
    res.setHeader("Set-Cookie", buildCookie("", 0));
    res.redirect("/admin/ads");
  });

  app.post("/admin/ads", async (req, res, next) => {
    try {
      const currentConfig = await requireAdminSession(req, res, config);
      if (!currentConfig) return;

      const savedConfig = await writeClientConfig(config, {
        ...currentConfig,
        analyticsEnabled: req.body?.analyticsEnabled === "on",
        ads: {
          ...currentConfig.ads,
          home: formToHomeAd(req.body || {}),
        },
      });
      res.type("html").send(renderConfigPage(savedConfig, {
        activeTab: "ads",
        successMessage: "广告配置已保存。",
      }));
    } catch (err) {
      next(err);
    }
  });

  app.post("/admin/notice", async (req, res, next) => {
    try {
      const currentConfig = await requireAdminSession(req, res, config);
      if (!currentConfig) return;

      const savedConfig = await writeClientConfig(config, {
        ...currentConfig,
        notice: formToNotice(req.body || {}),
      });
      res.type("html").send(renderConfigPage(savedConfig, {
        activeTab: "notice",
        successMessage: "软件通知已保存。",
      }));
    } catch (err) {
      next(err);
    }
  });

  app.post("/admin/update", async (req, res, next) => {
    try {
      const currentConfig = await requireAdminSession(req, res, config);
      if (!currentConfig) return;

      const savedConfig = await writeClientConfig(config, {
        ...currentConfig,
        update: formToUpdate(req.body || {}),
      });
      res.type("html").send(renderConfigPage(savedConfig, {
        activeTab: "update",
        successMessage: "更新提醒已保存。",
      }));
    } catch (err) {
      next(err);
    }
  });
}

async function requireAdminSession(req, res, config) {
  if (!hasAdminConfig(config)) {
    res.status(503).type("html").send(renderSetupRequiredPage());
    return null;
  }

  if (!isAuthenticated(req, config)) {
    res.status(401).type("html").send(renderLoginPage("请先登录。"));
    return null;
  }

  return readClientConfig(config);
}

function formToHomeAd(body) {
  return {
    enabled: body.homeEnabled === "on",
    updatedAt: new Date().toISOString(),
    imageMode: body.imageMode === "large" ? "large" : "small",
    label: body.label,
    title: body.title,
    description: body.description,
    ctaText: body.ctaText,
    code: body.code,
    imageUrl: body.imageUrl,
    targetUrl: body.targetUrl,
    backgroundColor: body.backgroundColor,
    accentColor: body.accentColor,
  };
}

function formToNotice(body) {
  return {
    enabled: body.noticeEnabled === "on",
    level: body.noticeLevel,
    title: body.noticeTitle,
    message: body.noticeMessage,
    linkText: body.noticeLinkText,
    linkUrl: body.noticeLinkUrl,
  };
}

function formToUpdate(body) {
  return {
    enabled: body.updateEnabled === "on",
    latestVersion: body.latestVersion,
    title: body.updateTitle,
    releaseNotes: body.releaseNotes,
    downloadUrl: body.downloadUrl,
    force: body.forceUpdate === "on",
  };
}

function renderSetupRequiredPage() {
  return renderShell(`
    <section class="card card-narrow">
      <p class="eyebrow">CSVFilters Admin</p>
      <h1>需要先配置后台密码</h1>
      <p class="muted">请在服务器的 <code>.env</code> 里设置 <code>ADMIN_PASSWORD</code> 和 <code>ADMIN_COOKIE_SECRET</code>，然后重启服务。</p>
      <pre>ADMIN_PASSWORD=你的强密码
ADMIN_COOKIE_SECRET=一串随机长字符</pre>
    </section>
  `);
}

function renderLoginPage(errorMessage = "") {
  return renderShell(`
    <section class="card card-narrow">
      <p class="eyebrow">CSVFilters Admin</p>
      <h1>远程配置后台</h1>
      <p class="muted">登录后可以管理首页广告、软件通知、更新提醒和匿名统计。</p>
      ${errorMessage ? `<div class="alert">${escapeHtml(errorMessage)}</div>` : ""}
      <form method="post" action="/admin/login" class="form">
        <label>
          <span>后台密码</span>
          <input name="password" type="password" autocomplete="current-password" required autofocus />
        </label>
        <button type="submit">登录</button>
      </form>
    </section>
  `);
}

function renderConfigPage(clientConfig, options = {}) {
  const activeTab = normalizeTab(options.activeTab);
  const home = clientConfig.ads?.home || {};
  const notice = clientConfig.notice || {};
  const update = clientConfig.update || {};

  return renderShell(`
    <section class="card admin-header-card">
      <div class="page-head">
        <div>
          <p class="eyebrow">CSVFilters Admin</p>
          <h1>远程配置中心</h1>
          <p class="muted">配置会保存到 <code>data/client-config.json</code>，软件从 <code>/api/client/config</code> 读取。</p>
        </div>
        <form method="post" action="/admin/logout">
          <button class="button-secondary" type="submit">退出登录</button>
        </form>
      </div>

      ${options.successMessage ? `<div class="success">${escapeHtml(options.successMessage)}</div>` : ""}

      ${renderTabs(activeTab)}
    </section>

    ${activeTab === "ads" ? renderAdsSection(clientConfig, home) : ""}
    ${activeTab === "notice" ? renderNoticeSection(notice) : ""}
    ${activeTab === "update" ? renderUpdateSection(update) : ""}
    ${activeTab === "analytics" ? renderAnalyticsSection(options.analyticsSummary) : ""}
  `);
}

function renderTabs(activeTab) {
  const tabs = [
    ["ads", "广告配置", "/admin/ads?tab=ads"],
    ["notice", "软件通知", "/admin/ads?tab=notice"],
    ["update", "更新提醒", "/admin/ads?tab=update"],
    ["analytics", "软件统计", "/admin/ads?tab=analytics"],
  ];

  return `
    <div class="admin-tabs" role="tablist" aria-label="远程配置分类">
      ${tabs.map(([key, label, href]) => `
        <a
          class="${key === activeTab ? "is-active" : ""}"
          href="${escapeAttribute(href)}"
          role="tab"
          aria-selected="${key === activeTab ? "true" : "false"}"
        >${escapeHtml(label)}</a>
      `).join("")}
      <a class="json-link" href="/api/client/config" target="_blank" rel="noreferrer">查看 JSON</a>
    </div>
  `;
}

function renderAdsSection(clientConfig, home) {
  return `
    <section id="ads" class="card tab-panel">
      <div class="section-head">
        <div>
          <p class="eyebrow">Ads</p>
          <h2>首页广告配置</h2>
          <p class="muted">控制软件首页上传区域下方的广告位。横图模式只显示图片，推荐尺寸 1200 x 200，至少 960px 宽。</p>
        </div>
      </div>

      <form method="post" action="/admin/ads" class="form">
        <label class="switch-row">
          <input name="analyticsEnabled" type="checkbox" ${clientConfig.analyticsEnabled !== false ? "checked" : ""} />
          <span>
            <strong>开启匿名统计</strong>
            <small>关闭后软件不会继续发送匿名埋点。</small>
          </span>
        </label>

        <label class="switch-row">
          <input name="homeEnabled" type="checkbox" ${home.enabled ? "checked" : ""} />
          <span>
            <strong>开启首页广告</strong>
            <small>关闭后软件首页不显示远程广告。</small>
          </span>
        </label>

        <div class="field-grid">
          ${renderSelect("imageMode", "广告展示模式", home.imageMode || "small", [
            ["small", "小图模式"],
            ["large", "大图模式"],
          ])}
          ${renderInput("label", "广告标签", home.label || "Sponsored", "例如 Sponsored / 推荐")}
          ${renderInput("title", "广告标题", home.title || "", "显示在广告区域里的主标题")}
          ${renderInput("ctaText", "按钮文案", home.ctaText || "查看更多", "例如 查看更多 / 立即查看")}
          ${renderInput("targetUrl", "点击跳转链接", home.targetUrl || "", "https://csvfilters.com")}
          ${renderInput("imageUrl", "广告图片地址", home.imageUrl || "", "/static/ad-image.png")}
          ${renderInput("backgroundColor", "背景色", home.backgroundColor || "#f0fdf4", "#f0fdf4")}
          ${renderInput("accentColor", "强调色", home.accentColor || "#16a34a", "#16a34a")}
        </div>

        <label>
          <span>广告描述</span>
          <textarea name="description" rows="3" placeholder="广告说明文案">${escapeHtml(home.description || "")}</textarea>
        </label>

        <label>
          <span>广告代码</span>
          <textarea name="code" rows="7" placeholder="可填写广告平台提供的 HTML/JS 代码。只要这里有内容，软件端会优先显示广告代码，并忽略标题、描述、图片和按钮。">${escapeHtml(home.code || "")}</textarea>
          <small>代码广告会在软件端的沙盒 iframe 中展示；如果这里有内容，其他文字、图片和跳转按钮不会显示。</small>
        </label>

        <div class="preview">
          <p class="eyebrow">Preview</p>
          ${home.code
            ? `<div class="ad-code-preview">广告代码模式已启用：软件端只显示广告代码，忽略其他广告文字和图片。</div>`
            : renderAdPreview(home)}
        </div>

        <div class="actions">
          <button type="submit">保存广告配置</button>
        </div>
      </form>
    </section>
  `;
}

function renderAdPreview(home) {
  const imageMode = home.imageMode || "small";
  if (imageMode === "large") {
    return `
      <div class="ad-preview ad-preview--large" style="--accent:${escapeAttribute(home.accentColor || "#16a34a")};--bg:${escapeAttribute(home.backgroundColor || "#f0fdf4")}">
        ${home.imageUrl ? `<img src="${escapeAttribute(home.imageUrl)}" alt="" />` : `<div class="ad-preview-placeholder">横图模式只显示图片</div>`}
      </div>
    `;
  }

  return `
    <div class="ad-preview ad-preview--small" style="--accent:${escapeAttribute(home.accentColor || "#16a34a")};--bg:${escapeAttribute(home.backgroundColor || "#f0fdf4")}">
      ${home.imageUrl ? `<img src="${escapeAttribute(home.imageUrl)}" alt="" />` : ""}
      <div>
        <strong>${escapeHtml(home.label || "Sponsored")}</strong>
        <h3>${escapeHtml(home.title || "广告标题预览")}</h3>
        <p>${escapeHtml(home.description || "广告描述会显示在这里。")}</p>
      </div>
      <span>${escapeHtml(home.ctaText || "查看更多")}</span>
    </div>
  `;
}

function renderNoticeSection(notice) {
  return `
    <section id="notice" class="card tab-panel">
      <div class="section-head">
        <div>
          <p class="eyebrow">Notice</p>
          <h2>软件通知配置</h2>
          <p class="muted">用于给软件下发公告、活动提示、维护提醒等。</p>
        </div>
      </div>

      <form method="post" action="/admin/notice" class="form">
        <label class="switch-row">
          <input name="noticeEnabled" type="checkbox" ${notice.enabled ? "checked" : ""} />
          <span>
            <strong>开启软件通知</strong>
            <small>开启后软件可以展示远程通知。</small>
          </span>
        </label>

        <div class="field-grid">
          ${renderSelect("noticeLevel", "通知级别", notice.level || "info", [
            ["info", "信息"],
            ["success", "成功"],
            ["warning", "警告"],
            ["error", "错误"],
          ])}
          ${renderInput("noticeTitle", "通知标题", notice.title || "", "例如 新版本预告")}
          ${renderInput("noticeLinkText", "链接文案", notice.linkText || "查看详情", "例如 查看详情")}
          ${renderInput("noticeLinkUrl", "通知链接", notice.linkUrl || "", "https://csvfilters.com/changelog")}
        </div>

        <label>
          <span>通知内容</span>
          <textarea name="noticeMessage" rows="4" placeholder="通知正文">${escapeHtml(notice.message || "")}</textarea>
        </label>

        <div class="actions">
          <button type="submit">保存软件通知</button>
        </div>
      </form>
    </section>
  `;
}

function renderUpdateSection(update) {
  return `
    <section id="update" class="card tab-panel">
      <div class="section-head">
        <div>
          <p class="eyebrow">Update</p>
          <h2>更新提醒配置</h2>
          <p class="muted">用于告诉软件当前最新版本和下载地址。</p>
        </div>
      </div>

      <form method="post" action="/admin/update" class="form">
        <label class="switch-row">
          <input name="updateEnabled" type="checkbox" ${update.enabled ? "checked" : ""} />
          <span>
            <strong>开启更新提醒</strong>
            <small>开启后软件可以提示用户有新版本。</small>
          </span>
        </label>

        <label class="switch-row">
          <input name="forceUpdate" type="checkbox" ${update.force ? "checked" : ""} />
          <span>
            <strong>强制更新</strong>
            <small>谨慎开启。适合严重 bug 或安全问题。</small>
          </span>
        </label>

        <div class="field-grid">
          ${renderInput("latestVersion", "最新版本号", update.latestVersion || "", "例如 0.2.0")}
          ${renderInput("updateTitle", "更新标题", update.title || "", "例如 CSVFilters 0.2.0 已发布")}
          ${renderInput("downloadUrl", "下载地址", update.downloadUrl || "", "https://csvfilters.com/download")}
        </div>

        <label>
          <span>更新说明</span>
          <textarea name="releaseNotes" rows="6" placeholder="写这次更新修复了什么、新增了什么">${escapeHtml(update.releaseNotes || "")}</textarea>
        </label>

        <div class="actions">
          <button type="submit">保存更新提醒</button>
        </div>
      </form>
    </section>
  `;
}

function renderAnalyticsSection(summary) {
  if (!summary) {
    return `
      <section class="card tab-panel">
        <p class="muted">统计数据加载中，请刷新页面。</p>
      </section>
    `;
  }

  const totals = summary.totals || {};
  return `
    <section id="analytics" class="card tab-panel">
      <div class="section-head">
        <div>
          <p class="eyebrow">Analytics</p>
          <h2>软件统计</h2>
          <p class="muted">这里展示软件端匿名埋点的实时汇总。数据来自 <code>data/analytics-events.jsonl</code>。</p>
        </div>
      </div>

      <div class="metric-grid">
        ${renderMetric("总事件", totals.events)}
        ${renderMetric("总设备", totals.uniqueDevices)}
        ${renderMetric("今日事件", totals.todayEvents)}
        ${renderMetric("7 日活跃设备", totals.sevenDayActiveDevices)}
        ${renderMetric("30 日活跃设备", totals.thirtyDayActiveDevices)}
        ${renderMetric("启动次数", totals.appStarts)}
        ${renderMetric("CSV 打开成功", totals.csvOpens)}
        ${renderMetric("CSV 打开失败", totals.csvOpenFailures)}
        ${renderMetric("广告曝光", totals.adImpressions)}
        ${renderMetric("广告点击", totals.adClicks)}
        ${renderMetric("广告关闭", totals.adDismisses)}
        ${renderMetric("读取样本", summary.sampledEvents)}
      </div>

      <p class="muted analytics-updated">更新时间：${escapeHtml(formatDisplayTime(summary.generatedAt))}</p>
    </section>

    <section class="card">
      <div class="section-head">
        <div>
          <p class="eyebrow">Last 14 Days</p>
          <h2>最近 14 天事件量</h2>
        </div>
      </div>
      <div class="bar-list">
        ${renderDailyBars(summary.dailyCounts || [])}
      </div>
    </section>

    <section class="card">
      <div class="analytics-columns">
        ${renderCountList("事件类型", summary.eventCounts || [])}
        ${renderCountList("平台分布", summary.platformCounts || [])}
        ${renderCountList("版本分布", summary.versionCounts || [])}
      </div>
    </section>

    <section class="card">
      <div class="section-head">
        <div>
          <p class="eyebrow">Recent</p>
          <h2>最近事件</h2>
        </div>
      </div>
      ${renderRecentEvents(summary.recentEvents || [])}
    </section>
  `;
}

function renderMetric(label, value) {
  return `
    <div class="metric-card">
      <span>${escapeHtml(label)}</span>
      <strong>${escapeHtml(formatNumber(value || 0))}</strong>
    </div>
  `;
}

function renderDailyBars(items) {
  const max = Math.max(1, ...items.map((item) => Number(item.count) || 0));
  return items.map((item) => {
    const count = Number(item.count) || 0;
    const width = Math.max(4, Math.round((count / max) * 100));
    return `
      <div class="bar-row">
        <span>${escapeHtml(item.date)}</span>
        <div><i style="width:${width}%"></i></div>
        <strong>${escapeHtml(formatNumber(count))}</strong>
      </div>
    `;
  }).join("");
}

function renderCountList(title, items) {
  return `
    <div>
      <h3>${escapeHtml(title)}</h3>
      <div class="count-list">
        ${items.length > 0 ? items.slice(0, 12).map((item) => `
          <div>
            <span>${escapeHtml(item.name || "unknown")}</span>
            <strong>${escapeHtml(formatNumber(item.count || 0))}</strong>
          </div>
        `).join("") : `<p class="muted">暂无数据</p>`}
      </div>
    </div>
  `;
}

function renderRecentEvents(events) {
  if (events.length === 0) {
    return `<p class="muted">暂无事件。打开软件后等待几秒，再刷新这个页面。</p>`;
  }

  return `
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>时间</th>
            <th>事件</th>
            <th>平台</th>
            <th>版本</th>
            <th>设备</th>
            <th>属性</th>
          </tr>
        </thead>
        <tbody>
          ${events.map((event) => `
            <tr>
              <td>${escapeHtml(formatDisplayTime(event.received_at || event.timestamp))}</td>
              <td>${escapeHtml(event.event || "")}</td>
              <td>${escapeHtml(event.platform || "")}</td>
              <td>${escapeHtml(event.app_version || "")}</td>
              <td>${escapeHtml(event.device_id || "")}</td>
              <td><code>${escapeHtml(JSON.stringify(event.properties || {}))}</code></td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function renderInput(name, label, value, placeholder) {
  return `
    <label>
      <span>${escapeHtml(label)}</span>
      <input name="${escapeAttribute(name)}" value="${escapeAttribute(value)}" placeholder="${escapeAttribute(placeholder)}" />
    </label>
  `;
}

function renderSelect(name, label, value, options) {
  const optionHtml = options
    .map(([optionValue, optionLabel]) => (
      `<option value="${escapeAttribute(optionValue)}" ${optionValue === value ? "selected" : ""}>${escapeHtml(optionLabel)}</option>`
    ))
    .join("");

  return `
    <label>
      <span>${escapeHtml(label)}</span>
      <select name="${escapeAttribute(name)}">${optionHtml}</select>
    </label>
  `;
}

function renderShell(content) {
  return `<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>CSVFilters 远程配置后台</title>
    <style>
      :root { color-scheme: light; --accent: #16a34a; --bg: #f6f8f5; --text: #17211b; --muted: #66736b; --border: #dfe8e1; --card: #ffffff; }
      * { box-sizing: border-box; }
      body { margin: 0; min-height: 100vh; padding: 32px; font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; color: var(--text); background: radial-gradient(circle at top left, #dff8e8, transparent 36%), var(--bg); }
      .card { width: min(1040px, 100%); margin: 0 auto 18px; padding: 28px; border: 1px solid var(--border); border-radius: 24px; background: color-mix(in srgb, var(--card) 96%, transparent); box-shadow: 0 28px 90px rgba(23, 33, 27, 0.10); }
      .card-narrow { width: min(480px, 100%); }
      .admin-header-card { padding-bottom: 18px; }
      .page-head, .section-head { display: flex; justify-content: space-between; gap: 16px; align-items: flex-start; margin-bottom: 22px; }
      h1, h2, h3 { margin: 0; letter-spacing: -0.035em; }
      h1 { margin-bottom: 8px; font-size: clamp(30px, 5vw, 46px); }
      h2 { margin-bottom: 8px; font-size: 24px; }
      h3 { margin: 2px 0; font-size: 18px; }
      p { margin: 0; line-height: 1.7; }
      code, pre { border-radius: 8px; background: #eef5ef; color: #0b6b39; }
      code { padding: 2px 5px; }
      pre { overflow: auto; padding: 14px; white-space: pre-wrap; }
      .eyebrow { margin: 0 0 8px; color: var(--accent); font-size: 12px; font-weight: 800; letter-spacing: 0.14em; text-transform: uppercase; }
      .muted, small { color: var(--muted); }
      .admin-tabs { display: flex; flex-wrap: wrap; gap: 10px; padding: 8px; border: 1px solid var(--border); border-radius: 18px; background: #fbfdfb; }
      .admin-tabs a, button, .button-secondary { display: inline-flex; align-items: center; justify-content: center; min-height: 42px; padding: 0 18px; border: 0; border-radius: 999px; background: var(--accent); color: #fff; font: inherit; font-weight: 800; text-decoration: none; cursor: pointer; }
      .admin-tabs a { border: 1px solid transparent; background: transparent; color: var(--muted); }
      .admin-tabs a:hover { color: var(--text); background: #eef5ef; }
      .admin-tabs a.is-active { background: var(--accent); color: #fff; box-shadow: 0 10px 24px rgba(22, 163, 74, 0.22); }
      .admin-tabs .json-link, .button-secondary { border: 1px solid var(--border); background: #fff; color: var(--text); }
      .admin-tabs .json-link { margin-left: auto; }
      .form { display: grid; gap: 18px; }
      .field-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; }
      label { display: grid; gap: 7px; font-weight: 700; }
      input, textarea, select { width: 100%; border: 1px solid var(--border); border-radius: 12px; padding: 11px 12px; background: #fbfdfb; color: var(--text); font: inherit; font-weight: 500; outline: none; }
      textarea { resize: vertical; }
      input:focus, textarea:focus, select:focus { border-color: var(--accent); box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 16%, transparent); }
      .switch-row { display: flex; align-items: center; gap: 12px; padding: 14px; border: 1px solid var(--border); border-radius: 16px; background: #fbfdfb; }
      .switch-row input { width: 20px; height: 20px; accent-color: var(--accent); }
      .switch-row span { display: grid; gap: 3px; }
      .success, .alert { margin: 16px 0; padding: 12px 14px; border-radius: 14px; font-weight: 700; }
      .success { background: #dcfce7; color: #166534; }
      .alert { background: #fee2e2; color: #991b1b; }
      .preview { display: grid; gap: 10px; padding-top: 8px; }
      .ad-preview { display: flex; align-items: center; gap: 14px; min-height: 92px; padding: 16px; border: 1px dashed color-mix(in srgb, var(--accent) 35%, var(--border)); border-radius: 18px; background: linear-gradient(135deg, color-mix(in srgb, var(--accent) 12%, transparent), transparent 46%), var(--bg); }
      .ad-preview img { width: 88px; height: 58px; border-radius: 12px; object-fit: cover; }
      .ad-preview div { flex: 1; min-width: 0; }
      .ad-preview strong { color: var(--accent); font-size: 12px; letter-spacing: 0.12em; text-transform: uppercase; }
      .ad-preview p { color: var(--muted); }
      .ad-preview span { padding: 8px 12px; border-radius: 999px; background: color-mix(in srgb, var(--accent) 14%, transparent); color: var(--accent); font-weight: 800; white-space: nowrap; }
      .ad-preview--large { min-height: 0; padding: 0; overflow: hidden; align-items: center; justify-content: center; }
      .ad-preview--large img { width: 100%; height: auto; min-height: 96px; max-height: 180px; aspect-ratio: 6 / 1; border-radius: 18px; }
      .ad-preview-placeholder { display: grid; width: 100%; min-height: 96px; place-items: center; color: var(--muted); font-weight: 800; }
      .ad-code-preview { padding: 16px; border: 1px dashed color-mix(in srgb, var(--accent) 35%, var(--border)); border-radius: 18px; background: #fbfdfb; color: var(--muted); font-weight: 700; }
      .actions { display: flex; flex-wrap: wrap; gap: 10px; }
      .metric-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 14px; margin-top: 20px; }
      .metric-card { display: grid; gap: 8px; padding: 16px; border: 1px solid var(--border); border-radius: 18px; background: #fbfdfb; }
      .metric-card span { color: var(--muted); font-size: 13px; font-weight: 800; }
      .metric-card strong { font-size: 28px; letter-spacing: -0.04em; }
      .analytics-updated { margin-top: 16px; }
      .analytics-columns { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 18px; }
      .count-list { display: grid; gap: 8px; margin-top: 12px; }
      .count-list div { display: flex; align-items: center; justify-content: space-between; gap: 10px; padding: 11px 12px; border: 1px solid var(--border); border-radius: 14px; background: #fbfdfb; }
      .count-list span { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
      .bar-list { display: grid; gap: 10px; }
      .bar-row { display: grid; grid-template-columns: 110px minmax(0, 1fr) 70px; gap: 12px; align-items: center; }
      .bar-row div { height: 12px; overflow: hidden; border-radius: 999px; background: #e8f2ea; }
      .bar-row i { display: block; height: 100%; border-radius: inherit; background: var(--accent); }
      .bar-row strong { text-align: right; }
      .table-wrap { overflow: auto; border: 1px solid var(--border); border-radius: 16px; }
      table { width: 100%; border-collapse: collapse; min-width: 860px; background: #fbfdfb; }
      th, td { padding: 12px 14px; border-bottom: 1px solid var(--border); text-align: left; vertical-align: top; }
      th { color: var(--muted); font-size: 12px; letter-spacing: 0.08em; text-transform: uppercase; }
      tr:last-child td { border-bottom: 0; }
      @media (max-width: 720px) { body { padding: 16px; } .card { padding: 20px; } .page-head, .section-head, .ad-preview { flex-direction: column; align-items: stretch; } .field-grid { grid-template-columns: 1fr; } .admin-tabs .json-link { margin-left: 0; } }
      @media (max-width: 900px) { .metric-grid, .analytics-columns { grid-template-columns: 1fr; } .bar-row { grid-template-columns: 92px minmax(0, 1fr) 52px; } }
    </style>
  </head>
  <body>${content}</body>
</html>`;
}

function hasAdminConfig(config) {
  return Boolean(config.adminPassword && config.adminCookieSecret);
}

function isAuthenticated(req, config) {
  return getCookie(req, ADMIN_COOKIE_NAME) === createAdminToken(config);
}

function createAdminToken(config) {
  return crypto
    .createHmac("sha256", config.adminCookieSecret)
    .update(`csvfilters-admin:${config.adminPassword}`)
    .digest("hex");
}

function buildCookie(value, maxAgeSeconds) {
  const parts = [
    `${ADMIN_COOKIE_NAME}=${encodeURIComponent(value)}`,
    "Path=/admin",
    "HttpOnly",
    "SameSite=Lax",
    `Max-Age=${maxAgeSeconds}`,
  ];
  return parts.join("; ");
}

function getCookie(req, name) {
  const raw = req.get("cookie") || "";
  const matched = raw
    .split(";")
    .map((item) => item.trim())
    .find((item) => item.startsWith(`${name}=`));
  return matched ? decodeURIComponent(matched.slice(name.length + 1)) : "";
}

function normalizeTab(value) {
  const tab = Array.isArray(value) ? value[0] : value;
  const normalized = String(tab || "ads").trim();
  return VALID_TABS.has(normalized) ? normalized : "ads";
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttribute(value) {
  return escapeHtml(value).replaceAll("\n", " ");
}

function formatNumber(value) {
  const number = Number(value) || 0;
  return number.toLocaleString("zh-CN");
}

function formatDisplayTime(value) {
  const date = new Date(value || "");
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleString("zh-CN", {
    hour12: false,
    timeZone: "Asia/Shanghai",
  });
}
