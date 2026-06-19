import React from 'react';
import { FormatConverter } from '@/components/FormatConverter';
import Link from 'next/link';

export const metadata = {
  title: 'CSV to JSON Converter | Free Online CSV JSON Conversion Tool',
  description: 'Convert CSV files to JSON format instantly with our free online CSV to JSON converter. Support for custom delimiters, headers, and data validation. Fast, secure, and browser-based processing.',
  keywords: 'csv to json converter, csv to json, convert csv to json, csv json conversion, csv parser, json generator, online csv converter',
};

// const structuredData = {
//   "@context": "https://schema.org",
//   "@type": "WebApplication",
//   "name": "CSV to JSON ",
//   "description": "Free online tool to convert CSV files to JSON format with support for custom delimiters and headers",
//   "url": "https://csvfilters.com/tools/format-converter/csv-to-json-",
//   "applicationCategory": "UtilitiesApplication",
//   "operatingSystem": "Any",
//   "offers": {
//     "@type": "Offer",
//     "price": "0",
//     "priceCurrency": "USD"
//   },
//   "featureList": [
//     "Convert CSV to JSON format",
//     "Support for custom delimiters",
//     "Handle CSV headers",
//     "Browser-based processing",
//     "No file upload required",
//     "Instant conversion"
//   ]
// };

export default function CsvToJsonConverterPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">CSV to JSON Converter</h1>
          <p className="mt-2 text-lg text-gray-600">
            Convert CSV files to JSON format instantly with our free online converter
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-8">
        <FormatConverter defaultFromFormat="csv" defaultToFormat="json" />
      </div>

      {/* SEO Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">About CSV to JSON Conversion</h2>
          <div className="prose max-w-none">
            <p className="text-gray-600 mb-4">
              CSV (Comma-Separated Values) is a widely used format for storing tabular data in plain text. 
              JSON (JavaScript Object Notation) is a lightweight data interchange format that&apos;s perfect for 
              web applications and APIs. Converting CSV to JSON allows you to use spreadsheet data in web applications.
            </p>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Key Features</h3>
            <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1">
              <li>Support for custom delimiters (comma, semicolon, tab)</li>
              <li>Automatic header detection and mapping</li>
              <li>Data type inference (numbers, booleans, dates)</li>
              <li>Browser-based processing - your data stays private</li>
              <li>Handle large CSV files efficiently</li>
              <li>Multiple JSON output formats (array of objects, nested structure)</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">Related Tools</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link href="/tools/format-converter/json-to-csv" className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                 <h4 className="font-semibold text-gray-900">JSON to CSV</h4>
                 <p className="text-sm text-gray-600">Convert JSON files to CSV format</p>
               </Link>
               <Link href="/tools/format-converter" className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                 <h4 className="font-semibold text-gray-900">Format Converter</h4>
                 <p className="text-sm text-gray-600">Convert between multiple formats</p>
               </Link>
               <Link href="/tools/format-converter/xlsx-to-csv" className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                 <h4 className="font-semibold text-gray-900">XLSX to CSV</h4>
                 <p className="text-sm text-gray-600">Convert Excel files to CSV format</p>
               </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
