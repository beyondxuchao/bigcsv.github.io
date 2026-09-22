# CSVFilters Google 发布后台 Node.js 版

这个服务用于把 CSVFilters 里筛选后的数据发布到 Google Sheets。

它的核心作用是：把 Google OAuth 的 `client_secret` 和用户的 `refresh_token` 放在你的服务器上，而不是打包进桌面软件里。这样软件发给别人之后，不会暴露你的 Google 密钥。

## 功能

- 让用户在浏览器里登录 Google 并授权
- 接收 Google OAuth 回调
- 在服务器保存用户的 Google refresh token
- 创建 Google Sheet
- 分批写入表格数据
- 可选把 Google Sheet 设置为“知道链接的人可查看”
- 返回 Google Sheet 链接给 CSVFilters
- 给桌面端返回远程广告配置
- 接收匿名使用统计事件

## 目录说明

```text
server/google-publish-node-service/
  src/
    app.js              服务入口
    analytics.js        匿名埋点事件写入
    client-config.js    远程广告配置读取
    config.js           配置读取
    google-oauth.js     Google 登录授权
    google-publish.js   发布到 Google Sheets
    store.js            本地 token/session 存储
  .env.example          环境变量模板
  config/
    client-config.example.json  广告配置示例
  package.json          Node.js 依赖和启动命令
  README.md             当前说明
```

## 一、服务器需要准备什么

你的服务器上需要：

- 一台 Linux 服务器，推荐 Ubuntu 22.04 或 24.04
- 一个域名，比如 `csvfilters.com`
- Node.js 20 或更高版本
- Nginx
- HTTPS 证书，推荐用 Let's Encrypt
- Google Cloud 里的 OAuth Web Client

推荐部署路径：

```bash
/opt/csvfilters/google-publish-node-service
```

## 二、Google Cloud 需要怎么配置

进入 Google Cloud Console：

1. 创建或选择一个项目。
2. 启用 `Google Sheets API`。
3. 启用 `Google Drive API`。
4. 配置 OAuth consent screen。
5. 创建 OAuth 客户端。
6. 客户端类型选择 `Web application`。
7. 在 `Authorized redirect URIs` 里添加：

```text
https://csvfilters.com/oauth/google/callback
```

这里已经按你的域名 `csvfilters.com` 写好。

创建完成后，你会拿到：

```text
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
```

这两个只放服务器 `.env`，不要写进桌面软件。

## 三、本地怎么准备上传文件

在你的电脑上，进入项目根目录：

```powershell
cd H:\web\py
```

建议只上传这个后台文件夹，不要上传整个桌面软件项目：

```text
H:\web\py\server\google-publish-node-service
```

上传前不需要带这些内容：

```text
node_modules
data
.env
```

也就是说，上传源码即可，服务器上再执行 `npm install`。

## 四、怎么把文件上传到服务器

### 方式 1：用 scp 上传

如果你的服务器 SSH 地址是：

```text
root@你的服务器IP
```

可以在 Windows PowerShell 里执行：

```powershell
scp -r H:\web\py\server\google-publish-node-service root@你的服务器IP:/opt/csvfilters/
```

上传后服务器上的目录会是：

```text
/opt/csvfilters/google-publish-node-service
```

如果 `/opt/csvfilters` 不存在，先登录服务器创建：

```bash
ssh root@你的服务器IP
mkdir -p /opt/csvfilters
exit
```

### 方式 2：用压缩包上传

本地压缩这个文件夹：

```text
server/google-publish-node-service
```

然后用宝塔、1Panel、Xftp、WinSCP 等工具上传到服务器：

```text
/opt/csvfilters/
```

上传后在服务器解压，最终保持这个路径：

```text
/opt/csvfilters/google-publish-node-service
```

## 五、服务器安装 Node.js

如果服务器还没有 Node.js，推荐用 NodeSource 安装 Node.js 20：

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
node -v
npm -v
```

确认 Node.js 版本是 20 或更高。

## 六、安装依赖

登录服务器后执行：

```bash
cd /opt/csvfilters/google-publish-node-service
npm install
```

## 七、配置环境变量

复制环境变量模板：

```bash
cp .env.example .env
```

编辑 `.env`：

```bash
nano .env
```

示例配置：

```bash
APP_BASE_URL=https://csvfilters.com
PORT=8080
ALLOWED_ORIGINS=*

GOOGLE_CLIENT_ID=你的Google客户端ID
GOOGLE_CLIENT_SECRET=你的Google客户端密钥

DATA_DIR=./data
CLIENT_CONFIG_PATH=./data/client-config.json
JSON_BODY_LIMIT=50mb
PUBLISH_MAX_ROWS=50000
PUBLISH_CHUNK_SIZE=5000
```

说明：

- `APP_BASE_URL` 必须是你的 HTTPS 域名。
- `GOOGLE_CLIENT_ID` 和 `GOOGLE_CLIENT_SECRET` 来自 Google Cloud。
- `DATA_DIR` 是保存授权 token 的目录。
- `CLIENT_CONFIG_PATH` 是远程广告配置文件路径。
- `PUBLISH_MAX_ROWS` 是单次最多发布多少行，默认 50000。
- `ALLOWED_ORIGINS=*` 对桌面端比较方便，后面如果接网页版再收紧。

## 八、配置首页广告

先创建服务器广告配置文件：

```bash
mkdir -p /opt/csvfilters/google-publish-node-service/data
cp /opt/csvfilters/google-publish-node-service/config/client-config.example.json \
  /opt/csvfilters/google-publish-node-service/data/client-config.json
```

编辑：

```bash
nano /opt/csvfilters/google-publish-node-service/data/client-config.json
```

示例：

```json
{
  "analyticsEnabled": true,
  "ads": {
    "home": {
      "enabled": true,
      "label": "Sponsored",
      "title": "你的广告标题",
      "description": "这段内容会从服务器远程下发到首页广告位。",
      "ctaText": "了解更多",
      "imageUrl": "https://example.com/ad-image.png",
      "targetUrl": "https://example.com",
      "backgroundColor": "#f0fdf4",
      "accentColor": "#16a34a"
    }
  }
}
```

如果你想临时关闭广告：

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

前端会请求：

```text
GET https://csvfilters.com/api/client/config
```

返回广告配置后，首页上传区域和最近文件列表之间的广告位会自动显示远程内容。

## 九、配置前端远程服务器地址

桌面端使用这个环境变量写入远程服务器地址：

```bash
VITE_CSVFILTERS_REMOTE_BASE_URL=https://csvfilters.com
```

开发时也可以在浏览器控制台临时设置：

```js
localStorage.setItem("csvfilters:remote-base-url", "https://csvfilters.com")
```

取消临时设置：

```js
localStorage.removeItem("csvfilters:remote-base-url")
```

如果没有配置这个地址，桌面端不会请求远程服务器，也不会发送埋点。

## 十、匿名埋点

桌面端会向服务器发送匿名事件：

```text
POST https://csvfilters.com/api/analytics/events
```

当前事件包括：

```text
app_start
home_ad_impression
home_ad_click
csv_open_success
csv_open_failed
```

服务器会写入：

```text
/opt/csvfilters/google-publish-node-service/data/analytics-events.jsonl
```

每行是一条 JSON。这个版本不会上传 CSV 内容、文件名、完整文件路径、邮箱或 Google token。

## 十一、先手动启动测试

执行：

```bash
npm start
```

看到类似输出说明启动成功：

```text
Google publish service listening on http://0.0.0.0:8080
Google OAuth redirect URI: https://csvfilters.com/oauth/google/callback
```

另开一个终端测试：

```bash
curl http://127.0.0.1:8080/health
```

正常返回：

```json
{"status":"ok"}
```

测试成功后，按 `Ctrl + C` 停掉服务，继续配置 systemd。

## 十二、配置 systemd 后台运行

创建服务文件：

```bash
sudo nano /etc/systemd/system/csvfilters-google-publish.service
```

写入：

```ini
[Unit]
Description=CSVFilters Google Publish Node Service
After=network.target

[Service]
Type=simple
WorkingDirectory=/opt/csvfilters/google-publish-node-service
ExecStart=/usr/bin/node src/app.js
Restart=always
RestartSec=5
EnvironmentFile=/opt/csvfilters/google-publish-node-service/.env

[Install]
WantedBy=multi-user.target
```

启动服务：

```bash
sudo systemctl daemon-reload
sudo systemctl enable csvfilters-google-publish
sudo systemctl start csvfilters-google-publish
sudo systemctl status csvfilters-google-publish
```

查看日志：

```bash
journalctl -u csvfilters-google-publish -f
```

## 十三、配置 Nginx 反向代理

创建 Nginx 配置：

```bash
sudo nano /etc/nginx/sites-available/csvfilters-google-publish
```

写入：

```nginx
server {
  listen 80;
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

启用配置：

```bash
sudo ln -s /etc/nginx/sites-available/csvfilters-google-publish /etc/nginx/sites-enabled/csvfilters-google-publish
sudo nginx -t
sudo systemctl reload nginx
```

## 十四、配置 HTTPS

如果你用 Ubuntu + Nginx，可以用 Certbot：

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d csvfilters.com
```

完成后测试：

```bash
curl https://csvfilters.com/health
```

正常返回：

```json
{"status":"ok"}
```

## 十五、接口流程

### 1. 开始 Google 授权

```bash
curl -X POST https://csvfilters.com/api/google/oauth/start \
  -H "Content-Type: application/json" \
  -d '{"user_id":"test-user-001"}'
```

返回：

```json
{
  "session_id": "uuid",
  "authorization_url": "https://accounts.google.com/..."
}
```

打开 `authorization_url`，登录 Google 并授权。

### 2. 查询授权状态

```bash
curl https://csvfilters.com/api/google/oauth/status/你的session_id
```

授权成功后会看到：

```json
{
  "status": "complete",
  "connected": true,
  "account_email": "xxx@gmail.com"
}
```

### 3. 发布到 Google Sheets

```bash
curl -X POST https://csvfilters.com/api/google/publish \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "test-user-001",
    "spreadsheet_title": "CSVFilters Export",
    "sheet_title": "Filtered Results",
    "share_mode": "anyone-read",
    "columns": ["id", "name", "status"],
    "rows": [
      [1, "Alice", "paid"],
      [2, "Bob", "pending"]
    ]
  }'
```

成功后返回：

```json
{
  "spreadsheet_id": "xxx",
  "spreadsheet_url": "https://docs.google.com/spreadsheets/d/xxx/edit",
  "spreadsheet_title": "CSVFilters Export",
  "sheet_title": "Filtered Results",
  "row_count": 2,
  "share_mode": "anyone-read"
}
```

## 十六、更新服务

以后你本地修改了这个后台，重新上传覆盖服务器目录后执行：

```bash
cd /opt/csvfilters/google-publish-node-service
npm install
sudo systemctl restart csvfilters-google-publish
journalctl -u csvfilters-google-publish -f
```

注意不要覆盖服务器上的：

```text
.env
data/
```

`.env` 是服务器密钥配置，`data/` 里面保存用户授权 token。

## 十七、安全注意事项

- 不要把 `.env` 上传到 GitHub。
- 不要把 `GOOGLE_CLIENT_SECRET` 写进桌面软件。
- 服务器必须用 HTTPS，否则 Google OAuth 正式环境会有问题。
- `data/google-publish-store.json` 里保存 refresh token，要保护好服务器权限。
- 当前版本用 JSON 文件存 token，适合早期、小规模使用。
- 如果用户量变大，建议换成 PostgreSQL / MySQL / SQLite，并对 refresh token 加密。

## 十八、常见问题

### Google 提示 redirect_uri_mismatch

说明 Google Cloud 里配置的回调地址和你的 `.env` 不一致。

检查这两个是否完全一样：

```text
APP_BASE_URL=https://csvfilters.com
Google redirect URI=https://csvfilters.com/oauth/google/callback
```

### 授权后没有 refresh_token

这个服务默认用了：

```text
access_type=offline
prompt=consent
```

如果之前授权过但 token 异常，可以到 Google 账号安全设置里取消应用授权，然后重新授权。

### 发布失败，提示 Google account is not connected

说明这个 `user_id` 还没有完成 Google 授权，或者服务器 `data/` 目录被删除了。

### 数据量很大能不能直接发布

Google Sheets 有单表格单元格数量限制。特别大的 CSV 不建议完整写入 Google Sheets，可以只发布筛选结果，或者以后改成上传 CSV 文件到 Google Drive。
