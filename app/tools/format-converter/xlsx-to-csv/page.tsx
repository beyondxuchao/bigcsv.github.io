import React from 'react';
import { FormatConverter } from '@/components/FormatConverter';
import Link from 'next/link';

export const metadata = {
  alternates: { canonical: '/tools/format-converter/xlsx-to-csv/' },
  title: 'XLSX to CSV Converter | Free Online Excel CSV Conversion Tool',
  description: 'Convert XLSX (Excel) files to CSV format instantly with our free online converter. Support for multiple sheets, formulas, and data types. Fast, secure, and browser-based processing.',
  keywords: 'xlsx to csv converter, excel to csv, xlsx to csv, convert excel to csv, excel converter, xlsx parser, online excel converter',
};

// const jsonLd = {
//   "@context": "https://schema.org",
//   "@type": "WebApplication",
//   "name": "XLSX to CSV Converter",
//   "description": "Free online tool to convert Excel XLSX files to CSV format",
//   "url": "https://csvfilters.com/tools/format-converter/xlsx-to-csv",
//   "applicationCategory": "UtilityApplication",
//   "operatingSystem": "Any",
//   "permissions": "browser",
//   "offers": {
//     "@type": "Offer",
//     "price": "0",
//     "priceCurrency": "USD"
//   },
//   "featureList": [
//     "Convert XLSX to CSV format",
//     "Support for multiple Excel worksheets",
//     "Browser-based processing",
//     "No file upload required",
//     "Free to use"
//   ]
// };

export default function XlsxToCsvConverterPage() {
  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">XLSX to CSV Converter</h1>
          <p className="mt-2 text-lg text-gray-600">
            Convert Excel (XLSX) files to CSV format instantly with our free online converter
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-8">
        <FormatConverter defaultFromFormat="xls" defaultToFormat="csv" />
      </div>

      {/* SEO Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">About XLSX to CSV Conversion</h2>
          <div className="prose max-w-none">
            <p className="text-gray-600 mb-4">
              XLSX is Microsoft Excel&apos;s file format that supports multiple worksheets, formulas, formatting, and complex data structures. 
              CSV (Comma-Separated Values) is a simple, universal format that can be opened by virtually any spreadsheet application 
              or imported into databases and data analysis tools.
            </p>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Key Features</h3>
            <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1">
              <li>Support for multiple Excel worksheets</li>
              <li>Automatic formula calculation and value extraction</li>
              <li>Preserve data types (numbers, dates, text)</li>
              <li>Handle large Excel files efficiently</li>
              <li>Browser-based processing - no server upload required</li>
              <li>Choose specific sheets to convert</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">Why Convert XLSX to CSV?</h3>
            <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1">
              <li>Universal compatibility across platforms and applications</li>
              <li>Smaller file size for easier sharing and storage</li>
              <li>Import data into databases and data analysis tools</li>
              <li>Use with programming languages and scripts</li>
              <li>Create backups in a simple, readable format</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">Related Tools</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link href="/tools/format-converter/csv-to-xlsx" className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                 <h4 className="font-semibold text-gray-900">CSV to XLSX</h4>
                 <p className="text-sm text-gray-600">Convert CSV files to Excel format</p>
               </Link>
               <Link href="/tools/format-converter" className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                 <h4 className="font-semibold text-gray-900">Format Converter</h4>
                 <p className="text-sm text-gray-600">Convert between multiple formats</p>
               </Link>
               <Link href="/tools/format-converter/json-to-csv" className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                 <h4 className="font-semibold text-gray-900">JSON to CSV</h4>
                 <p className="text-sm text-gray-600">Convert JSON files to CSV format</p>
               </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
