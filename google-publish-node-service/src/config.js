import dotenv from "dotenv";
import path from "node:path";

dotenv.config();

function parseOrigins(value) {
  const normalized = String(value || "*")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
  return normalized.length > 0 ? normalized : ["*"];
}

function parsePositiveInt(value, fallback) {
  const parsed = Number.parseInt(String(value ?? ""), 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function trimTrailingSlash(value) {
  return String(value || "").replace(/\/+$/, "");
}

export function loadConfig() {
  const appBaseUrl = trimTrailingSlash(process.env.APP_BASE_URL || "");
  const googleClientId = String(process.env.GOOGLE_CLIENT_ID || "").trim();
  const googleClientSecret = String(process.env.GOOGLE_CLIENT_SECRET || "").trim();

  const missing = [];
  if (!appBaseUrl) missing.push("APP_BASE_URL");
  if (!googleClientId) missing.push("GOOGLE_CLIENT_ID");
  if (!googleClientSecret) missing.push("GOOGLE_CLIENT_SECRET");

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
  }

  const callbackPath = "/oauth/google/callback";
  const dataDir = path.resolve(process.cwd(), process.env.DATA_DIR || "./data");

  return {
    appBaseUrl,
    port: parsePositiveInt(process.env.PORT, 8080),
    allowedOrigins: parseOrigins(process.env.ALLOWED_ORIGINS),
    googleClientId,
    googleClientSecret,
    adminPassword: String(process.env.ADMIN_PASSWORD || "").trim(),
    adminCookieSecret: String(process.env.ADMIN_COOKIE_SECRET || process.env.ADMIN_PASSWORD || "").trim(),
    callbackPath,
    redirectUri: `${appBaseUrl}${callbackPath}`,
    dataDir,
    storePath: path.join(dataDir, "google-publish-store.json"),
    analyticsEventsPath: path.join(dataDir, "analytics-events.jsonl"),
    clientConfigPath: path.resolve(process.cwd(), process.env.CLIENT_CONFIG_PATH || path.join(dataDir, "client-config.json")),
    jsonBodyLimit: process.env.JSON_BODY_LIMIT || "50mb",
    publishMaxRows: parsePositiveInt(process.env.PUBLISH_MAX_ROWS, 50000),
    publishChunkSize: parsePositiveInt(process.env.PUBLISH_CHUNK_SIZE, 5000),
  };
}
