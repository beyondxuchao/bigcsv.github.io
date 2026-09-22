import React from 'react';
import Link from 'next/link';
import { Download, FileTextIcon } from 'lucide-react';
import { MenuDropdown } from './MenuDropdown';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  className?: string;
}

export function Header({ className = '' }: HeaderProps) {
  return (
    <header className={`bg-white shadow-sm border-b ${className}`}>
      <div className="max-w-[1600px] mx-auto px-4 py-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <FileTextIcon className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-primary">
              CSVFilters
            </h1>
          </Link>
          <div className="flex flex-wrap items-center gap-2">
            <Button asChild size="sm" className="bg-emerald-600 text-white hover:bg-emerald-700">
              <a
                href="https://github.com/beyondxuchao/csvfilters/releases/latest"
                target="_blank"
                rel="noreferrer"
              >
                <Download className="h-4 w-4" />
                <span>Download App</span>
              </a>
            </Button>
            <MenuDropdown />
          </div>
        </div>
      </div>
    </header>
  );
}
