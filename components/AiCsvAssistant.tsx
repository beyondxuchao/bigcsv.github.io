'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  Bot,
  CheckCircle2,
  Cpu,
  Download,
  Loader2,
  MessageSquare,
  RefreshCw,
  Rocket,
  ServerCrash,
  Upload,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FileUpload } from '@/components/FileUpload';
import { PageCard } from '@/components/PageShell';
import { parseCSV } from '@/lib/csvParser';
import { StreamingCsvParser, StreamingProgress } from '@/lib/streamingCsvParser';
import { CsvAssistantContext, buildCsvAssistantContext } from '@/lib/aiCsvAssistant';

const HELPER_URL = 'http://127.0.0.1:11435';

type ConnectionState = 'checking' | 'online' | 'offline';

interface HelperHealthResponse {
  status: string;
  helperVersion: string;
  transportMode: 'llama.cpp' | 'mock';
  llamaServerUrl: string;
  modelPath: string;
}

interface ModelStatusResponse {
  download: {
    state: 'idle' | 'downloading' | 'completed' | 'error';
    progress: number;
    downloadedBytes: number;
    totalBytes: number | null;
    error: string | null;
  };
  model: {
    present: boolean;
    fileName: string;
    filePath: string;
    downloadConfigured: boolean;
    downloadUrl: string | null;
    repository: string;
    variant: string;
  };
  runtime: {
    mode: 'llama.cpp' | 'mock';
    reachable: boolean;
    running: boolean;
    binaryConfigured: boolean;
    binaryPath: string | null;
    serverUrl: string;
  };
  runtimeInstall: {
    state: 'idle' | 'downloading' | 'extracting' | 'completed' | 'error';
    progress: number;
    downloadedBytes: number;
    totalBytes: number | null;
    assetName: string | null;
    error: string | null;
    supported: boolean;
    platform: string;
  };
}

interface ChatMessage {
  role: 'assistant' | 'user';
  content: string;
}

function formatBytes(value: number) {
  if (!Number.isFinite(value) || value <= 0) {
    return '0 B';
  }

  const units = ['B', 'KB', 'MB', 'GB'];
  let size = value;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex += 1;
  }

  return `${size.toFixed(size >= 100 || unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
}

function StatPill({
  label,
  value,
  tone = 'default',
}: {
  label: string;
  value: string;
  tone?: 'default' | 'success' | 'warning';
}) {
  const toneClassName =
    tone === 'success'
      ? 'bg-green-100 text-green-800 border-green-200'
      : tone === 'warning'
        ? 'bg-amber-100 text-amber-800 border-amber-200'
        : 'bg-slate-100 text-slate-700 border-slate-200';

  return (
    <div className={`rounded-full border px-3 py-1 text-xs font-medium ${toneClassName}`}>
      {label}: {value}
    </div>
  );
}

async function parseCsvForAssistant(
  file: File,
  onProgress: (progress: number, status: string) => void
) {
  const useStreaming = file.size > 10 * 1024 * 1024;

  if (useStreaming) {
    const result = await StreamingCsvParser.parseWithStreaming(
      file,
      (progress: StreamingProgress) => {
        onProgress(
          progress.percentage,
          `Scanning ${progress.rowsProcessed.toLocaleString()} rows (${progress.percentage.toFixed(0)}%)`
        );
      }
    );

    return result.data;
  }

  onProgress(15, 'Parsing CSV...');
  const result = await parseCSV(file);
  onProgress(100, `Loaded ${result.data.length.toLocaleString()} rows`);
  return result.data;
}

export function AiCsvAssistant() {
  const [connectionState, setConnectionState] = useState<ConnectionState>('checking');
  const [health, setHealth] = useState<HelperHealthResponse | null>(null);
  const [modelStatus, setModelStatus] = useState<ModelStatusResponse | null>(null);
  const [statusError, setStatusError] = useState('');
  const [isDownloadingModel, setIsDownloadingModel] = useState(false);
  const [isInstallingRuntime, setIsInstallingRuntime] = useState(false);
  const [isStartingRuntime, setIsStartingRuntime] = useState(false);
  const [csvContext, setCsvContext] = useState<CsvAssistantContext | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content:
        'Upload a CSV, connect the local helper, and I can summarize the dataset or answer questions about the rows and columns.',
    },
  ]);
  const [draftPrompt, setDraftPrompt] = useState('');
  const [chatError, setChatError] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isLoadingCsv, setIsLoadingCsv] = useState(false);
  const [csvLoadingProgress, setCsvLoadingProgress] = useState(0);
  const [csvLoadingStatus, setCsvLoadingStatus] = useState('');

  const transportLabel = useMemo(() => {
    if (!health) {
      return 'Not connected';
    }

    return health.transportMode === 'llama.cpp' ? 'llama.cpp runtime' : 'Mock runtime';
  }, [health]);

  const checkHelper = async () => {
    setStatusError('');
    setConnectionState('checking');

    try {
      const [healthResponse, modelResponse] = await Promise.all([
        fetch(`${HELPER_URL}/health`),
        fetch(`${HELPER_URL}/models/status`),
      ]);

      if (!healthResponse.ok || !modelResponse.ok) {
        throw new Error('The local helper responded with an unexpected status.');
      }

      const nextHealth = (await healthResponse.json()) as HelperHealthResponse;
      const nextModelStatus = (await modelResponse.json()) as ModelStatusResponse;

      setHealth(nextHealth);
      setModelStatus(nextModelStatus);
      setConnectionState('online');
    } catch (error) {
      setConnectionState('offline');
      setHealth(null);
      setModelStatus(null);
      setStatusError(
        error instanceof Error
          ? error.message
          : 'Unable to connect to the local helper.'
      );
    }
  };

  useEffect(() => {
    void checkHelper();

    const interval = window.setInterval(() => {
      void checkHelper();
    }, 5000);

    return () => window.clearInterval(interval);
  }, []);

  const handleDownloadModel = async () => {
    setIsDownloadingModel(true);
    setStatusError('');

    try {
      const response = await fetch(`${HELPER_URL}/models/download`, {
        method: 'POST',
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(payload?.error || 'Unable to start the GGUF download.');
      }

      await checkHelper();
    } catch (error) {
      setStatusError(error instanceof Error ? error.message : 'Unable to start model download.');
    } finally {
      setIsDownloadingModel(false);
    }
  };

  const handleStartRuntime = async () => {
    setIsStartingRuntime(true);
    setStatusError('');

    try {
      const response = await fetch(`${HELPER_URL}/models/start`, {
        method: 'POST',
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(payload?.error || 'Unable to start the local llama.cpp runtime.');
      }

      await checkHelper();
    } catch (error) {
      setStatusError(error instanceof Error ? error.message : 'Unable to start the runtime.');
    } finally {
      setIsStartingRuntime(false);
    }
  };

  const handleInstallRuntime = async () => {
    setIsInstallingRuntime(true);
    setStatusError('');

    try {
      const response = await fetch(`${HELPER_URL}/runtime/install`, {
        method: 'POST',
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(payload?.error || 'Unable to start llama.cpp runtime installation.');
      }

      await checkHelper();
    } catch (error) {
      setStatusError(
        error instanceof Error ? error.message : 'Unable to start runtime installation.'
      );
    } finally {
      setIsInstallingRuntime(false);
    }
  };

  const handleFileSelect = async (file: File) => {
    setIsLoadingCsv(true);
    setCsvLoadingProgress(0);
    setCsvLoadingStatus('Preparing CSV...');
    setChatError('');

    try {
      const rows = await parseCsvForAssistant(file, (progress, status) => {
        setCsvLoadingProgress(progress);
        setCsvLoadingStatus(status);
      });

      const nextContext = buildCsvAssistantContext(file.name, rows as Record<string, unknown>[]);
      setCsvContext(nextContext);
      setMessages((currentMessages) => [
        ...currentMessages,
        {
          role: 'assistant',
          content: `Loaded ${nextContext.fileName} with ${nextContext.rowCount.toLocaleString()} rows and ${nextContext.columnCount} columns. Ask me about trends, missing fields, likely filters, or a summary of the dataset.`,
        },
      ]);
    } catch (error) {
      setChatError(
        error instanceof Error ? error.message : 'Unable to parse the selected CSV file.'
      );
    } finally {
      setIsLoadingCsv(false);
      window.setTimeout(() => {
        setCsvLoadingProgress(0);
        setCsvLoadingStatus('');
      }, 1200);
    }
  };

  const handleSend = async () => {
    const trimmedPrompt = draftPrompt.trim();
    if (!trimmedPrompt) {
      return;
    }

    if (!csvContext) {
      setChatError('Upload a CSV before starting the conversation.');
      return;
    }

    if (connectionState !== 'online') {
      setChatError('Connect the local helper before sending prompts.');
      return;
    }

    const nextUserMessage: ChatMessage = {
      role: 'user',
      content: trimmedPrompt,
    };

    setDraftPrompt('');
    setChatError('');
    setIsSending(true);
    setMessages((currentMessages) => [...currentMessages, nextUserMessage]);

    try {
      const response = await fetch(`${HELPER_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          csvContext,
          messages: [...messages, nextUserMessage],
        }),
      });

      const payload = (await response.json()) as { message?: string; error?: string };

      if (!response.ok || !payload.message) {
        throw new Error(payload.error || 'The helper did not return a reply.');
      }

      const assistantMessage = payload.message;

      setMessages((currentMessages) => [
        ...currentMessages,
        {
          role: 'assistant',
          content: assistantMessage,
        },
      ]);
    } catch (error) {
      setChatError(
        error instanceof Error ? error.message : 'Unable to reach the local chat runtime.'
      );
    } finally {
      setIsSending(false);
    }
  };

  const helperReadyForChat =
    connectionState === 'online' &&
    Boolean(csvContext) &&
    Boolean(modelStatus?.runtime.reachable || health?.transportMode === 'mock');

  return (
    <div className="space-y-8">
      <PageCard className="p-0 overflow-hidden">
        <div className="bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.18),_transparent_40%),linear-gradient(135deg,#0f172a,#1d4ed8)] px-8 py-10 text-white">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-sky-100">
                <Bot className="h-3.5 w-3.5" />
                Local AI Workflow
              </div>
              <h2 className="text-3xl font-semibold tracking-tight">
                Download a local GGUF model, keep CSV data private, and chat with your spreadsheet.
              </h2>
              <p className="max-w-2xl text-sm leading-6 text-sky-50/90 sm:text-base">
                This prototype expects a local helper on <code className="rounded bg-white/10 px-1.5 py-0.5">127.0.0.1:11435</code>.
                The helper manages the GGUF download, starts <code className="rounded bg-white/10 px-1.5 py-0.5">llama.cpp</code>,
                and forwards chat requests to the local model.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <StatPill
                label="Helper"
                value={connectionState === 'online' ? 'Connected' : connectionState === 'checking' ? 'Checking' : 'Offline'}
                tone={connectionState === 'online' ? 'success' : 'warning'}
              />
              <StatPill
                label="Runtime"
                value={transportLabel}
                tone={health?.transportMode === 'mock' ? 'warning' : 'success'}
              />
            </div>
          </div>
        </div>
      </PageCard>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_1.35fr]">
        <div className="space-y-6">
          <PageCard className="space-y-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-semibold text-slate-900">1. Connect the local helper</h3>
                <p className="mt-1 text-sm text-slate-600">
                  Run <code className="rounded bg-slate-100 px-1.5 py-0.5">npm run ai:helper</code> in this repo, then come back here.
                </p>
              </div>
              <Button variant="outline" onClick={() => void checkHelper()}>
                <RefreshCw className="h-4 w-4" />
                Refresh
              </Button>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center gap-3">
                {connectionState === 'online' ? (
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                ) : connectionState === 'checking' ? (
                  <Loader2 className="h-5 w-5 animate-spin text-slate-500" />
                ) : (
                  <ServerCrash className="h-5 w-5 text-amber-600" />
                )}
                <div>
                  <div className="font-medium text-slate-900">
                    {connectionState === 'online'
                      ? 'Helper connected'
                      : connectionState === 'checking'
                        ? 'Checking local helper'
                        : 'Helper not reachable'}
                  </div>
                  <div className="text-sm text-slate-600">
                    {health
                      ? `Version ${health.helperVersion} • ${health.llamaServerUrl}`
                      : 'The page will poll every five seconds once the helper is online.'}
                  </div>
                </div>
              </div>

              {statusError ? (
                <p className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {statusError}
                </p>
              ) : null}
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-xl border border-slate-200 p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                  <Download className="h-4 w-4 text-sky-600" />
                  Model download
                </div>
                <p className="mt-2 text-sm text-slate-600">
                  Pull a GGUF model once, then reuse it locally without sending CSV data to a remote API.
                </p>
                <Button
                  className="mt-4 w-full"
                  onClick={handleDownloadModel}
                  disabled={connectionState !== 'online' || isDownloadingModel || modelStatus?.download.state === 'downloading'}
                >
                  {isDownloadingModel || modelStatus?.download.state === 'downloading' ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Downloading model
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4" />
                      Download Qwen GGUF
                    </>
                  )}
                </Button>
                {modelStatus ? (
                  <p className="mt-2 text-xs text-slate-500">
                    {modelStatus.model.present
                      ? `Ready at ${modelStatus.model.filePath}`
                      : modelStatus.model.downloadConfigured
                        ? modelStatus.model.fileName
                        : 'Set LOCAL_LLM_MODEL_URL before downloading.'}
                  </p>
                ) : null}
              </div>

              <div className="rounded-xl border border-slate-200 p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                  <Cpu className="h-4 w-4 text-indigo-600" />
                  Runtime
                </div>
                <p className="mt-2 text-sm text-slate-600">
                  Install the local llama.cpp server once, then start it against the downloaded GGUF model.
                </p>
                <Button
                  variant="outline"
                  className="mt-4 w-full"
                  onClick={handleInstallRuntime}
                  disabled={
                    connectionState !== 'online' ||
                    isInstallingRuntime ||
                    !modelStatus?.runtimeInstall.supported ||
                    modelStatus.runtimeInstall.state === 'downloading' ||
                    modelStatus.runtimeInstall.state === 'extracting' ||
                    modelStatus.runtime.binaryConfigured
                  }
                >
                  {isInstallingRuntime ||
                  modelStatus?.runtimeInstall.state === 'downloading' ||
                  modelStatus?.runtimeInstall.state === 'extracting' ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Installing runtime
                    </>
                  ) : modelStatus?.runtime.binaryConfigured ? (
                    <>
                      <CheckCircle2 className="h-4 w-4" />
                      Runtime installed
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4" />
                      Install llama.cpp
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  className="mt-3 w-full"
                  onClick={handleStartRuntime}
                  disabled={
                    connectionState !== 'online' ||
                    isStartingRuntime ||
                    !modelStatus?.model.present ||
                    modelStatus.runtime.running
                  }
                >
                  {isStartingRuntime ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Starting runtime
                    </>
                  ) : modelStatus?.runtime.running ? (
                    <>
                      <CheckCircle2 className="h-4 w-4" />
                      Runtime running
                    </>
                  ) : (
                    <>
                      <Rocket className="h-4 w-4" />
                      Start llama.cpp
                    </>
                  )}
                </Button>
                {modelStatus ? (
                  <p className="mt-2 text-xs text-slate-500">
                    {modelStatus.runtime.binaryConfigured
                      ? `Binary: ${modelStatus.runtime.binaryPath ?? modelStatus.runtime.serverUrl}`
                      : modelStatus.runtimeInstall.supported
                        ? 'The helper can auto-install a Windows CPU runtime into .local-ai/runtime.'
                        : 'Auto-install is only wired for Windows right now.'}
                  </p>
                ) : null}
              </div>
            </div>

            {modelStatus ? (
              <div className="grid gap-4 xl:grid-cols-2">
                <div className="rounded-xl border border-slate-200 bg-white p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="text-sm font-semibold text-slate-900">Model download</div>
                      <div className="text-xs text-slate-500">
                        {modelStatus.download.state === 'completed'
                          ? `${modelStatus.model.repository} ${modelStatus.model.variant} is ready.`
                          : modelStatus.download.state === 'error'
                            ? modelStatus.download.error || 'The last download attempt failed.'
                            : modelStatus.download.state === 'downloading'
                              ? 'The helper is streaming the GGUF file locally.'
                              : `Default target: ${modelStatus.model.fileName}`}
                      </div>
                    </div>
                    <div className="text-sm font-medium text-slate-700">
                      {Math.round(modelStatus.download.progress)}%
                    </div>
                  </div>
                  <div className="mt-3 h-2 rounded-full bg-slate-100">
                    <div
                      className="h-2 rounded-full bg-sky-500 transition-all"
                      style={{ width: `${modelStatus.download.progress}%` }}
                    />
                  </div>
                  <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                    <span>{formatBytes(modelStatus.download.downloadedBytes)}</span>
                    <span>
                      {modelStatus.download.totalBytes
                        ? formatBytes(modelStatus.download.totalBytes)
                        : 'Unknown size'}
                    </span>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="text-sm font-semibold text-slate-900">Runtime install</div>
                      <div className="text-xs text-slate-500">
                        {modelStatus.runtimeInstall.state === 'completed'
                          ? `Installed ${modelStatus.runtimeInstall.assetName ?? 'llama.cpp runtime'}`
                          : modelStatus.runtimeInstall.state === 'error'
                            ? modelStatus.runtimeInstall.error || 'The runtime installation failed.'
                            : modelStatus.runtimeInstall.state === 'extracting'
                              ? 'Extracting the downloaded runtime archive.'
                              : modelStatus.runtimeInstall.state === 'downloading'
                                ? `Downloading ${modelStatus.runtimeInstall.assetName ?? 'llama.cpp'}`
                                : 'Waiting for runtime installation.'}
                      </div>
                    </div>
                    <div className="text-sm font-medium text-slate-700">
                      {Math.round(modelStatus.runtimeInstall.progress)}%
                    </div>
                  </div>
                  <div className="mt-3 h-2 rounded-full bg-slate-100">
                    <div
                      className="h-2 rounded-full bg-indigo-500 transition-all"
                      style={{ width: `${modelStatus.runtimeInstall.progress}%` }}
                    />
                  </div>
                  <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                    <span>{formatBytes(modelStatus.runtimeInstall.downloadedBytes)}</span>
                    <span>
                      {modelStatus.runtimeInstall.totalBytes
                        ? formatBytes(modelStatus.runtimeInstall.totalBytes)
                        : modelStatus.runtimeInstall.assetName ?? modelStatus.runtimeInstall.platform}
                    </span>
                  </div>
                </div>
              </div>
            ) : null}
          </PageCard>

          <PageCard className="space-y-5">
            <div>
              <h3 className="text-xl font-semibold text-slate-900">2. Upload a CSV</h3>
              <p className="mt-1 text-sm text-slate-600">
                The file is summarized locally in the browser, then only the compact schema and sample rows are sent to the helper.
              </p>
            </div>

            <FileUpload
              onFileSelect={(file) => {
                void handleFileSelect(file);
              }}
              isLoading={isLoadingCsv}
              loadingProgress={csvLoadingProgress}
              processingStatus={csvLoadingStatus}
            />

            {csvContext ? (
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <StatPill label="Rows" value={csvContext.rowCount.toLocaleString()} />
                  <StatPill label="Columns" value={csvContext.columnCount.toString()} />
                  <StatPill label="File" value={csvContext.fileName} />
                </div>
                <div className="mt-4 grid gap-3 lg:grid-cols-2">
                  {csvContext.columns.slice(0, 8).map((column) => (
                    <div key={column.name} className="rounded-lg border border-slate-200 bg-white p-3">
                      <div className="flex items-center justify-between gap-3">
                        <div className="font-medium text-slate-900">{column.name}</div>
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                          {column.type}
                        </span>
                      </div>
                      <div className="mt-2 text-xs text-slate-500">
                        Non-empty in sample: {column.nonEmptyValues}
                      </div>
                      {column.examples.length > 0 ? (
                        <div className="mt-2 text-sm text-slate-600">
                          Examples: {column.examples.join(', ')}
                        </div>
                      ) : null}
                      {column.stats ? (
                        <div className="mt-2 text-sm text-slate-600">
                          Range: {column.stats.min} to {column.stats.max} • Avg {column.stats.avg.toFixed(2)}
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </PageCard>
        </div>

        <PageCard className="flex min-h-[780px] flex-col">
          <div className="flex items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <h3 className="text-xl font-semibold text-slate-900">3. Chat with the CSV assistant</h3>
              <p className="mt-1 text-sm text-slate-600">
                Ask for summaries, suspicious columns, likely filters, or patterns worth checking first.
              </p>
            </div>
            <div className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700">
              <MessageSquare className="mr-1 inline h-3.5 w-3.5" />
              {helperReadyForChat ? 'Ready' : 'Waiting'}
            </div>
          </div>

          <div className="mt-6 flex-1 space-y-4 overflow-y-auto rounded-2xl bg-slate-50 p-4">
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-6 ${
                  message.role === 'assistant'
                    ? 'bg-white text-slate-700 shadow-sm'
                    : 'ml-auto bg-slate-900 text-white'
                }`}
              >
                <div className="mb-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                  {message.role === 'assistant' ? 'Assistant' : 'You'}
                </div>
                <div className="whitespace-pre-wrap">{message.content}</div>
              </div>
            ))}
          </div>

          <div className="mt-6 space-y-3">
            <div className="flex flex-wrap gap-2">
              {[
                'Summarize this CSV for a product manager.',
                'Which columns look most important for segmentation?',
                'What filters would you try first?',
                'Are there suspicious missing-value patterns?',
              ].map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => setDraftPrompt(prompt)}
                  className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-600 transition-colors hover:border-sky-300 hover:text-sky-700"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {chatError ? (
              <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {chatError}
              </div>
            ) : null}

            <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
              <textarea
                value={draftPrompt}
                onChange={(event) => setDraftPrompt(event.target.value)}
                rows={4}
                placeholder="Ask for a summary, segment idea, anomaly check, or a query plan for this CSV..."
                className="w-full resize-none border-0 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
              />
              <div className="mt-3 flex items-center justify-between gap-3 border-t border-slate-100 pt-3">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Upload className="h-3.5 w-3.5" />
                  {csvContext ? csvContext.fileName : 'Upload a CSV to enable chat'}
                </div>
                <Button onClick={() => void handleSend()} disabled={!helperReadyForChat || isSending || !draftPrompt.trim()}>
                  {isSending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Sending
                    </>
                  ) : (
                    <>
                      <MessageSquare className="h-4 w-4" />
                      Send
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </PageCard>
      </div>
    </div>
  );
}
