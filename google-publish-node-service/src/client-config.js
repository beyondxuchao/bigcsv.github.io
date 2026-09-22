import fs from "node:fs/promises";

const DEFAULT_CLIENT_CONFIG = {
  analyticsEnabled: true,
  ads: {
    home: {
      enabled: false,
    },
  },
  notice: {
    enabled: false,
    level: "info",
  },
  update: {
    enabled: false,
    force: false,
  },
};

export async function readClientConfig(config) {
  try {
    const raw = await fs.readFile(config.clientConfigPath, "utf8");
    const parsed = JSON.parse(raw);
    return sanitizeClientConfig(parsed, config);
  } catch (error) {
    if (error?.code !== "ENOENT") {
      console.warn(`Unable to read client config: ${error.message}`);
    }
    return DEFAULT_CLIENT_CONFIG;
  }
}

export async function writeClientConfig(config, nextConfig) {
  const sanitized = sanitizeClientConfig(nextConfig, config);
  await fs.mkdir(config.dataDir, { recursive: true });
  await fs.writeFile(config.clientConfigPath, `${JSON.stringify(sanitized, null, 2)}\n`, "utf8");
  return sanitized;
}

function sanitizeClientConfig(value, config) {
  if (!value || typeof value !== "object") {
    return DEFAULT_CLIENT_CONFIG;
  }

  return {
    analyticsEnabled: value.analyticsEnabled !== false,
    ads: {
      home: sanitizeHomeAd(value.ads?.home, config),
    },
    notice: sanitizeNotice(value.notice, config),
    update: sanitizeUpdate(value.update, config),
  };
}

function sanitizeHomeAd(value, config) {
  if (!value || typeof value !== "object") {
    return { enabled: false };
  }

  return {
    enabled: Boolean(value.enabled),
    updatedAt: cleanText(value.updatedAt, 40),
    imageMode: value.imageMode === "large" ? "large" : "small",
    label: cleanText(value.label, 80),
    title: cleanText(value.title, 120),
    description: cleanText(value.description, 240),
    ctaText: cleanText(value.ctaText, 40),
    code: cleanText(value.code, 5000),
    imageUrl: cleanHttpUrl(value.imageUrl, config),
    targetUrl: cleanHttpUrl(value.targetUrl, config),
    backgroundColor: cleanColor(value.backgroundColor),
    accentColor: cleanColor(value.accentColor),
  };
}

function sanitizeNotice(value, config) {
  if (!value || typeof value !== "object") {
    return { enabled: false, level: "info" };
  }

  const level = ["info", "success", "warning", "error"].includes(value.level) ? value.level : "info";
  return {
    enabled: Boolean(value.enabled),
    level,
    title: cleanText(value.title, 120),
    message: cleanText(value.message, 500),
    linkText: cleanText(value.linkText, 40),
    linkUrl: cleanHttpUrl(value.linkUrl, config),
  };
}

function sanitizeUpdate(value, config) {
  if (!value || typeof value !== "object") {
    return { enabled: false, force: false };
  }

  return {
    enabled: Boolean(value.enabled),
    latestVersion: cleanText(value.latestVersion, 40),
    title: cleanText(value.title, 120),
    releaseNotes: cleanText(value.releaseNotes, 1000),
    downloadUrl: cleanHttpUrl(value.downloadUrl, config),
    force: Boolean(value.force),
  };
}

function cleanText(value, maxLength) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function cleanColor(value) {
  const text = cleanText(value, 20);
  return /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(text) ? text : "";
}

function cleanHttpUrl(value, config) {
  const text = cleanText(value, 500);
  if (!text) {
    return "";
  }

  try {
    const url = text.startsWith("/") ? new URL(text, config?.appBaseUrl || "https://csvfilters.com") : new URL(text);
    return url.protocol === "https:" || url.protocol === "http:" ? url.toString() : "";
  } catch {
    return "";
  }
}
