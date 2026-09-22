import crypto from "node:crypto";
import { google } from "googleapis";
import {
  createOAuthSession,
  getGoogleAccount,
  getOAuthSession,
  markOAuthSessionComplete,
  markOAuthSessionError,
  upsertGoogleAccount,
} from "./store.js";

const GOOGLE_SCOPES = [
  "https://www.googleapis.com/auth/spreadsheets",
  "https://www.googleapis.com/auth/drive.file",
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/userinfo.profile",
];

export class GoogleOAuthError extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    this.name = "GoogleOAuthError";
    this.statusCode = statusCode;
  }
}

export function createOAuthClient(config) {
  return new google.auth.OAuth2(
    config.googleClientId,
    config.googleClientSecret,
    config.redirectUri,
  );
}

export async function startGoogleOAuth(config, userId) {
  const normalizedUserId = normalizeUserId(userId);
  const sessionId = crypto.randomUUID();
  const now = new Date().toISOString();

  await createOAuthSession(config, {
    sessionId,
    userId: normalizedUserId,
    status: "pending",
    accountEmail: "",
    errorMessage: "",
    createdAt: now,
    completedAt: "",
  });

  const oauth2Client = createOAuthClient(config);
  const authorizationUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: GOOGLE_SCOPES,
    state: sessionId,
  });

  return { sessionId, authorizationUrl };
}

export async function completeGoogleOAuth(config, { state, code, error }) {
  const sessionId = String(state || "").trim();
  if (!sessionId) {
    throw new GoogleOAuthError("Missing OAuth state.");
  }

  const session = await getOAuthSession(config, sessionId);
  if (!session) {
    throw new GoogleOAuthError("OAuth session not found.", 404);
  }

  if (error) {
    const errorMessage = `Google returned an OAuth error: ${error}`;
    await markOAuthSessionError(config, sessionId, errorMessage);
    throw new GoogleOAuthError(errorMessage);
  }

  if (!code) {
    const errorMessage = "Missing OAuth authorization code.";
    await markOAuthSessionError(config, sessionId, errorMessage);
    throw new GoogleOAuthError(errorMessage);
  }

  try {
    const oauth2Client = createOAuthClient(config);
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    const accountProfile = await getGoogleProfile(oauth2Client);
    const accountEmail = accountProfile.email || "";
    const existingAccount = await getGoogleAccount(config, session.userId);

    await upsertGoogleAccount(config, {
      userId: session.userId,
      accountEmail,
      accountName: accountProfile.name || "",
      refreshToken: tokens.refresh_token || existingAccount?.refreshToken || "",
      tokenType: tokens.token_type || "",
      scope: tokens.scope || "",
      expiryDate: tokens.expiry_date || 0,
      lastAccessToken: tokens.access_token || "",
    });

    await markOAuthSessionComplete(config, sessionId, accountEmail);
    return { sessionId, userId: session.userId, accountEmail };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Google OAuth token exchange failed.";
    await markOAuthSessionError(config, sessionId, errorMessage);
    throw new GoogleOAuthError(errorMessage);
  }
}

async function getGoogleProfile(oauth2Client) {
  const oauth2 = google.oauth2({ version: "v2", auth: oauth2Client });
  const response = await oauth2.userinfo.get();
  return response.data || {};
}

function normalizeUserId(userId) {
  const normalized = String(userId || "").trim();
  if (!normalized) {
    throw new GoogleOAuthError("user_id is required.");
  }
  if (normalized.length > 200) {
    throw new GoogleOAuthError("user_id is too long.");
  }
  return normalized;
}

export function buildCallbackHtml(title, message, statusCode = 200) {
  const safeTitle = escapeHtml(title);
  const safeMessage = escapeHtml(message);
  const color = statusCode >= 400 ? "#b42318" : "#087443";
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${safeTitle}</title>
    <style>
      body { margin: 0; min-height: 100vh; display: grid; place-items: center; font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; background: #f6f7f9; color: #111827; }
      main { width: min(520px, calc(100vw - 32px)); padding: 32px; border-radius: 24px; background: #fff; box-shadow: 0 24px 80px rgba(15, 23, 42, 0.12); }
      h1 { margin: 0 0 12px; font-size: 24px; color: ${color}; }
      p { margin: 0; line-height: 1.7; color: #4b5563; }
    </style>
  </head>
  <body>
    <main>
      <h1>${safeTitle}</h1>
      <p>${safeMessage}</p>
    </main>
  </body>
</html>`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
