export const metadata = { alternates: { canonical: '/tools/ai-csv-assistant/' } };
import React from 'react';
import { AiCsvAssistant } from '@/components/AiCsvAssistant';
import { ToolPageShell } from '@/components/ToolPageShell';

export default function AiCsvAssistantPage() {
  return (
    <ToolPageShell
      title="AI CSV Assistant"
      description="Prototype a local-first CSV copilot powered by a downloadable GGUF model and llama.cpp-compatible helper."
    >
      <AiCsvAssistant />
    </ToolPageShell>
  );
}
