import fs from "node:fs/promises";

const MAX_BATCH_EVENTS = 25;
const MAX_ANALYTICS_READ_BYTES = 5 * 1024 * 1024;
const RECENT_EVENT_LIMIT = 30;

export async function appendAnalyticsEvents(config, payload, req) {
  const events = normalizeEvents(payload, req);
  if (events.length === 0) {
    return { accepted: 0 };
  }

  await fs.mkdir(config.dataDir, { recursive: true });
  const lines = events.map((event) => JSON.stringify(event)).join("\n");
  await fs.appendFile(config.analyticsEventsPath, `${lines}\n`, "utf8");
  return { accepted: events.length };
}

export async function getAnalyticsSummary(config) {
  const events = await readRecentAnalyticsEvents(config.analyticsEventsPath);
  const now = new Date();
  const todayKey = formatDateKey(now);
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const uniqueDevices = new Set();
  const sevenDayDevices = new Set();
  const thirtyDayDevices = new Set();
  const eventCounts = new Map();
  const platformCounts = new Map();
  const versionCounts = new Map();
  const dailyCounts = new Map();
  let todayEvents = 0;

  for (const event of events) {
    const eventDate = parseEventDate(event);
    const eventName = cleanText(event.event, 80) || "unknown";
    const deviceId = cleanText(event.device_id || event.deviceId, 120);
    const platform = cleanText(event.platform, 40) || "unknown";
    const version = cleanText(event.app_version || event.appVersion, 40) || "unknown";
    const dateKey = eventDate ? formatDateKey(eventDate) : "unknown";

    incrementMap(eventCounts, eventName);
    incrementMap(platformCounts, platform);
    incrementMap(versionCounts, version);
    incrementMap(dailyCounts, dateKey);

    if (deviceId) {
      uniqueDevices.add(deviceId);
      if (eventDate && eventDate >= sevenDaysAgo) {
        sevenDayDevices.add(deviceId);
      }
      if (eventDate && eventDate >= thirtyDaysAgo) {
        thirtyDayDevices.add(deviceId);
      }
    }

    if (dateKey === todayKey) {
      todayEvents += 1;
    }
  }

  const recentEvents = events
    .slice(-RECENT_EVENT_LIMIT)
    .reverse()
    .map((event) => ({
      event: cleanText(event.event, 80),
      app_version: cleanText(event.app_version || event.appVersion, 40),
      platform: cleanText(event.platform, 40),
      device_id: maskDeviceId(cleanText(event.device_id || event.deviceId, 120)),
      timestamp: cleanText(event.timestamp, 40),
      received_at: cleanText(event.received_at, 40),
      properties: event.properties && typeof event.properties === "object" ? event.properties : {},
    }));

  return {
    generatedAt: now.toISOString(),
    sampledEvents: events.length,
    totals: {
      events: events.length,
      uniqueDevices: uniqueDevices.size,
      todayEvents,
      sevenDayActiveDevices: sevenDayDevices.size,
      thirtyDayActiveDevices: thirtyDayDevices.size,
      appStarts: eventCounts.get("app_start") || 0,
      csvOpens: eventCounts.get("csv_open_success") || 0,
      csvOpenFailures: eventCounts.get("csv_open_failed") || 0,
      adImpressions: eventCounts.get("home_ad_impression") || 0,
      adClicks: eventCounts.get("home_ad_click") || 0,
      adDismisses: eventCounts.get("home_ad_dismiss") || 0,
    },
    eventCounts: mapToSortedEntries(eventCounts),
    platformCounts: mapToSortedEntries(platformCounts),
    versionCounts: mapToSortedEntries(versionCounts),
    dailyCounts: buildDailySeries(dailyCounts, 14),
    recentEvents,
  };
}

async function readRecentAnalyticsEvents(filePath) {
  try {
    const stat = await fs.stat(filePath);
    const bytesToRead = Math.min(stat.size, MAX_ANALYTICS_READ_BYTES);
    const file = await fs.open(filePath, "r");
    try {
      const buffer = Buffer.alloc(bytesToRead);
      await file.read(buffer, 0, bytesToRead, stat.size - bytesToRead);
      const text = buffer.toString("utf8");
      const lines = text.split(/\r?\n/).filter(Boolean);
      const usableLines = stat.size > bytesToRead ? lines.slice(1) : lines;
      return usableLines.map(parseJsonLine).filter(Boolean);
    } finally {
      await file.close();
    }
  } catch (error) {
    if (error?.code !== "ENOENT") {
      console.warn(`Unable to read analytics events: ${error.message}`);
    }
    return [];
  }
}

function parseJsonLine(line) {
  try {
    const parsed = JSON.parse(line);
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
}

function parseEventDate(event) {
  const date = new Date(event.received_at || event.timestamp || "");
  return Number.isNaN(date.getTime()) ? null : date;
}

function formatDateKey(date) {
  return date.toISOString().slice(0, 10);
}

function incrementMap(map, key) {
  map.set(key, (map.get(key) || 0) + 1);
}

function mapToSortedEntries(map) {
  return Array.from(map.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

function buildDailySeries(dailyCounts, days) {
  const result = [];
  const now = new Date();
  for (let index = days - 1; index >= 0; index -= 1) {
    const date = new Date(now.getTime() - index * 24 * 60 * 60 * 1000);
    const key = formatDateKey(date);
    result.push({ date: key, count: dailyCounts.get(key) || 0 });
  }
  return result;
}

function maskDeviceId(value) {
  if (!value) {
    return "";
  }
  if (value.length <= 12) {
    return value;
  }
  return `${value.slice(0, 8)}...${value.slice(-4)}`;
}

function normalizeEvents(payload, req) {
  const rawEvents = Array.isArray(payload?.events) ? payload.events : [payload];
  return rawEvents.slice(0, MAX_BATCH_EVENTS).map((event) => normalizeEvent(event, req)).filter(Boolean);
}

function normalizeEvent(event, req) {
  if (!event || typeof event !== "object") {
    return null;
  }

  const eventName = cleanText(event.event, 80);
  if (!eventName) {
    return null;
  }

  return {
    event: eventName,
    app_version: cleanText(event.app_version || event.appVersion, 40),
    platform: cleanText(event.platform, 40),
    device_id: cleanText(event.device_id || event.deviceId, 120),
    timestamp: cleanText(event.timestamp, 40) || new Date().toISOString(),
    received_at: new Date().toISOString(),
    properties: normalizeProperties(event.properties),
    user_agent: cleanText(req.get("user-agent"), 240),
  };
}

function normalizeProperties(properties) {
  if (!properties || typeof properties !== "object" || Array.isArray(properties)) {
    return {};
  }

  return Object.fromEntries(
    Object.entries(properties)
      .slice(0, 30)
      .map(([key, value]) => [cleanText(key, 64), normalizePropertyValue(value)])
      .filter(([key, value]) => key && value !== undefined),
  );
}

function normalizePropertyValue(value) {
  if (typeof value === "string") return cleanText(value, 200);
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "boolean") return value;
  if (value === null) return null;
  return undefined;
}

function cleanText(value, maxLength) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}
