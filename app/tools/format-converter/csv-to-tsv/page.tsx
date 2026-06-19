import React from 'react';
import { FormatConverter } from '@/components/FormatConverter';
import Link from 'next/link';

export const metadata = {
  title: 'CSV to TSV Converter | Free Online CSV TSV Conversion Tool',
  description: 'Convert CSV (Comma-Separated Values) files to TSV format instantly with our free online converter. Handle complex data, preserve formatting, and ensure data integrity. Fast and secure.',
  keywords: 'csv to tsv converter, csv to tsv, convert csv to tsv, comma separated values, tab separated values, tsv converter, online csv converter',
};

export default function CsvToTsvConverterPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">CSV to TSV Converter</h1>
          <p className="mt-2 text-lg text-gray-600">
            Convert CSV (Comma-Separated Values) files to TSV format instantly
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-8">
        <FormatConverter defaultFromFormat="csv" defaultToFormat="tsv" />
      </div>

      {/* SEO Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">About CSV to TSV Conversion</h2>
          <div className="prose max-w-none">
            <p className="text-gray-600 mb-4">
              CSV (Comma-Separated Values) files use commas as delimiters, while TSV (Tab-Separated Values) uses tabs. 
              Converting CSV to TSV is useful when working with data that contains commas within the field values, 
              as tabs are less likely to appear in regular text data.
            </p>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Key Features</h3>
            <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1">
              <li>Automatic comma delimiter detection</li>
              <li>Proper handling of quoted fields and embedded commas</li>
              <li>Preserve data integrity during conversion</li>
              <li>Support for large CSV files</li>
              <li>Browser-based processing - your data stays private</li>
              <li>Instant download of converted TSV files</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">Advantages of TSV Format</h3>
            <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1">
              <li>Simpler parsing - no need to handle quoted fields</li>
              <li>Better for data containing commas in field values</li>
              <li>Widely supported by data processing tools</li>
              <li>Cleaner format for programmatic processing</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">Related Tools</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link href="/tools/format-converter/tsv-to-csv-" className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                <h4 className="font-semibold text-gray-900">TSV to CSV</h4>
                <p className="text-sm text-gray-600">Convert TSV files to CSV format</p>
              </Link>
              <Link href="/tools/format-" className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                <h4 className="font-semibold text-gray-900">Format Converter</h4>
                <p className="text-sm text-gray-600">Convert between multiple formats</p>
              </Link>
              <Link href="/tools/csv-merger" className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                <h4 className="font-semibold text-gray-900">CSV Merger</h4>
                <p className="text-sm text-gray-600">Merge multiple CSV files into one</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
