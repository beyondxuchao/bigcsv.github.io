import { Metadata } from 'next'
import { Clock, User } from 'lucide-react'
import TutorialHeader from '@/components/TutorialHeader'

export const metadata: Metadata = {
  alternates: { canonical: '/tutorials/what-is-csv-format/' },
  title: 'What is CSV Format? Complete Guide to Comma-Separated Values Files - CSVFilters',
  description: 'Learn everything about CSV (Comma-Separated Values) format: definition, structure, features, use cases, and best practices for creating, editing, and using CSV files.',
  keywords: 'CSV format, comma-separated values, CSV file, data import, data export, spreadsheet, tabular data',
  openGraph: {
    title: 'What is CSV Format? Complete Guide to Comma-Separated Values Files',
    description: 'Complete guide to understanding and working with CSV files',
    type: 'article',
  },
}

export default function WhatIsCsvFormatPage() {
  const breadcrumbItems = [
    { label: 'Tutorials', href: '/tutorials' }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <TutorialHeader 
        title="What is CSV Format? Complete Guide to Comma-Separated Values Files"
        showBackButton={true}
        showBreadcrumb={true}
        breadcrumbItems={breadcrumbItems}
      />
      
      <div className="container mx-auto px-4 py-8">
         {/* Article Header */}
         <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
           <div className="flex items-center gap-2 mb-4">
             <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
               File Format Guide
             </span>
           </div>
           
           <div className="flex items-center gap-6 text-sm text-gray-600 mb-6">
             <div className="flex items-center gap-1">
               <Clock className="w-4 h-4" />
               <span>Reading time: 10 minutes</span>
             </div>
             <div className="flex items-center gap-1">
               <User className="w-4 h-4" />
               <span>Author: CSVFilters Team</span>
             </div>
             <span>Published: 2025-01-20</span>
           </div>
         </div>

         {/* Article Content */}
         <div className="bg-white rounded-xl shadow-lg p-8">
               <h2 className="text-2xl font-bold text-gray-800 mb-4">Introduction to CSV</h2>
               <p className="text-gray-600 mb-6">
                 CSV (Comma-Separated Values) is a simple file format used to store tabular data.
                 Each line represents a record, with fields separated by commas. CSV format is widely used due to its simplicity and broad compatibility.
               </p>

              <h2 className="text-2xl font-bold text-gray-800 mb-4">Key Features of CSV</h2>
              <ul className="list-disc pl-6 mb-6 text-gray-600">
                <li><strong>Human-readable:</strong> CSV files can be opened and read in any text editor</li>
                <li><strong>Lightweight</strong>: Small file size, fast transmission</li>
                <li><strong>Wide compatibility:</strong> Supported by virtually all spreadsheet applications and databases</li>
                <li><strong>Cross-platform</strong>: Seamless use across different operating systems</li>
                <li><strong>Easy to Process</strong>: All programming languages have corresponding parsing libraries</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-800 mb-4">CSV File Structure</h2>
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h3 className="text-lg font-semibold mb-3">Basic Structure:</h3>
                <ul className="list-disc pl-6 text-gray-600">
                  <li>First row is usually the header row (column names)</li>
                  <li>Each line represents a data record</li>
                  <li>Fields are separated by commas</li>
                  <li>Fields containing commas must be enclosed in double quotes</li>
                  <li>Double quotes within double quotes need to be escaped (represented by two double quotes)</li>
                </ul>
              </div>

              <h2 className="text-2xl font-bold text-gray-800 mb-4">CSV Example</h2>
              <div className="bg-gray-900 text-green-400 p-4 rounded-lg mb-6 overflow-x-auto">
                <pre className="text-sm">
{`Name,Age,City,Salary
John Doe,28,New York,8000
Jane Smith,32,Los Angeles,12000
Mike Johnson,25,"San Francisco, CA",9500
Sarah Wilson,30,Chicago,11000`}
                </pre>
              </div>
              <p className="text-sm text-gray-500 mb-6">
                Note: &quot;San Francisco, CA&quot; is enclosed in double quotes because it contains a comma
              </p>

              <h2 className="text-2xl font-bold text-gray-800 mb-4">CSV Use Cases</h2>
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-800 mb-2">Data Exchange:</h3>
                  <ul className="text-sm text-blue-700">
                    <li>• Data import/export between systems</li>
                    <li>• Database data backup</li>
                    <li>• Spreadsheet data exchange</li>
                    <li>• Batch data processing</li>
                  </ul>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-purple-800 mb-2">Business Applications:</h3>
                  <ul className="text-sm text-purple-700">
                    <li>• Financial reports</li>
                    <li>• Customer information management</li>
                    <li>• Product catalogs</li>
                    <li>• Log files</li>
                  </ul>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-gray-800 mb-4">CSV Format Specification</h2>
              <div className="bg-yellow-50 p-6 rounded-lg mb-6">
                <h3 className="font-semibold text-yellow-800 mb-3">RFC 4180 Standard:</h3>
                <ul className="list-disc pl-6 text-yellow-700">
                  <li>Fields may or may not be enclosed in double quotes</li>
                  <li>Fields containing line breaks, double quotes, or commas must be enclosed in double quotes</li>
                  <li>Double quotes within fields must be escaped with two double quotes</li>
                  <li>Records are separated by CRLF (\r\n)</li>
                  <li>The last record may or may not have an ending CRLF</li>
                </ul>
              </div>

              <h2 className="text-2xl font-bold text-gray-800 mb-4">Common Variants</h2>
              <div className="overflow-x-auto mb-6">
                <table className="min-w-full bg-white border border-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 border-b text-left">Format</th>
                      <th className="px-4 py-2 border-b text-left">Delimiter</th>
                      <th className="px-4 py-2 border-b text-left">Extension</th>
                      <th className="px-4 py-2 border-b text-left">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="px-4 py-2 border-b font-medium">CSV</td>
                      <td className="px-4 py-2 border-b">Comma (,)</td>
                      <td className="px-4 py-2 border-b">.csv</td>
                      <td className="px-4 py-2 border-b">Standard format</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 border-b font-medium">TSV</td>
                      <td className="px-4 py-2 border-b">Tab (\t)</td>
                      <td className="px-4 py-2 border-b">.tsv</td>
                      <td className="px-4 py-2 border-b">Tab-separated</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 border-b font-medium">PSV</td>
                      <td className="px-4 py-2 border-b">Pipe (|)</td>
                      <td className="px-4 py-2 border-b">.psv</td>
                      <td className="px-4 py-2 border-b">Pipe-separated</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 border-b font-medium">SSV</td>
                      <td className="px-4 py-2 border-b">Semicolon (;)</td>
                      <td className="px-4 py-2 border-b">.ssv</td>
                      <td className="px-4 py-2 border-b">Semicolon-separated</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h2 className="text-2xl font-bold text-gray-800 mb-4">CSV vs Other Formats</h2>
              <div className="overflow-x-auto mb-6">
                <table className="min-w-full bg-white border border-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 border-b text-left">Feature</th>
                      <th className="px-4 py-2 border-b text-left">CSV</th>
                      <th className="px-4 py-2 border-b text-left">Excel</th>
                      <th className="px-4 py-2 border-b text-left">JSON</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="px-4 py-2 border-b font-medium">File Size</td>
                      <td className="px-4 py-2 border-b text-green-600">Small</td>
                      <td className="px-4 py-2 border-b text-yellow-600">Medium</td>
                      <td className="px-4 py-2 border-b text-green-600">Small</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 border-b font-medium">Compatibility</td>
                      <td className="px-4 py-2 border-b text-green-600">Very High</td>
                      <td className="px-4 py-2 border-b text-yellow-600">Medium</td>
                      <td className="px-4 py-2 border-b text-green-600">High</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 border-b font-medium">Formatting</td>
                      <td className="px-4 py-2 border-b text-red-600">None</td>
                      <td className="px-4 py-2 border-b text-green-600">Rich</td>
                      <td className="px-4 py-2 border-b text-red-600">None</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 border-b font-medium">Data Types</td>
                      <td className="px-4 py-2 border-b text-red-600">Text</td>
                      <td className="px-4 py-2 border-b text-green-600">Multiple</td>
                      <td className="px-4 py-2 border-b text-green-600">Multiple</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h2 className="text-2xl font-bold text-gray-800 mb-4">CSV Best Practices</h2>
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-green-800 mb-2">Creation Tips:</h3>
                  <ul className="text-sm text-green-700">
                    <li>• Use meaningful column headers</li>
                    <li>• Keep data format consistent</li>
                    <li>• Avoid using delimiters in data</li>
                    <li>• Use UTF-8 encoding</li>
                    <li>• Validate data integrity</li>
                  </ul>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-orange-800 mb-2">Processing Tips:</h3>
                  <ul className="text-sm text-orange-700">
                    <li>• Handle special character escaping</li>
                    <li>• Pay attention to encoding issues</li>
                    <li>• Validate field count</li>
                    <li>• Handle null values</li>
                    <li>• Consider chunked processing for large files</li>
                  </ul>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-gray-800 mb-4">Common Issues</h2>
              <div className="space-y-4 mb-6">
                <div className="bg-red-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-red-800 mb-2">Encoding Issues:</h3>
                  <p className="text-sm text-red-700">
                    Character display issues are usually encoding problems. It&apos;s recommended to use UTF-8 encoding, or choose appropriate encodings like GBK or GB2312 as needed.
                  </p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-yellow-800 mb-2">Delimiter Conflicts:</h3>
                  <p className="text-sm text-yellow-700">
                    When data contains commas, the entire field must be enclosed in double quotes, or consider using other delimiters like tabs.
                  </p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-800 mb-2">Large File Processing:</h3>
                  <p className="text-sm text-blue-700">
                    For large CSV files, it&apos;s recommended to use streaming processing or chunked reading to avoid memory overflow.
                  </p>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-gray-800 mb-4">Recommended CSV Tools</h2>
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="bg-indigo-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-indigo-800 mb-2">Editing Tools:</h3>
                  <ul className="text-sm text-indigo-700">
                    <li>• Microsoft Excel</li>
                    <li>• Google Sheets</li>
                    <li>• LibreOffice Calc</li>
                    <li>• Text editors</li>
                  </ul>
                </div>
                <div className="bg-pink-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-pink-800 mb-2">Online Tools:</h3>
                  <ul className="text-sm text-pink-700">
                    <li>• CSV validators</li>
                    <li>• Format converters</li>
                    <li>• Data cleaning tools</li>
                    <li>• Encoding converters</li>
                  </ul>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-gray-800 mb-4">Conclusion</h2>
              <p className="text-gray-600 mb-4">
                CSV is a simple yet powerful data format that plays an important role in data exchange and storage.
                Although it has some limitations, its simplicity and wide compatibility make it one of the preferred formats for data processing.
                Mastering the correct usage of CSV is crucial for data analysis and processing work.
              </p>
              
              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="font-semibold text-green-800 mb-2">Related Tools:</h3>
                <p className="text-green-700 text-sm mb-2">
                  Our website provides various CSV-related tools to help you better handle CSV files:
                </p>
                <div className="flex flex-wrap gap-2">
                  <a href="/tools/format-converter" className="text-green-600 hover:underline text-sm">
                    Format Converter
                  </a>
                  <span className="text-green-500">•</span>
                  <a href="/tools/csv-merger" className="text-green-600 hover:underline text-sm">
                    CSV Merger
                  </a>
                  <span className="text-green-500">•</span>
                  <a href="/tools/csv-splitter" className="text-green-600 hover:underline text-sm">
                    CSV Splitter
                  </a>
                  <span className="text-green-500">•</span>
                  <a href="/tools/encoding-converter" className="text-green-600 hover:underline text-sm">
                    Encoding Converter
                  </a>
                </div>
          </div>
        </div>
      </div>
    </div>
  )
}