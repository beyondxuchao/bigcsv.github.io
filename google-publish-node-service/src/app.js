import cors from "cors";
import express from "express";
import { registerAdminRoutes } from "./admin-ui.js";
import { appendAnalyticsEvents } from "./analytics.js";
import { readClientConfig } from "./client-config.js";
import { loadConfig } from "./config.js";
import {
  buildCallbackHtml,
  completeGoogleOAuth,
  GoogleOAuthError,
  startGoogleOAuth,
} from "./google-oauth.js";
import { publishToGoogleSheets, GooglePublishError } from "./google-publish.js";
import { getGoogleAccount, getOAuthSession, initStore } from "./store.js";

const config = loadConfig();

const app = express();

app.disable("x-powered-by");
app.use(express.json({ limit: config.jsonBodyLimit }));
app.use(express.urlencoded({ extended: false, limit: "1mb" }));
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || config.allowedOrigins.includes("*") || config.allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error(`Origin is not allowed: ${origin}`));
    },
    credentials: true,
  }),
);

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

registerAdminRoutes(app, config);

app.get("/api/client/config", async (_req, res, next) => {
  try {
    const clientConfig = await readClientConfig(config);
    res.setHeader("Cache-Control", "no-store");
    res.json(clientConfig);
  } catch (err) {
    next(err);
  }
});

app.post("/api/analytics/events", async (req, res, next) => {
  try {
    const result = await appendAnalyticsEvents(config, req.body || {}, req);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

app.post("/api/google/oauth/start", async (req, res, next) => {
  try {
    const result = await startGoogleOAuth(config, req.body?.user_id || req.body?.userId);
    res.json({
      session_id: result.sessionId,
      authorization_url: result.authorizationUrl,
    });
  } catch (err) {
    next(err);
  }
});

app.get(config.callbackPath, async (req, res) => {
  try {
    await completeGoogleOAuth(config, {
      state: req.query.state,
      code: req.query.code,
      error: req.query.error,
    });
    res
      .status(200)
      .type("html")
      .send(buildCallbackHtml("Google authorization complete", "You can return to CSVFilters and continue publishing."));
  } catch (err) {
    const message = err instanceof Error ? err.message : "Google authorization failed.";
    res
      .status(err instanceof GoogleOAuthError ? err.statusCode : 400)
      .type("html")
      .send(buildCallbackHtml("Google authorization failed", message, 400));
  }
});

app.get("/api/google/oauth/status/:sessionId", async (req, res, next) => {
  try {
    const session = await getOAuthSession(config, req.params.sessionId);
    if (!session) {
      res.status(404).json({ detail: "OAuth session not found." });
      return;
    }

    res.json({
      session_id: session.sessionId,
      user_id: session.userId,
      status: session.status,
      connected: session.status === "complete",
      account_email: session.accountEmail || "",
      error_message: session.errorMessage || "",
    });
  } catch (err) {
    next(err);
  }
});

app.get("/api/google/account/:userId", async (req, res, next) => {
  try {
    const account = await getGoogleAccount(config, req.params.userId);
    if (!account) {
      res.json({
        user_id: req.params.userId,
        connected: false,
        account_email: "",
        account_name: "",
      });
      return;
    }

    res.json({
      user_id: req.params.userId,
      connected: true,
      account_email: account.accountEmail || "",
      account_name: account.accountName || "",
    });
  } catch (err) {
    next(err);
  }
});

app.post("/api/google/publish", async (req, res, next) => {
  try {
    const result = await publishToGoogleSheets(config, req.body || {});
    res.json(result);
  } catch (err) {
    next(err);
  }
});

app.use((err, _req, res, _next) => {
  const statusCode = err instanceof GoogleOAuthError || err instanceof GooglePublishError
    ? err.statusCode
    : 500;
  const message = err instanceof Error ? err.message : "Internal server error.";
  res.status(statusCode).json({ detail: message });
});

async function main() {
  await initStore(config);

  app.listen(config.port, () => {
    console.log(`Google publish service listening on http://0.0.0.0:${config.port}`);
    console.log(`Google OAuth redirect URI: ${config.redirectUri}`);
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
