import React from 'react';
import { PageShell } from '@/components/PageShell';

interface ToolPageShellProps {
  title: string;
  description: string;
  children: React.ReactNode;
  quickLinks?: React.ReactNode;
}

export function ToolPageShell({
  title,
  description,
  children,
  quickLinks,
}: ToolPageShellProps) {
  return (
    <PageShell
      title={title}
      description={description}
      heroChildren={quickLinks}
      contentWidthClassName="max-w-[1280px]"
      contentClassName="space-y-8"
    >
      {children}
    </PageShell>
  );
}
