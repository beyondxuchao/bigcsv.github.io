import fs from "node:fs/promises";
import path from "node:path";

const STORE_VERSION = 1;

function createEmptyStore() {
  return {
    version: STORE_VERSION,
    oauthSessions: {},
    googleAccounts: {},
  };
}

export async function initStore(config) {
  await fs.mkdir(config.dataDir, { recursive: true });
  try {
    await fs.access(config.storePath);
  } catch {
    await writeStore(config, createEmptyStore());
  }
}

export async function readStore(config) {
  await initStore(config);
  const raw = await fs.readFile(config.storePath, "utf8");
  const parsed = JSON.parse(raw);
  return {
    ...createEmptyStore(),
    ...parsed,
    oauthSessions: parsed.oauthSessions || {},
    googleAccounts: parsed.googleAccounts || {},
  };
}

export async function writeStore(config, store) {
  await fs.mkdir(config.dataDir, { recursive: true });
  const tmpPath = `${config.storePath}.${process.pid}.tmp`;
  await fs.writeFile(tmpPath, `${JSON.stringify(store, null, 2)}\n`, "utf8");
  await fs.rename(tmpPath, config.storePath);
}

export async function updateStore(config, updater) {
  const store = await readStore(config);
  const result = await updater(store);
  await writeStore(config, store);
  return result;
}

export async function createOAuthSession(config, session) {
  return updateStore(config, (store) => {
    store.oauthSessions[session.sessionId] = session;
    return session;
  });
}

export async function getOAuthSession(config, sessionId) {
  const store = await readStore(config);
  return store.oauthSessions[sessionId] || null;
}

export async function markOAuthSessionComplete(config, sessionId, accountEmail) {
  return updateStore(config, (store) => {
    const session = store.oauthSessions[sessionId];
    if (!session) return null;
    session.status = "complete";
    session.accountEmail = accountEmail || "";
    session.errorMessage = "";
    session.completedAt = new Date().toISOString();
    return session;
  });
}

export async function markOAuthSessionError(config, sessionId, errorMessage) {
  return updateStore(config, (store) => {
    const session = store.oauthSessions[sessionId];
    if (!session) return null;
    session.status = "error";
    session.errorMessage = errorMessage || "Google authorization failed.";
    session.completedAt = new Date().toISOString();
    return session;
  });
}

export async function upsertGoogleAccount(config, account) {
  return updateStore(config, (store) => {
    store.googleAccounts[account.userId] = {
      ...(store.googleAccounts[account.userId] || {}),
      ...account,
      updatedAt: new Date().toISOString(),
    };
    return store.googleAccounts[account.userId];
  });
}

export async function getGoogleAccount(config, userId) {
  const store = await readStore(config);
  return store.googleAccounts[userId] || null;
}

export function getStoreDirectory(config) {
  return path.dirname(config.storePath);
}
