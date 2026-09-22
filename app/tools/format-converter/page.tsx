import React from 'react';
import dynamic from 'next/dynamic';
import { ToolPageShell } from '@/components/ToolPageShell';

const FormatConverter = dynamic(
  () => import('@/components/FormatConverter').then((mod) => mod.FormatConverter),
  {
    loading: () => (
      <div className="max-w-4xl mx-auto px-4 text-sm text-gray-500">Loading converter...</div>
    ),
  }
);

export const metadata = {
  alternates: { canonical: '/tools/format-converter/' },
  title: 'Format Converter | JSON, CSV, TSV, XML, XLSX Converter Tool',
  description:
    'Convert between JSON, CSV, TSV, XML, and XLSX formats instantly with our free online converter. Support for nested data, arrays, and complex structures. Fast, secure, and browser-based processing.',
  keywords:
    'format converter, json to csv, csv to json, xml to csv, csv to xml, tsv converter, xlsx converter, data conversion tool, file format converter, online converter',
};

export default function FormatConverterPage() {
  return (
    <ToolPageShell
      title="Format Converter"
      description="Convert between JSON, CSV, TSV, XML, XLSX and other formats with automatic detection"
      quickLinks={
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          <a
            href="/tools/format-converter/json-to-csv"
            className="bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg p-3 text-center transition-colors"
          >
            <div className="font-medium text-blue-900 text-sm">JSON to CSV</div>
            <div className="text-xs text-blue-600 mt-1">Structured Data</div>
          </a>
          <a
            href="/tools/format-converter/csv-to-json"
            className="bg-green-50 hover:bg-green-100 border border-green-200 rounded-lg p-3 text-center transition-colors"
          >
            <div className="font-medium text-green-900 text-sm">CSV to JSON</div>
            <div className="text-xs text-green-600 mt-1">API Ready</div>
          </a>
          <a
            href="/tools/format-converter/tsv-to-csv"
            className="bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg p-3 text-center transition-colors"
          >
            <div className="font-medium text-purple-900 text-sm">TSV to CSV</div>
            <div className="text-xs text-purple-600 mt-1">Tab Delimited</div>
          </a>
          <a
            href="/tools/format-converter/csv-to-tsv"
            className="bg-orange-50 hover:bg-orange-100 border border-orange-200 rounded-lg p-3 text-center transition-colors"
          >
            <div className="font-medium text-orange-900 text-sm">CSV to TSV</div>
            <div className="text-xs text-orange-600 mt-1">Tab Format</div>
          </a>
          <a
            href="/tools/format-converter/xlsx-to-csv"
            className="bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-lg p-3 text-center transition-colors"
          >
            <div className="font-medium text-teal-900 text-sm">XLSX to CSV</div>
            <div className="text-xs text-teal-600 mt-1">Excel Export</div>
          </a>
          <a
            href="/tools/format-converter/csv-to-xlsx"
            className="bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg p-3 text-center transition-colors"
          >
            <div className="font-medium text-indigo-900 text-sm">CSV to XLSX</div>
            <div className="text-xs text-indigo-600 mt-1">Excel Import</div>
          </a>
          <a
            href="/tools/format-converter/csv-xml-converter"
            className="bg-cyan-50 hover:bg-cyan-100 border border-cyan-200 rounded-lg p-3 text-center transition-colors"
          >
            <div className="font-medium text-cyan-900 text-sm">CSV XML</div>
            <div className="text-xs text-cyan-600 mt-1">Two-Way Convert</div>
          </a>
        </div>
      }
    >
      <FormatConverter />
    </ToolPageShell>
  );
}
