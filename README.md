# CSV Query Playground

A static Next.js website for viewing, filtering, converting, and exporting CSV data directly in the browser.

## Features

- Upload and inspect CSV files
- Filter and explore parsed data
- Export filtered results
- Use standalone CSV utility tools
- Keep file processing in the browser for privacy

## Getting Started

Run the development server:

```bash
npm run dev
```

Then open `http://localhost:3000`.

### Local AI helper prototype

This repo now includes an `AI CSV Assistant` tool at `/tools/ai-csv-assistant/`.

To run the helper locally:

```bash
npm run ai:helper
```

The helper listens on `http://127.0.0.1:11435` and supports:

- `GET /health`
- `GET /models/status`
- `POST /models/download`
- `POST /runtime/install`
- `POST /models/start`
- `POST /chat`

Useful environment variables:

```bash
LOCAL_LLM_MODEL_REPO=Qwen/Qwen3-4B-GGUF
LOCAL_LLM_MODEL_VARIANT=Q4_K_M
LOCAL_LLM_MODEL_URL=https://huggingface.co/Qwen/Qwen3-4B-GGUF/resolve/main/Qwen3-4B-Q4_K_M.gguf?download=true
LOCAL_LLM_MODEL_FILENAME=Qwen3-4B-Q4_K_M.gguf
LLAMA_CPP_SERVER_PATH=/absolute/path/to/llama-server
LLAMA_CPP_SERVER_URL=http://127.0.0.1:8080
LOCAL_LLM_TRANSPORT=auto
```

Notes:

- The helper now defaults to the official `Qwen/Qwen3-4B-GGUF` `Q4_K_M` file and can auto-install a Windows CPU `llama.cpp` runtime into `.local-ai/runtime`.
- In `LOCAL_LLM_TRANSPORT=auto`, chat falls back to mock responses until the local runtime becomes reachable.
- To use a custom local model source, override `LOCAL_LLM_MODEL_URL` or `LOCAL_LLM_MODEL_FILENAME`.
- The browser sends only a compact CSV summary and sample rows to the helper in this prototype, not the full dataset.

## Tech Stack

- Next.js
- React
- TypeScript
- Tailwind CSS

## Notes

- This site is fully static in scope.
- CSV processing happens client-side in the browser.
