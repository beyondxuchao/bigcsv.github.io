import React from 'react';
import { Search, Filter, Download, Upload, Settings, HelpCircle, BookOpen, Lightbulb } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const metadata = {
  alternates: { canonical: '/help/' },
  title: 'CSV File Viewer & Editor Online - Help Guide | CSVFilters',
  description: 'Complete guide for using our online CSV file viewer and editor. Learn advanced CSV filtering, large file processing, data analysis, and export features.',
  keywords: 'csv file viewer, csv editor online, csv help guide, csv filtering tutorial, large csv files, csv data analysis, online csv tool help',
};

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
        <div className="max-w-[1600px] mx-auto px-4">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">CSV File Viewer & Online Editor Guide</h1>
          <p className="text-xl text-gray-600">
            Master our powerful CSV analysis tool and online CSV editor. Learn to process large CSV files, apply advanced filters, and export data efficiently.
          </p>
        </div>
      </div>
      
      <div className="max-w-[1600px] mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 min-w-0">
            <div className="w-full">
              <div className="space-y-8">

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <Upload className="h-5 w-5 text-green-600" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900">1. Upload Your CSV File</h3>
                    </div>
                    <div className="space-y-3 text-gray-600">
                      <p>Upload your CSV file using our advanced <strong>CSV file processor</strong> - supports drag & drop or click to browse.</p>
                      <ul className="space-y-1 text-sm ml-4">
                        <li>• <strong>Large CSV file support</strong> - handles files up to 10MB efficiently</li>
                        <li>• <strong>Big CSV file analysis</strong> - UTF-8 and GBK encoding supported</li>
                        <li>• Automatic delimiter detection</li>
                        <li>• Preview shows first few rows</li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Search className="h-5 w-5 text-blue-600" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900">2. Search and Query</h3>
                    </div>
                    <div className="space-y-3 text-gray-600">
                      <p>Use the search box to find specific data across all columns.</p>
                      <ul className="space-y-1 text-sm ml-4">
                        <li>• Case-insensitive search</li>
                        <li>• Searches all visible columns</li>
                        <li>• Real-time results</li>
                        <li>• Highlights matching text</li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Filter className="h-5 w-5 text-purple-600" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900">3. Filter Data</h3>
                    </div>
                    <div className="space-y-3 text-gray-600">
                      <p>Apply filters to narrow down your data view.</p>
                      <ul className="space-y-1 text-sm ml-4">
                        <li>• Column-specific filters</li>
                        <li>• Multiple filter conditions</li>
                        <li>• Date range filtering</li>
                        <li>• Numeric range filtering</li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex-shrink-0 w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                        <Download className="h-5 w-5 text-orange-600" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900">4. Export Results</h3>
                    </div>
                    <div className="space-y-3 text-gray-600">
                      <p>Download your filtered and processed data.</p>
                      <ul className="space-y-1 text-sm ml-4">
                        <li>• Export as CSV format</li>
                        <li>• Includes only filtered data</li>
                        <li>• Preserves original formatting</li>
                        <li>• Custom filename support</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Advanced Features</h2>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Settings className="h-5 w-5 text-gray-600" />
                        Data Processing
                      </h3>
                      <ul className="space-y-2 text-gray-600">
                        <li className="flex items-start gap-2">
                          <span className="text-blue-600 mt-1">•</span>
                          <span>Automatic data type detection</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-600 mt-1">•</span>
                          <span>Handle missing values gracefully</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-600 mt-1">•</span>
                          <span>Support for various date formats</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-600 mt-1">•</span>
                          <span>Numeric sorting and filtering</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Lightbulb className="h-5 w-5 text-gray-600" />
                        Performance Tips
                      </h3>
                      <ul className="space-y-2 text-gray-600">
                        <li className="flex items-start gap-2">
                          <span className="text-blue-600 mt-1">•</span>
                          <span>Use specific search terms for faster results</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-600 mt-1">•</span>
                          <span>Apply filters before searching large datasets</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-600 mt-1">•</span>
                          <span>Close unused browser tabs for better performance</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-600 mt-1">•</span>
                          <span>Use modern browsers for optimal experience</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
                  <div className="space-y-6">
                    <div className="border-b border-gray-200 pb-4">
                      <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                        <HelpCircle className="h-4 w-4 text-blue-600" />
                        What file formats are supported?
                      </h3>
                      <p className="text-gray-600 text-sm ml-6">
                        Currently, we support CSV (Comma-Separated Values) files with UTF-8 and GBK encoding. 
                        The tool automatically detects common delimiters like commas, semicolons, and tabs.
                      </p>
                    </div>
                    
                    <div className="border-b border-gray-200 pb-4">
                      <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                        <HelpCircle className="h-4 w-4 text-blue-600" />
                        Is there a file size limit?
                      </h3>
                      <p className="text-gray-600 text-sm ml-6">
                        Yes, the maximum file size is 10MB. This ensures optimal performance while handling most 
                        common CSV files. For larger files, consider splitting them into smaller chunks.
                      </p>
                    </div>
                    
                    <div className="border-b border-gray-200 pb-4">
                      <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                        <HelpCircle className="h-4 w-4 text-blue-600" />
                        Is my data secure?
                      </h3>
                      <p className="text-gray-600 text-sm ml-6">
                        Absolutely! All data processing happens entirely in your browser. Your files never leave 
                        your device, ensuring complete privacy and security. No data is uploaded to our servers.
                      </p>
                    </div>
                    
                    <div className="border-b border-gray-200 pb-4">
                      <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                        <HelpCircle className="h-4 w-4 text-blue-600" />
                        Can I use this tool offline?
                      </h3>
                      <p className="text-gray-600 text-sm ml-6">
                        Once loaded, the basic functionality works offline since all processing is client-side. 
                        However, you need an internet connection to initially load the application.
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                        <HelpCircle className="h-4 w-4 text-blue-600" />
                        How do I handle encoding issues?
                      </h3>
                      <p className="text-gray-600 text-sm ml-6">
                        If special characters are not displaying correctly, try saving your CSV file with UTF-8 
                        encoding before uploading. Most spreadsheet applications have this option in their save dialog.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-6">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Keep Exploring</h3>
                    <p className="text-gray-600 mb-4">
                      Browse more guides and background information to get the most out of these tools.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <Link href="/tutorials">
                        <Button variant="outline" className="flex items-center gap-2">
                          <HelpCircle className="h-4 w-4" />
                          View Tutorials
                        </Button>
                      </Link>
                      <Link href="/about">
                        <Button variant="outline" className="flex items-center gap-2">
                          <BookOpen className="h-4 w-4" />
                          About This Tool
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
