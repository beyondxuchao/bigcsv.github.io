import React from 'react';
import { FormatConverter } from '@/components/FormatConverter';
import Link from 'next/link';

export const metadata = {
  alternates: { canonical: '/tools/format-converter/tsv-to-csv/' },
  title: 'TSV to CSV Converter | Free Online TSV CSV Conversion Tool',
  description: 'Convert TSV (Tab-Separated Values) files to CSV format instantly with our free online TSV to CSV converter. Support for custom delimiters and data validation. Fast, secure, and browser-based processing.',
  keywords: 'tsv to csv converter, tsv to csv, convert tsv to csv, tab separated values, csv conversion, tsv parser, online tsv converter',
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "TSV to CSV ",
  "description": "Free online tool to convert TSV (Tab-Separated Values) files to CSV format",
  "url": "https://csvfilters.com/tools/format-converter/tsv-to-csv-",
  "applicationCategory": "UtilitiesApplication",
  "operatingSystem": "Any",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "featureList": [
    "Convert TSV to CSV format",
    "Support for tab-separated values",
    "Handle custom delimiters",
    "Browser-based processing",
    "No file upload required",
    "Instant conversion"
  ]
};

export default function TsvToCsvConverterPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">TSV to CSV Converter</h1>
          <p className="mt-2 text-lg text-gray-600">
            Convert TSV (Tab-Separated Values) files to CSV format instantly
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-8">
        <FormatConverter defaultFromFormat="tsv" defaultToFormat="csv" />
      </div>

      {/* SEO Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">About TSV to CSV Conversion</h2>
          <div className="prose max-w-none">
            <p className="text-gray-600 mb-4">
              TSV (Tab-Separated Values) files use tabs as delimiters to separate data fields, while CSV (Comma-Separated Values) 
              uses commas. Converting TSV to CSV is often needed for compatibility with spreadsheet applications, databases, 
              and data analysis tools that prefer the CSV format.
            </p>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Key Features</h3>
            <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1">
              <li>Automatic tab delimiter detection</li>
              <li>Proper handling of quoted fields and special characters</li>
              <li>Preserve data integrity during conversion</li>
              <li>Support for large TSV files</li>
              <li>Browser-based processing - no server upload required</li>
              <li>Instant download of converted CSV files</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">When to Use TSV to CSV Conversion</h3>
            <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1">
              <li>Importing TSV data into Excel or Google Sheets</li>
              <li>Preparing data for CSV-only applications</li>
              <li>Converting database exports from TSV to CSV format</li>
              <li>Standardizing data formats across different systems</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">Related Tools</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link href="/tools/format-converter/csv-to-tsv-" className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                <h4 className="font-semibold text-gray-900">CSV to TSV</h4>
                <p className="text-sm text-gray-600">Convert CSV files to TSV format</p>
              </Link>
              <Link href="/tools/format-" className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                <h4 className="font-semibold text-gray-900">Format Converter</h4>
                <p className="text-sm text-gray-600">Convert between multiple formats</p>
              </Link>
              <Link href="/tools/csv-splitter" className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                <h4 className="font-semibold text-gray-900">CSV Splitter</h4>
                <p className="text-sm text-gray-600">Split large CSV files into smaller ones</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
      </div>
    </>
  );
}
