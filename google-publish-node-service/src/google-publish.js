import { google } from "googleapis";
import { createOAuthClient } from "./google-oauth.js";
import { getGoogleAccount, upsertGoogleAccount } from "./store.js";

export class GooglePublishError extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    this.name = "GooglePublishError";
    this.statusCode = statusCode;
  }
}

export async function publishToGoogleSheets(config, payload) {
  const normalized = normalizePublishPayload(config, payload);
  const account = await getGoogleAccount(config, normalized.userId);

  if (!account || !account.refreshToken) {
    throw new GooglePublishError("Google account is not connected. Please complete Google authorization first.");
  }

  const oauth2Client = createOAuthClient(config);
  oauth2Client.setCredentials({ refresh_token: account.refreshToken });

  const sheets = google.sheets({ version: "v4", auth: oauth2Client });
  const drive = google.drive({ version: "v3", auth: oauth2Client });

  const spreadsheetResponse = await sheets.spreadsheets.create({
    requestBody: {
      properties: {
        title: normalized.spreadsheetTitle,
      },
      sheets: [
        {
          properties: {
            title: normalized.sheetTitle,
          },
        },
      ],
    },
    fields: "spreadsheetId,spreadsheetUrl",
  });

  const spreadsheetId = spreadsheetResponse.data.spreadsheetId;
  const spreadsheetUrl = spreadsheetResponse.data.spreadsheetUrl;

  if (!spreadsheetId || !spreadsheetUrl) {
    throw new GooglePublishError("Google Sheets did not return a spreadsheet id.");
  }

  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: `${quoteSheetName(normalized.sheetTitle)}!A1`,
    valueInputOption: "RAW",
    requestBody: {
      values: [normalized.columns],
    },
  });

  for (let index = 0; index < normalized.rows.length; index += config.publishChunkSize) {
    const chunk = normalized.rows.slice(index, index + config.publishChunkSize);
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `${quoteSheetName(normalized.sheetTitle)}!A2`,
      valueInputOption: "RAW",
      insertDataOption: "INSERT_ROWS",
      requestBody: {
        values: chunk,
      },
    });
  }

  if (normalized.shareMode === "anyone-read") {
    await drive.permissions.create({
      fileId: spreadsheetId,
      requestBody: {
        type: "anyone",
        role: "reader",
      },
      fields: "id",
    });
  }

  const credentials = oauth2Client.credentials || {};
  await upsertGoogleAccount(config, {
    ...account,
    lastAccessToken: credentials.access_token || account.lastAccessToken || "",
    expiryDate: credentials.expiry_date || account.expiryDate || 0,
  });

  return {
    spreadsheet_id: spreadsheetId,
    spreadsheet_url: spreadsheetUrl,
    spreadsheet_title: normalized.spreadsheetTitle,
    sheet_title: normalized.sheetTitle,
    row_count: normalized.rows.length,
    share_mode: normalized.shareMode,
  };
}

function normalizePublishPayload(config, payload) {
  const userId = String(payload.user_id || payload.userId || "").trim();
  if (!userId) {
    throw new GooglePublishError("user_id is required.");
  }

  const columns = Array.isArray(payload.columns)
    ? payload.columns.map((item) => String(item || "").trim()).filter(Boolean)
    : [];

  if (columns.length === 0) {
    throw new GooglePublishError("columns cannot be empty.");
  }

  const rows = Array.isArray(payload.rows) ? payload.rows : [];
  if (rows.length > config.publishMaxRows) {
    throw new GooglePublishError(`Too many rows. The current server limit is ${config.publishMaxRows}.`, 413);
  }

  const normalizedRows = rows.map((row) => normalizeRow(row, columns.length));
  const shareMode = payload.share_mode || payload.shareMode || "anyone-read";

  if (!["private", "anyone-read"].includes(shareMode)) {
    throw new GooglePublishError("share_mode must be private or anyone-read.");
  }

  return {
    userId,
    spreadsheetTitle: cleanTitle(payload.spreadsheet_title || payload.spreadsheetTitle, "CSVFilters Export"),
    sheetTitle: cleanTitle(payload.sheet_title || payload.sheetTitle, "Filtered Results"),
    shareMode,
    columns,
    rows: normalizedRows,
  };
}

function normalizeRow(row, columnCount) {
  const values = Array.isArray(row) ? row : [row];
  return Array.from({ length: columnCount }, (_, index) => normalizeCell(values[index]));
}

function normalizeCell(value) {
  if (value === null || value === undefined) return "";
  if (value instanceof Date) return value.toISOString();
  if (typeof value === "object") return JSON.stringify(value);
  return value;
}

function cleanTitle(value, fallback) {
  const normalized = String(value || "").trim();
  return normalized || fallback;
}

function quoteSheetName(sheetName) {
  return `'${String(sheetName).replaceAll("'", "''")}'`;
}
