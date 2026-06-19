import React from 'react';
import { FormatConverter } from '@/components/FormatConverter';
import Link from 'next/link';

export const metadata = {
  title: 'CSV to XLSX Converter | Free Online CSV Excel Conversion Tool',
  description: 'Convert CSV files to XLSX (Excel) format instantly with our free online converter. Create formatted Excel files with proper data types, headers, and styling. Fast and secure.',
  keywords: 'csv to xlsx converter, csv to excel, csv to xlsx, convert csv to excel, excel converter, xlsx generator, online csv converter',
};

// const jsonLd = {
//   "@context": "https://schema.org",
//   "@type": "WebApplication",
//   "name": "CSV to XLSX Converter",
//   "description": "Free online tool to convert CSV files to Excel XLSX format",
//   "url": "https://csvfilters.com/tools/format-converter/csv-to-xlsx",
//   "applicationCategory": "UtilityApplication",
//   "operatingSystem": "Any",
//   "permissions": "browser",
//   "offers": {
//     "@type": "Offer",
//     "price": "0",
//     "priceCurrency": "USD"
//   }
// };

export default function CsvToXlsxConverterPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">CSV to XLSX Converter</h1>
          <p className="mt-2 text-lg text-gray-600">
            Convert CSV files to Excel (XLSX) format instantly with our free online converter
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-8">
        <FormatConverter defaultFromFormat="csv" defaultToFormat="xls" />
      </div>

      {/* SEO Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">About CSV to XLSX Conversion</h2>
          <div className="prose max-w-none">
            <p className="text-gray-600 mb-4">
              CSV (Comma-Separated Values) is a simple text format for storing tabular data, while XLSX is Microsoft Excel&apos;s 
              modern file format that supports advanced features like formatting, formulas, charts, and multiple worksheets. 
              Converting CSV to XLSX enhances your data with Excel&apos;s powerful features.
            </p>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Key Features</h3>
            <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1">
              <li>Automatic data type detection and formatting</li>
              <li>Proper header formatting and styling</li>
              <li>Support for large CSV files</li>
              <li>Preserve data integrity during conversion</li>
              <li>Browser-based processing - your data stays private</li>
              <li>Generate properly formatted Excel files</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">Benefits of XLSX Format</h3>
            <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1">
              <li>Rich formatting options (fonts, colors, borders)</li>
              <li>Support for formulas and calculations</li>
              <li>Multiple worksheets in a single file</li>
              <li>Charts and graphs for data visualization</li>
              <li>Data validation and conditional formatting</li>
              <li>Better compatibility with Microsoft Office suite</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">Use Cases</h3>
            <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1">
              <li>Creating professional reports and presentations</li>
              <li>Adding formulas and calculations to your data</li>
              <li>Sharing data with Excel users</li>
              <li>Creating formatted templates for data entry</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">Related Tools</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link href="/tools/format-converter/xlsx-to-csv" className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                <h4 className="font-semibold text-gray-900">XLSX to CSV</h4>
                <p className="text-sm text-gray-600">Convert Excel files to CSV format</p>
              </Link>
              <Link href="/tools/format-converter" className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
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
