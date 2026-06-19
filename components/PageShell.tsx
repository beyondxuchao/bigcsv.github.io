import React from 'react';
import { cn } from '@/lib/utils';

interface PageShellProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  heroChildren?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
  contentClassName?: string;
  heroClassName?: string;
  contentWidthClassName?: string;
}

export function PageShell({
  title,
  description,
  children,
  heroChildren,
  actions,
  className,
  contentClassName,
  heroClassName,
  contentWidthClassName = 'max-w-[1600px]',
}: PageShellProps) {
  return (
    <div className={cn('min-h-screen bg-gray-50', className)}>
      <div className={cn('bg-gradient-to-br from-blue-50 to-indigo-100 py-12', heroClassName)}>
        <div className={cn(contentWidthClassName, 'mx-auto px-4')}>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{title}</h1>
          {description ? <p className="text-xl text-gray-600 max-w-4xl">{description}</p> : null}
          {actions ? <div className="mt-6">{actions}</div> : null}
          {heroChildren ? <div className="mt-6">{heroChildren}</div> : null}
        </div>
      </div>

      <div className={cn(contentWidthClassName, 'mx-auto px-4 py-8', contentClassName)}>{children}</div>
    </div>
  );
}

interface PageCardProps {
  children: React.ReactNode;
  className?: string;
}

export function PageCard({ children, className }: PageCardProps) {
  return (
    <div className={cn('bg-white rounded-xl shadow-sm border border-gray-200 p-8', className)}>
      {children}
    </div>
  );
}
