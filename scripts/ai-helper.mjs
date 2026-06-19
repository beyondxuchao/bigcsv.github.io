import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import os from 'node:os';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const helperPort = Number(process.env.LOCAL_LLM_HELPER_PORT || 11435);
const helperHost = process.env.LOCAL_LLM_HELPER_HOST || '127.0.0.1';
const dataDir = process.env.LOCAL_LLM_DATA_DIR || path.join(rootDir, '.local-ai');
const modelsDir = path.join(dataDir, 'models');
const runtimeDir = path.join(dataDir, 'runtime');
const modelRepository = process.env.LOCAL_LLM_MODEL_REPO || 'Qwen/Qwen3-4B-GGUF';
const modelVariant = process.env.LOCAL_LLM_MODEL_VARIANT || 'Q4_K_M';
const modelFileName =
  process.env.LOCAL_LLM_MODEL_FILENAME || `Qwen3-4B-${modelVariant}.gguf`;
const modelPath = path.join(modelsDir, modelFileName);
const defaultModelUrl = `https://huggingface.co/${modelRepository}/resolve/main/${modelFileName}?download=true`;
const modelUrl = process.env.LOCAL_LLM_MODEL_URL || defaultModelUrl;
const llamaServerPath = process.env.LLAMA_CPP_SERVER_PATH || '';
const llamaServerUrl = process.env.LLAMA_CPP_SERVER_URL || 'http://127.0.0.1:8080';
const llamaContextSize = Number(process.env.LLAMA_CPP_CONTEXT_SIZE || 8192);
const transportMode = (process.env.LOCAL_LLM_TRANSPORT || 'auto').toLowerCase();
const platform = os.platform();

/** @type {null | import('node:child_process').ChildProcessWithoutNullStreams} */
let llamaProcess = null;

const downloadState = {
  state: 'idle',
  progress: 0,
  downloadedBytes: 0,
  totalBytes: null,
  error: null,
};

const runtimeInstallState = {
  state: 'idle',
  progress: 0,
  downloadedBytes: 0,
  totalBytes: null,
  assetName: null,
  error: null,
};

function ensureDirectories() {
  fs.mkdirSync(modelsDir, { recursive: true });
  fs.mkdirSync(runtimeDir, { recursive: true });
}

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  });
  res.end(JSON.stringify(payload));
}

async function readJsonBody(req) {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(chunk);
  }

  if (chunks.length === 0) {
    return {};
  }

  return JSON.parse(Buffer.concat(chunks).toString('utf8'));
}

async function isRuntimeReachable() {
  try {
    const modelsResponse = await fetch(`${llamaServerUrl}/v1/models`);
    return modelsResponse.ok;
  } catch {
    return false;
  }
}

function findFileRecursive(directoryPath, fileName) {
  if (!fs.existsSync(directoryPath)) {
    return '';
  }

  const entries = fs.readdirSync(directoryPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(directoryPath, entry.name);
    if (entry.isDirectory()) {
      const nestedResult = findFileRecursive(fullPath, fileName);
      if (nestedResult) {
        return nestedResult;
      }
      continue;
    }

    if (entry.isFile() && entry.name.toLowerCase() === fileName.toLowerCase()) {
      return fullPath;
    }
  }

  return '';
}

function resolveLocalLlamaServerPath() {
  if (llamaServerPath && fs.existsSync(llamaServerPath)) {
    return llamaServerPath;
  }

  const binaryName = platform === 'win32' ? 'llama-server.exe' : 'llama-server';
  return findFileRecursive(runtimeDir, binaryName);
}

async function getCurrentTransportMode() {
  const runtimeReachable = await isRuntimeReachable();

  if (transportMode === 'mock') {
    return 'mock';
  }

  if (transportMode === 'llama.cpp') {
    return runtimeReachable ? 'llama.cpp' : 'mock';
  }

  return runtimeReachable ? 'llama.cpp' : 'mock';
}

async function getStatusPayload() {
  const runtimeReachable = await isRuntimeReachable();
  const resolvedLlamaServerPath = resolveLocalLlamaServerPath();
  const currentTransport = await getCurrentTransportMode();

  return {
    download: { ...downloadState },
    model: {
      present: fs.existsSync(modelPath),
      fileName: modelFileName,
      filePath: modelPath,
      downloadConfigured: Boolean(modelUrl),
      downloadUrl: modelUrl || null,
      repository: modelRepository,
      variant: modelVariant,
    },
    runtime: {
      mode: currentTransport,
      reachable: runtimeReachable,
      running: runtimeReachable || llamaProcess !== null,
      binaryConfigured: Boolean(resolvedLlamaServerPath),
      binaryPath: resolvedLlamaServerPath || null,
      serverUrl: llamaServerUrl,
    },
    runtimeInstall: {
      ...runtimeInstallState,
      supported: platform === 'win32',
      platform,
    },
  };
}

async function startModelDownload() {
  ensureDirectories();

  if (!modelUrl) {
    throw new Error('LOCAL_LLM_MODEL_URL is not configured. Point it to a Qwen3-4B GGUF download URL first.');
  }

  if (downloadState.state === 'downloading') {
    return;
  }

  downloadState.state = 'downloading';
  downloadState.progress = 0;
  downloadState.downloadedBytes = 0;
  downloadState.totalBytes = null;
  downloadState.error = null;

  const response = await fetch(modelUrl);
  if (!response.ok || !response.body) {
    downloadState.state = 'error';
    throw new Error(`Model download failed with status ${response.status}.`);
  }

  const totalBytesHeader = response.headers.get('content-length');
  downloadState.totalBytes = totalBytesHeader ? Number(totalBytesHeader) : null;

  const fileStream = fs.createWriteStream(modelPath);
  const reader = response.body.getReader();

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }

      if (value) {
        fileStream.write(Buffer.from(value));
        downloadState.downloadedBytes += value.byteLength;

        if (downloadState.totalBytes) {
          downloadState.progress = Math.min(
            100,
            (downloadState.downloadedBytes / downloadState.totalBytes) * 100
          );
        } else {
          downloadState.progress = Math.min(99, downloadState.progress + 1);
        }
      }
    }

    downloadState.state = 'completed';
    downloadState.progress = 100;
  } catch (error) {
    downloadState.state = 'error';
    downloadState.error = error instanceof Error ? error.message : 'Unknown download error';
    throw error;
  } finally {
    fileStream.end();
  }
}

function expandZipArchive(zipPath, destinationPath) {
  return new Promise((resolve, reject) => {
    const args =
      platform === 'win32'
        ? [
            '-NoProfile',
            '-Command',
            `Expand-Archive -LiteralPath '${zipPath.replace(/'/g, "''")}' -DestinationPath '${destinationPath.replace(/'/g, "''")}' -Force`,
          ]
        : [
            '-lc',
            `mkdir -p "${destinationPath}" && tar -xf "${zipPath}" -C "${destinationPath}"`,
          ];

    const command = platform === 'win32' ? 'powershell.exe' : 'bash';
    const child = spawn(command, args, {
      cwd: rootDir,
      stdio: 'ignore',
    });

    child.on('exit', (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`Archive extraction failed with exit code ${code}.`));
    });

    child.on('error', reject);
  });
}

async function resolveRuntimeDownloadAsset() {
  if (platform !== 'win32') {
    throw new Error('Automatic llama.cpp runtime installation is currently implemented for Windows only.');
  }

  const response = await fetch('https://api.github.com/repos/ggml-org/llama.cpp/releases/latest', {
    headers: {
      Accept: 'application/vnd.github+json',
      'User-Agent': 'csv-query-builder-local-ai-helper',
    },
  });

  if (!response.ok) {
    throw new Error(`Unable to fetch llama.cpp release metadata (${response.status}).`);
  }

  const release = await response.json();
  const assets = Array.isArray(release.assets) ? release.assets : [];
  const asset = assets.find((candidate) => {
    const name = String(candidate.name || '').toLowerCase();
    return (
      name.endsWith('.zip') &&
      name.includes('win') &&
      name.includes('x64') &&
      !name.includes('cuda') &&
      !name.includes('vulkan') &&
      !name.includes('sycl')
    );
  });

  if (!asset?.browser_download_url) {
    throw new Error('Could not find a Windows CPU llama.cpp release asset.');
  }

  return {
    name: asset.name,
    url: asset.browser_download_url,
  };
}

async function installRuntime() {
  ensureDirectories();

  if (runtimeInstallState.state === 'downloading') {
    return;
  }

  runtimeInstallState.state = 'downloading';
  runtimeInstallState.progress = 0;
  runtimeInstallState.downloadedBytes = 0;
  runtimeInstallState.totalBytes = null;
  runtimeInstallState.assetName = null;
  runtimeInstallState.error = null;

  const releaseAsset = await resolveRuntimeDownloadAsset();
  runtimeInstallState.assetName = releaseAsset.name;

  const zipPath = path.join(runtimeDir, releaseAsset.name);
  const response = await fetch(releaseAsset.url, {
    headers: {
      'User-Agent': 'csv-query-builder-local-ai-helper',
    },
  });

  if (!response.ok || !response.body) {
    runtimeInstallState.state = 'error';
    throw new Error(`Runtime download failed with status ${response.status}.`);
  }

  const totalBytesHeader = response.headers.get('content-length');
  runtimeInstallState.totalBytes = totalBytesHeader ? Number(totalBytesHeader) : null;
  const reader = response.body.getReader();
  const fileStream = fs.createWriteStream(zipPath);

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }

      if (!value) {
        continue;
      }

      fileStream.write(Buffer.from(value));
      runtimeInstallState.downloadedBytes += value.byteLength;

      if (runtimeInstallState.totalBytes) {
        runtimeInstallState.progress = Math.min(
          95,
          (runtimeInstallState.downloadedBytes / runtimeInstallState.totalBytes) * 100
        );
      }
    }
  } finally {
    fileStream.end();
  }

  runtimeInstallState.state = 'extracting';
  runtimeInstallState.progress = 97;

  const extractTarget = path.join(runtimeDir, 'llama.cpp');
  fs.rmSync(extractTarget, { recursive: true, force: true });
  fs.mkdirSync(extractTarget, { recursive: true });

  await expandZipArchive(zipPath, extractTarget);

  runtimeInstallState.state = 'completed';
  runtimeInstallState.progress = 100;
}

function startLlamaRuntime() {
  if (!fs.existsSync(modelPath)) {
    throw new Error('Download the GGUF model before starting llama.cpp.');
  }

  if (llamaProcess) {
    return { mode: 'llama.cpp', alreadyRunning: true };
  }

  const resolvedLlamaServerPath = resolveLocalLlamaServerPath();
  if (!resolvedLlamaServerPath) {
    throw new Error('llama-server was not found. Install the runtime first or set LLAMA_CPP_SERVER_PATH.');
  }

  llamaProcess = spawn(
    resolvedLlamaServerPath,
    [
      '--host',
      '127.0.0.1',
      '--port',
      new URL(llamaServerUrl).port || '8080',
      '--model',
      modelPath,
      '--ctx-size',
      String(llamaContextSize),
      '--alias',
      'local-qwen3-4b',
      '--jinja',
    ],
    {
      cwd: rootDir,
      stdio: 'inherit',
    }
  );

  llamaProcess.on('exit', () => {
    llamaProcess = null;
  });

  return { mode: 'llama.cpp', alreadyRunning: false };
}

function buildSystemPrompt(csvContext) {
  return [
    'You are Smart CSV Assistant.',
    'You help users understand CSV files, suggest filters, explain likely anomalies, and propose next analytical steps.',
    'Use only the provided CSV context and sample rows. If the user asks for an exact result not available from the sample, say so clearly and suggest the query or filter they should run.',
    'Keep responses concise and practical for business users.',
    `CSV context: ${JSON.stringify(csvContext)}`,
  ].join('\n');
}

function buildMockReply(csvContext, latestUserPrompt) {
  const topColumns = csvContext.columns.slice(0, 5).map((column) => column.name).join(', ');
  const numericColumns = csvContext.columns
    .filter((column) => column.type === 'number')
    .slice(0, 3)
    .map((column) => column.name);

  const suggestions = [];

  if (numericColumns.length > 0) {
    suggestions.push(
      `Start by sorting ${numericColumns[0]} descending and reviewing the top 20 rows for outliers.`
    );
  }

  const sparseColumn = csvContext.columns.find(
    (column) => column.nonEmptyValues < Math.max(3, csvContext.sampleRows.length - 2)
  );
  if (sparseColumn) {
    suggestions.push(`Check missing values in ${sparseColumn.name} before segmenting the dataset.`);
  }

  suggestions.push(`Focus first on columns like ${topColumns} to shape your first filter set.`);

  return [
    `Mock mode is active, so this reply is based on the schema and sample rows from ${csvContext.fileName}.`,
    `You asked: "${latestUserPrompt}"`,
    `The dataset currently looks like ${csvContext.rowCount.toLocaleString()} rows across ${csvContext.columnCount} columns.`,
    suggestions.map((item, index) => `${index + 1}. ${item}`).join('\n'),
    'Once llama.cpp is running, the same flow will route this context through the local GGUF model.',
  ].join('\n\n');
}

async function chatWithRuntime(messages, csvContext) {
  const latestUserPrompt = [...messages].reverse().find((message) => message.role === 'user')?.content || '';
  const currentTransport = await getCurrentTransportMode();

  if (currentTransport !== 'llama.cpp') {
    return buildMockReply(csvContext, latestUserPrompt);
  }

  const promptMessages = [
    { role: 'system', content: buildSystemPrompt(csvContext) },
    ...messages.map((message) => ({
      role: message.role,
      content: message.content,
    })),
  ];

  const response = await fetch(`${llamaServerUrl}/v1/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'local-qwen3-4b',
      temperature: 0.2,
      messages: promptMessages,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`llama.cpp request failed: ${text}`);
  }

  const payload = await response.json();
  const message = payload?.choices?.[0]?.message?.content;

  if (!message) {
    throw new Error('llama.cpp did not return a chat response.');
  }

  return message;
}

const server = http.createServer(async (req, res) => {
  if (!req.url) {
    sendJson(res, 404, { error: 'Not found' });
    return;
  }

  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    });
    res.end();
    return;
  }

  if (req.method === 'GET' && req.url === '/health') {
    const currentTransport = await getCurrentTransportMode();
    sendJson(res, 200, {
      status: 'ok',
      helperVersion: '0.1.0',
      transportMode: currentTransport,
      llamaServerUrl,
      modelPath,
    });
    return;
  }

  if (req.method === 'GET' && req.url === '/models/status') {
    sendJson(res, 200, await getStatusPayload());
    return;
  }

  if (req.method === 'POST' && req.url === '/models/download') {
    if (!modelUrl) {
      sendJson(res, 400, {
        error:
          'LOCAL_LLM_MODEL_URL is not configured. Point it to a Qwen3-4B GGUF download URL first.',
      });
      return;
    }

    if (downloadState.state === 'downloading') {
      sendJson(res, 202, { accepted: true, alreadyDownloading: true });
      return;
    }

    downloadState.error = null;
    void startModelDownload().catch((error) => {
      downloadState.state = 'error';
      downloadState.error =
        error instanceof Error ? error.message : 'Unable to complete the model download.';
    });
    sendJson(res, 202, { accepted: true });
    return;
  }

  if (req.method === 'POST' && req.url === '/runtime/install') {
    if (runtimeInstallState.state === 'downloading' || runtimeInstallState.state === 'extracting') {
      sendJson(res, 202, { accepted: true, alreadyInstalling: true });
      return;
    }

    runtimeInstallState.error = null;
    void installRuntime().catch((error) => {
      runtimeInstallState.state = 'error';
      runtimeInstallState.error =
        error instanceof Error ? error.message : 'Unable to install llama.cpp runtime.';
    });
    sendJson(res, 202, { accepted: true });
    return;
  }

  if (req.method === 'POST' && (req.url === '/models/start' || req.url === '/runtime/start')) {
    try {
      const result = startLlamaRuntime();
      sendJson(res, 200, result);
    } catch (error) {
      sendJson(res, 400, {
        error: error instanceof Error ? error.message : 'Unable to start llama.cpp.',
      });
    }
    return;
  }

  if (req.method === 'POST' && req.url === '/chat') {
    try {
      const payload = await readJsonBody(req);
      const csvContext = payload.csvContext;
      const messages = Array.isArray(payload.messages) ? payload.messages : [];

      if (!csvContext || messages.length === 0) {
        sendJson(res, 400, {
          error: 'csvContext and messages are required.',
        });
        return;
      }

      const message = await chatWithRuntime(messages, csvContext);
      sendJson(res, 200, { message });
    } catch (error) {
      sendJson(res, 500, {
        error: error instanceof Error ? error.message : 'Unable to complete the chat request.',
      });
    }
    return;
  }

  sendJson(res, 404, { error: 'Not found' });
});

server.listen(helperPort, helperHost, () => {
  ensureDirectories();
  console.log(`AI helper listening on http://${helperHost}:${helperPort}`);
  console.log(`Runtime mode preference: ${transportMode}`);
  console.log(`Model path: ${modelPath}`);
});
