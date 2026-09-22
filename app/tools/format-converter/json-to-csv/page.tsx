import React from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';

const FormatConverter = dynamic(
  () => import('@/components/FormatConverter').then((mod) => mod.FormatConverter),
  {
    loading: () => <div className="max-w-4xl mx-auto px-4 text-sm text-gray-500">Loading converter...</div>,
  }
);

export const metadata = {
  alternates: { canonical: '/tools/format-converter/json-to-csv/' },
  title: 'JSON to CSV Converter | Free Online JSON CSV Conversion Tool',
  description: 'Convert JSON files to CSV format instantly with our free online JSON to CSV converter. Support for nested JSON objects, arrays, and complex data structures. Fast, secure, and browser-based processing.',
  keywords: 'json to csv converter, json to csv, convert json to csv, json csv conversion, json parser, csv generator, online json converter',
};

// const structuredData = {
//   "@context": "https://schema.org",
//   "@type": "WebApplication",
//   "name": "JSON to CSV Converter",
//   "description": "Free online tool to convert JSON files to CSV format with support for nested objects and arrays",
//   "url": "https://csvfilters.com/tools/format-converter/json-to-csv",
//   "applicationCategory": "UtilitiesApplication",
//   "operatingSystem": "Any",
//   "offers": {
//     "@type": "Offer",
//     "price": "0",
//     "priceCurrency": "USD"
//   },
//   "featureList": [
//     "Convert JSON to CSV format",
//     "Support for nested JSON objects",
//     "Handle JSON arrays",
//     "Browser-based processing",
//     "No file upload required",
//     "Instant conversion"
//   ]
// };

export default function JsonToCsvConverterPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">JSON to CSV Converter</h1>
          <p className="mt-2 text-lg text-gray-600">
            Convert JSON files to CSV format instantly with our free online converter
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-8">
        <FormatConverter defaultFromFormat="json" defaultToFormat="csv" />
      </div>

      {/* SEO Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">About JSON to CSV Conversion</h2>
          <div className="prose max-w-none">
            <p className="text-gray-600 mb-4">
              JSON (JavaScript Object Notation) is a lightweight data interchange format that&apos;s easy for humans to read and write. 
              CSV (Comma-Separated Values) is a simple file format used to store tabular data. Converting JSON to CSV is useful 
              when you need to import JSON data into spreadsheet applications or databases.
            </p>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Key Features</h3>
            <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1">
              <li>Support for nested JSON objects and arrays</li>
              <li>Automatic flattening of complex data structures</li>
              <li>Customizable CSV output format</li>
              <li>Browser-based processing - your data never leaves your device</li>
              <li>No file size limits</li>
              <li>Instant conversion and download</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">Related Tools</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link href="/tools/format-converter/csv-to-json" className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                <h4 className="font-semibold text-gray-900">CSV to JSON</h4>
                <p className="text-sm text-gray-600">Convert CSV files to JSON format</p>
              </Link>
              <Link href="/tools/format-converter" className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                <h4 className="font-semibold text-gray-900">Format Converter</h4>
                <p className="text-sm text-gray-600">Convert between multiple formats</p>
              </Link>
              <Link href="/tools/format-converter/tsv-to-csv" className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                <h4 className="font-semibold text-gray-900">TSV to CSV</h4>
                <p className="text-sm text-gray-600">Convert TSV files to CSV format</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
