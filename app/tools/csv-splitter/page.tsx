import React from 'react';
import { Metadata } from 'next';
import dynamic from 'next/dynamic';

const CsvSplitter = dynamic(() => import('@/components/CsvSplitter'), {
  loading: () => <div className="max-w-7xl mx-auto text-sm text-gray-500">Loading splitter...</div>,
});

export const metadata: Metadata = {
  title: 'CSV Splitter Tool | Split Large CSV Files by Column Values',
  description: 'Free online CSV splitter tool to divide large CSV files into multiple smaller files based on column values. Fast processing, secure browser-based splitting, and instant ZIP download.',
  keywords: 'csv splitter, split csv files, divide csv data, csv file splitter, large csv processing, data splitting tool, csv column split, file processing',
  openGraph: {
    title: 'CSV Splitter Tool - Split Large CSV Files',
    description: 'Free online tool to split large CSV files into multiple files based on column values',
    type: 'website',
  },
};

export default function CsvSplitterPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <CsvSplitter />
      </div>
    </div>
  );
}
