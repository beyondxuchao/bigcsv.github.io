import { Metadata } from 'next'
import Link from 'next/link'
import { Clock, User, FileText, Download, Eye, Settings } from 'lucide-react'
import TutorialHeader from '@/components/TutorialHeader'

export const metadata: Metadata = {
  title: 'What is TSV Format? Complete Guide to Tab-Separated Values Files - CSVFilters',
  description: 'Learn everything about TSV (Tab-Separated Values) format: what it is, how it differs from CSV, how to open TSV files, and best practices for working with tab-delimited data.',
  keywords: 'TSV format, tab-separated values, TSV file, open TSV, tab-delimited, data format, file format guide',
  openGraph: {
    title: 'What is TSV Format? Complete Guide to Tab-Separated Values Files',
    description: 'Complete guide to understanding and working with TSV files',
    type: 'article',
  },
}

export default function WhatIsTSVFormatPage() {
  const breadcrumbItems = [
    { label: 'Tutorials', href: '/tutorials' }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <TutorialHeader 
        title="What is TSV Format? Complete Guide to Tab-Separated Values Files"
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
              <span>Reading time: 6 minutes</span>
            </div>
            <div className="flex items-center gap-1">
              <User className="w-4 h-4" />
              <span>Author: CSVFilters Team</span>
            </div>
            <span>Published: 2025-01-20</span>
          </div>
          
          <p className="text-xl text-gray-700 leading-relaxed">
            TSV (Tab-Separated Values) is a simple file format used to store tabular data. This comprehensive guide will help you understand what TSV files are, how they work, and the best ways to open and work with them.
          </p>
        </div>

        {/* Article Content */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="prose prose-lg max-w-none">
            {/* What is TSV Format */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="w-6 h-6 text-blue-600" />
                What is TSV Format?
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                TSV stands for <strong>Tab-Separated Values</strong>. It&apos;s a plain text file format that stores tabular data by separating each field (column) with a tab character (\t) and each record (row) with a line break.
              </p>
              
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Example TSV Structure:</h3>
                <pre className="text-sm text-gray-800 bg-white p-4 rounded border overflow-x-auto">
{`Name\tAge\tCity\tCountry
John Smith\t28\tNew York\tUSA
Maria Garcia\t34\tMadrid\tSpain
Takeshi Yamamoto\t42\tTokyo\tJapan`}
                </pre>
                <p className="text-sm text-gray-600 mt-2">
                  Note: \t represents the tab character that separates each column
                </p>
              </div>
            </section>

            {/* TSV vs CSV */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">TSV vs CSV: Key Differences</h2>
              
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-blue-900 mb-3">TSV (Tab-Separated)</h3>
                  <ul className="text-blue-800 space-y-2 text-sm">
                    <li>• Uses tab characters (\t) as separators</li>
                    <li>• Less common than CSV format</li>
                    <li>• Better for data containing commas</li>
                    <li>• Simpler structure, fewer escaping issues</li>
                    <li>• File extension: .tsv or .tab</li>
                  </ul>
                </div>
                
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-green-900 mb-3">CSV (Comma-Separated)</h3>
                  <ul className="text-green-800 space-y-2 text-sm">
                    <li>• Uses commas (,) as separators</li>
                    <li>• More widely supported format</li>
                    <li>• Requires quotes for fields with commas</li>
                    <li>• More complex escaping rules</li>
                    <li>• File extension: .csv</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* How to Open TSV Files */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Eye className="w-6 h-6 text-green-600" />
                How to Open TSV Files
              </h2>
              
              <div className="space-y-6">
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">1. Microsoft Excel</h3>
                  <p className="text-gray-700 mb-3">
                    Excel can open TSV files directly. Simply double-click the file or use File → Open.
                  </p>
                  <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
                    <p className="text-yellow-800 text-sm">
                      <strong>Tip:</strong> If Excel doesn&apos;t recognize the format automatically, use the &quot;Text Import Wizard&quot; and select &quot;Tab&quot; as the delimiter.
                    </p>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">2. Google Sheets</h3>
                  <p className="text-gray-700 mb-3">
                    Upload your TSV file to Google Drive and open it with Google Sheets. It will automatically detect the tab separators.
                  </p>
                </div>

                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">3. Text Editors</h3>
                  <p className="text-gray-700 mb-3">
                  Any text editor can open TSV files since they&apos;re plain text:
                </p>
                  <ul className="text-gray-700 space-y-1 ml-4">
                    <li>• Notepad (Windows)</li>
                    <li>• TextEdit (Mac)</li>
                    <li>• VS Code, Sublime Text, Atom</li>
                    <li>• Vim, Emacs (Linux)</li>
                  </ul>
                </div>

                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">4. Programming Languages</h3>
                  <p className="text-gray-700 mb-3">
                    Most programming languages can easily read TSV files:
                  </p>
                  
                  <div className="bg-gray-50 rounded p-4 mb-3">
                    <h4 className="font-medium text-gray-900 mb-2">Python Example:</h4>
                    <pre className="text-sm text-gray-800 overflow-x-auto">
{`import pandas as pd

# Read TSV file
df = pd.read_csv('data.tsv', sep='\t')
print(df.head())`}
                    </pre>
                  </div>

                  <div className="bg-gray-50 rounded p-4">
                    <h4 className="font-medium text-gray-900 mb-2">JavaScript Example:</h4>
                    <pre className="text-sm text-gray-800 overflow-x-auto">
{`// Read TSV file content
const tsvData = await fetch('data.tsv').then(r => r.text());
const rows = tsvData.split('\n').map(row => row.split('\t'));`}
                    </pre>
                  </div>
                </div>
              </div>
            </section>

            {/* Advantages and Disadvantages */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Advantages and Disadvantages of TSV</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-green-900 mb-3">✅ Advantages</h3>
                  <ul className="text-green-800 space-y-2 text-sm">
                    <li>• Simple and human-readable format</li>
                    <li>• No issues with commas in data</li>
                    <li>• Smaller file size than XML/JSON</li>
                    <li>• Easy to parse programmatically</li>
                    <li>• Cross-platform compatibility</li>
                    <li>• No special characters need escaping</li>
                  </ul>
                </div>
                
                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-red-900 mb-3">❌ Disadvantages</h3>
                  <ul className="text-red-800 space-y-2 text-sm">
                    <li>• Problems if data contains tab characters</li>
                    <li>• Less widely supported than CSV</li>
                    <li>• No standard for handling special characters</li>
                    <li>• Limited metadata support</li>
                    <li>• Not suitable for hierarchical data</li>
                    <li>• Potential issues with different tab interpretations</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Best Practices */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Settings className="w-6 h-6 text-purple-600" />
                Best Practices for Working with TSV Files
              </h2>
              
              <div className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-6 py-2">
                  <h3 className="font-semibold text-gray-900 mb-2">1. Data Validation</h3>
                  <p className="text-gray-700 text-sm">
                    Always validate that your data doesn&apos;t contain tab characters that could break the format structure.
                  </p>
                </div>

                <div className="border-l-4 border-green-500 pl-6 py-2">
                  <h3 className="font-semibold text-gray-900 mb-2">2. Encoding Consistency</h3>
                  <p className="text-gray-700 text-sm">
                    Use UTF-8 encoding to ensure proper handling of international characters and special symbols.
                  </p>
                </div>

                <div className="border-l-4 border-yellow-500 pl-6 py-2">
                  <h3 className="font-semibold text-gray-900 mb-2">3. Header Row</h3>
                  <p className="text-gray-700 text-sm">
                    Always include a header row with column names to make the data self-documenting and easier to work with.
                  </p>
                </div>

                <div className="border-l-4 border-purple-500 pl-6 py-2">
                  <h3 className="font-semibold text-gray-900 mb-2">4. File Extension</h3>
                  <p className="text-gray-700 text-sm">
                    Use .tsv or .tab extensions to clearly indicate the file format to other users and applications.
                  </p>
                </div>
              </div>
            </section>

            {/* Common Use Cases */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Common Use Cases for TSV Files</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-blue-900 mb-3">Data Exchange</h3>
                  <p className="text-blue-800 text-sm mb-3">
                    TSV is commonly used for exchanging data between different systems, especially when the data contains commas that would complicate CSV parsing.
                  </p>
                </div>
                
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-green-900 mb-3">Database Exports</h3>
                  <p className="text-green-800 text-sm mb-3">
                    Many database systems can export data in TSV format, making it easy to transfer large datasets between different database platforms.
                  </p>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-yellow-900 mb-3">Scientific Data</h3>
                  <p className="text-yellow-800 text-sm mb-3">
                    Research and scientific applications often use TSV for storing experimental data and measurement results.
                  </p>
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-purple-900 mb-3">Log Files</h3>
                  <p className="text-purple-800 text-sm mb-3">
                    System logs and application logs are often stored in TSV format for easy parsing and analysis.
                  </p>
                </div>
              </div>
            </section>

            {/* Conclusion */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Conclusion</h2>
              <p className="text-gray-700 mb-4">
                TSV files are a simple yet powerful way to store and exchange tabular data. While they may not be as universally supported as CSV files, they offer distinct advantages when working with data that contains commas or when you need a straightforward, human-readable format.
              </p>
              <p className="text-gray-700 mb-6">
                Understanding how to work with TSV files will expand your data processing capabilities and give you more flexibility when choosing the right format for your specific use case.
              </p>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-3">Need to Convert TSV Files?</h3>
                <p className="text-blue-800 text-sm mb-4">
                  If you need to convert TSV files to other formats like CSV, try our free online converter tools.
                </p>
                <Link href="/tools/format-converter" className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  <Download className="w-4 h-4" />
                  Try Format Converter
                </Link>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}