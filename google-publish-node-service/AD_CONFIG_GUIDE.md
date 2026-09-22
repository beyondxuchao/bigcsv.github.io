# CSVFilters 首页广告配置指南

这份文档只讲一件事：如何在你的网站服务器上配置 CSVFilters 软件首页的广告位。

当前软件默认会请求你的域名：

```text
https://csvfilters.com/api/client/config
```

如果服务器返回了广告配置，软件首页“上传区域”和“最近文件列表”之间的广告位就会显示远程广告。

## 一、你需要上传哪些文件

服务器上需要部署这个 Node.js 后台：

```text
server/google-publish-node-service
```

建议上传到服务器这个目录：

```text
/opt/csvfilters/google-publish-node-service
```

上传时需要带这些内容：

```text
package.json
src/
config/
.env.example
README.md
AD_CONFIG_GUIDE.md
```

不要上传这些内容：

```text
node_modules/
data/
.env
```

原因：

- `node_modules/` 服务器上执行 `npm install` 生成。
- `data/` 是服务器运行后保存广告配置、统计日志、Google token 的目录。
- `.env` 是服务器自己的密钥配置，不要从本地覆盖。

## 二、服务器安装依赖

登录服务器：

```bash
ssh root@你的服务器IP
```

进入服务目录：

```bash
cd /opt/csvfilters/google-publish-node-service
```

安装依赖：

```bash
npm install
```

## 三、配置 .env

如果还没有 `.env`，先复制：

```bash
cp .env.example .env
```

编辑：

```bash
nano .env
```

推荐配置：

```bash
APP_BASE_URL=https://csvfilters.com
PORT=8080
ALLOWED_ORIGINS=*

GOOGLE_CLIENT_ID=你的Google客户端ID
GOOGLE_CLIENT_SECRET=你的Google客户端密钥

ADMIN_PASSWORD=换成一个强密码
ADMIN_COOKIE_SECRET=换成一串很长的随机字符串

DATA_DIR=./data
CLIENT_CONFIG_PATH=./data/client-config.json
JSON_BODY_LIMIT=50mb
PUBLISH_MAX_ROWS=50000
PUBLISH_CHUNK_SIZE=5000
```

如果你暂时不启用 Google 发布，`GOOGLE_CLIENT_ID` 和 `GOOGLE_CLIENT_SECRET` 也可以先填占位值，但以后启用 Google 登录时必须换成真实值。

`ADMIN_PASSWORD` 是广告后台登录密码。

`ADMIN_COOKIE_SECRET` 用来签名登录状态，建议使用 32 位以上随机字符串。

## 四、使用可视化后台配置广告

服务启动后，打开：

```text
https://csvfilters.com/admin/ads
```

输入 `.env` 里的：

```text
ADMIN_PASSWORD
```

登录后可以直接在网页里配置：

```text
是否开启匿名统计
是否开启首页广告
广告标签
广告标题
广告描述
按钮文案
点击跳转链接
广告图片地址
背景色
强调色
广告代码 / 备注
软件通知是否开启
通知级别
通知标题/内容/链接
更新提醒是否开启
最新版本号
下载地址
更新说明
是否强制更新
```

页面分成三个区域：

```text
广告配置
软件通知
更新提醒
```

每个区域都有自己的保存按钮，可以单独保存，不会误覆盖其它区域。

点击保存后，服务器会自动写入：

```text
/opt/csvfilters/google-publish-node-service/data/client-config.json
```

保存后不需要重新打包软件。

软件下次读取远程配置时，就会显示新的广告内容。

## 五、手动创建广告配置文件

进入服务目录：

```bash
cd /opt/csvfilters/google-publish-node-service
```

创建 `data` 目录：

```bash
mkdir -p data
```

复制广告配置模板：

```bash
cp config/client-config.example.json data/client-config.json
```

编辑广告配置：

```bash
nano data/client-config.json
```

如果你已经使用上面的可视化后台，就不需要手动编辑这个 JSON 文件。

## 六、广告配置怎么写

完整示例：

```json
{
  "analyticsEnabled": true,
  "ads": {
    "home": {
      "enabled": true,
      "label": "Sponsored",
      "title": "CSVFilters Pro",
      "description": "这里可以放你的广告文案，软件会从服务器远程读取。",
      "ctaText": "了解更多",
      "imageUrl": "https://csvfilters.com/static/ad-image.png",
      "targetUrl": "https://csvfilters.com",
      "backgroundColor": "#f0fdf4",
      "accentColor": "#16a34a"
    }
  },
  "notice": {
    "enabled": true,
    "level": "info",
    "title": "新版本预告",
    "message": "CSVFilters 0.2.0 即将发布。",
    "linkText": "查看详情",
    "linkUrl": "https://csvfilters.com/changelog"
  },
  "update": {
    "enabled": true,
    "latestVersion": "0.2.0",
    "title": "CSVFilters 0.2.0 已发布",
    "releaseNotes": "修复问题并新增远程配置后台。",
    "downloadUrl": "https://csvfilters.com/download",
    "force": false
  }
}
```

字段说明：

```text
analyticsEnabled  是否开启匿名统计
ads.home.enabled  是否显示首页广告
label             广告小标签，比如 Sponsored / 推荐
title             广告标题
description       广告说明
ctaText           按钮文案
imageUrl          广告图片地址，可以为空
targetUrl         点击广告后打开的链接
backgroundColor   广告背景色
accentColor       广告强调色
```

## 七、怎么关闭广告

把 `enabled` 改成 `false`：

```json
{
  "analyticsEnabled": true,
  "ads": {
    "home": {
      "enabled": false
    }
  }
}
```

保存后，软件下次请求配置时就不会显示远程广告。

注意：用户也可以在软件里手动关闭广告位。用户关闭后，本机不会再显示广告，除非清除本地缓存。

## 八、广告图片放哪里

图片可以放在你网站自己的静态目录里，比如：

```text
https://csvfilters.com/static/ad-image.png
```

如果你用 Nginx，可以把图片放到：

```text
/var/www/csvfilters/static/ad-image.png
```

然后 Nginx 配置类似：

```nginx
location /static/ {
  root /var/www/csvfilters;
}
```

最终图片访问地址就是：

```text
https://csvfilters.com/static/ad-image.png
```

然后在 `data/client-config.json` 里写：

```json
"imageUrl": "https://csvfilters.com/static/ad-image.png"
```

## 九、启动服务

手动测试：

```bash
cd /opt/csvfilters/google-publish-node-service
npm start
```

如果启动成功，会看到：

```text
Google publish service listening on http://0.0.0.0:8080
```

测试配置接口：

```bash
curl https://csvfilters.com/api/client/config
```

应该返回类似：

```json
{
  "analyticsEnabled": true,
  "ads": {
    "home": {
      "enabled": true,
      "label": "Sponsored",
      "title": "CSVFilters Pro"
    }
  }
}
```

## 十、后台运行

如果你已经配置了 systemd，修改广告配置后一般不需要重启服务。

如果你改了代码，需要重启：

```bash
sudo systemctl restart csvfilters-google-publish
```

查看状态：

```bash
sudo systemctl status csvfilters-google-publish
```

查看日志：

```bash
journalctl -u csvfilters-google-publish -f
```

## 十一、Nginx 需要转发哪些接口

软件会请求：

```text
GET  /api/client/config
POST /api/analytics/events
```

如果你已经把整个域名反向代理到 Node 服务，下面这样就够：

```nginx
server {
  listen 443 ssl http2;
  server_name csvfilters.com;

  location / {
    proxy_pass http://127.0.0.1:8080;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}
```

如果你的网站首页还有别的程序，不想全部转发给 Node，可以只转发 API：

```nginx
location /api/ {
  proxy_pass http://127.0.0.1:8080;
  proxy_http_version 1.1;
  proxy_set_header Host $host;
  proxy_set_header X-Real-IP $remote_addr;
  proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  proxy_set_header X-Forwarded-Proto $scheme;
}

location /oauth/ {
  proxy_pass http://127.0.0.1:8080;
  proxy_http_version 1.1;
  proxy_set_header Host $host;
  proxy_set_header X-Real-IP $remote_addr;
  proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  proxy_set_header X-Forwarded-Proto $scheme;
}
```

广告功能只需要 `/api/`。

Google 登录发布功能才需要 `/oauth/`。

可视化广告后台还需要：

```text
/admin/
```

如果你只转发部分路径，记得加上：

```nginx
location /admin/ {
  proxy_pass http://127.0.0.1:8080;
  proxy_http_version 1.1;
  proxy_set_header Host $host;
  proxy_set_header X-Real-IP $remote_addr;
  proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  proxy_set_header X-Forwarded-Proto $scheme;
}
```

## 十二、怎么验证软件是否拉到了广告

1. 服务器确认接口正常：

```bash
curl https://csvfilters.com/api/client/config
```

2. 软件打开首页。

3. 首页上传区域和最近文件列表之间应该显示广告。

4. 点击广告，会打开 `targetUrl`。

5. 点击右上角关闭按钮，广告会隐藏。

如果你点过关闭，想重新显示，在软件开发者控制台执行：

```js
localStorage.removeItem("csvfilters:home-ad-dismissed")
```

## 十三、埋点日志在哪里

软件会把匿名事件发送到：

```text
POST https://csvfilters.com/api/analytics/events
```

服务器会写入：

```text
/opt/csvfilters/google-publish-node-service/data/analytics-events.jsonl
```

查看最近日志：

```bash
tail -f /opt/csvfilters/google-publish-node-service/data/analytics-events.jsonl
```

当前会记录：

```text
app_start
home_ad_impression
home_ad_click
home_ad_dismiss
csv_open_success
csv_open_failed
```

不会记录：

```text
CSV 文件内容
完整文件路径
文件名
用户邮箱
Google token
```

## 十四、修改广告后要不要重新打包软件

不需要。

广告内容来自服务器：

```text
/opt/csvfilters/google-publish-node-service/data/client-config.json
```

你只要修改这个文件，软件下次打开或刷新配置时就会读取新的广告内容。

只有当你改了软件前端代码，才需要重新打包软件。

## 十五、常见问题

### 软件里不显示广告

检查：

```bash
curl https://csvfilters.com/api/client/config
```

确认返回里：

```json
"enabled": true
```

并且至少有一个字段不为空：

```text
title
description
imageUrl
```

### 我关掉广告后怎么恢复

软件控制台执行：

```js
localStorage.removeItem("csvfilters:home-ad-dismissed")
```

### 图片不显示

确认 `imageUrl` 可以在浏览器里直接打开。

建议使用 HTTPS 图片地址。

### 点击广告没反应

确认 `targetUrl` 是 `https://` 或 `http://` 开头。

### 统计日志没有写入

检查服务日志：

```bash
journalctl -u csvfilters-google-publish -f
```

检查目录权限：

```bash
ls -lah /opt/csvfilters/google-publish-node-service/data
```
