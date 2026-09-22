import React from 'react';
import { Metadata } from 'next';
import dynamic from 'next/dynamic';

const CsvMerger = dynamic(() => import('@/components/CsvMerger').then((mod) => mod.CsvMerger), {
  loading: () => <div className="max-w-7xl mx-auto text-sm text-gray-500">Loading merger...</div>,
});

export const metadata: Metadata = {
  alternates: { canonical: '/tools/csv-merger/' },
  title: 'CSV Merger Tool | Combine Multiple CSV Files Online Free',
  description: 'Free online CSV merger tool to combine multiple CSV files with identical structure into one file. Maintain data integrity, preserve column headers, and process files securely in your browser.',
  keywords: 'csv merger, merge csv files, combine csv data, csv file merger, data consolidation tool, merge multiple files, csv combiner, file merger online',
  openGraph: {
    title: 'CSV Merger Tool - Combine Multiple CSV Files',
    description: 'Free online tool to merge multiple CSV files with identical structure into one consolidated file',
    type: 'website',
  },
};

export default function CsvMergerPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <CsvMerger />
      </div>
    </div>
  );
}
