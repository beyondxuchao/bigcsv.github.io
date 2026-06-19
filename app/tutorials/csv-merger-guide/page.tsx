import { Metadata } from 'next'
import Link from 'next/link'
import { Clock, User, Merge, FileText, AlertTriangle, CheckCircle } from 'lucide-react'
import TutorialHeader from '@/components/TutorialHeader'

export const metadata: Metadata = {
  title: 'CSV Merger Complete Guide - Combine Multiple CSV Files Efficiently',
  description: 'Learn how to merge multiple CSV files with identical structures. Master template validation, header preservation, and efficient data combination techniques.',
  keywords: 'CSV merger, merge CSV files, combine CSV data, data consolidation, file merging, CSV tools',
  openGraph: {
    title: 'CSV Merger Complete Guide - CSVFilters',
    description: 'Complete guide to merging multiple CSV files efficiently',
    type: 'article',
  },
}

export default function CSVMergerGuidePage() {
  const breadcrumbItems = [
    { label: 'Tutorials', href: '/tutorials' }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <TutorialHeader 
        title="CSV Merger Complete Guide"
        showBackButton={true}
        showBreadcrumb={true}
        breadcrumbItems={breadcrumbItems}
      />
      
      <div className="container mx-auto px-4 py-8">
        {/* Article Header */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
              Tool Tutorial
            </span>
          </div>
          
          <div className="flex items-center gap-6 text-sm text-gray-600 mb-6">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>Reading time: 5 minutes</span>
            </div>
            <div className="flex items-center gap-1">
              <User className="w-4 h-4" />
              <span>Author: CSVFilters Team</span>
            </div>
            <span>Published: 2025-08-27</span>
          </div>
          
          <p className="text-xl text-gray-700 leading-relaxed">
            Learn how to efficiently merge multiple CSV files with identical structures using our CSV Merger tool. 
            Combine data from multiple sources while maintaining data integrity and proper formatting.
          </p>
        </div>

        {/* Article Content */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="prose prose-lg max-w-none">
            {/* Introduction */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Why Merge CSV Files?</h2>
              <p className="text-gray-700 mb-4">
                CSV file merging is essential when you have data distributed across multiple files with the same structure. 
                Common scenarios include combining monthly reports, consolidating data from different sources, or merging 
                exported data from multiple systems.
              </p>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center gap-2">
                  <Merge className="w-5 h-5" />
                  Key Features of CSV Merger
                </h3>
                <ul className="text-blue-800 space-y-2 text-sm">
                  <li>• <strong>Template Validation</strong>: Ensures all files have identical column structures</li>
                  <li>• <strong>Header Preservation</strong>: Maintains single header row in the merged file</li>
                  <li>• <strong>Data Integrity</strong>: Preserves original data without modification</li>
                  <li>• <strong>Multiple File Support</strong>: Upload and merge multiple files simultaneously</li>
                  <li>• <strong>Error Detection</strong>: Identifies and reports structure mismatches</li>
                </ul>
              </div>
            </section>

            {/* Requirements */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <AlertTriangle className="w-6 h-6 text-orange-600" />
                Important Requirements
              </h2>
              
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-orange-900 mb-3">File Structure Requirements</h3>
                <p className="text-orange-800 mb-3">
                  For successful merging, all CSV files must have identical structures:
                </p>
                <ul className="text-orange-800 space-y-2 text-sm">
                  <li>• <strong>Same Column Headers</strong>: Identical column names in the same order</li>
                  <li>• <strong>Same Number of Columns</strong>: All files must have the same column count</li>
                  <li>• <strong>Consistent Data Types</strong>: Similar data formats in corresponding columns</li>
                  <li>• <strong>UTF-8 Encoding</strong>: Recommended for proper character handling</li>
                </ul>
              </div>
              
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-red-900 mb-3">What Happens with Mismatched Files?</h3>
                <p className="text-red-800 mb-3">
                  If files don&apos;t have identical structures, the merger will:
                </p>
                <ul className="text-red-800 space-y-2 text-sm">
                  <li>• Display detailed error messages</li>
                  <li>• Identify which files have mismatched structures</li>
                  <li>• Prevent merging to avoid data corruption</li>
                  <li>• Provide guidance on fixing structure issues</li>
                </ul>
              </div>
            </section>

            {/* Step by Step Guide */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <CheckCircle className="w-6 h-6 text-green-600" />
                Step-by-Step Merging Process
              </h2>
              
              <div className="space-y-6">
                <div className="border-l-4 border-green-400 pl-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Step 1: Prepare Your Files</h3>
                  <p className="text-gray-700 mb-3">Before uploading, ensure your CSV files are properly formatted:</p>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <ul className="text-sm space-y-1">
                      <li>• Verify all files have the same column headers</li>
                      <li>• Check that column order is consistent across files</li>
                      <li>• Ensure files are saved in CSV format with proper encoding</li>
                      <li>• Remove any extra formatting or merged cells</li>
                    </ul>
                  </div>
                </div>
                
                <div className="border-l-4 border-green-400 pl-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Step 2: Upload Multiple Files</h3>
                  <p className="text-gray-700 mb-3">Upload all the CSV files you want to merge:</p>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <ul className="text-sm space-y-1">
                      <li>• Click the upload area or drag and drop multiple CSV files</li>
                      <li>• You can select multiple files at once using Ctrl+Click (Windows) or Cmd+Click (Mac)</li>
                      <li>• The tool will display all uploaded files with their details</li>
                      <li>• Each file&apos;s structure will be automatically analyzed</li>
                    </ul>
                  </div>
                </div>
                
                <div className="border-l-4 border-green-400 pl-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Step 3: Structure Validation</h3>
                  <p className="text-gray-700 mb-3">The tool automatically validates file structures:</p>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <ul className="text-sm space-y-1">
                      <li>• Column headers are compared across all files</li>
                      <li>• Column count and order are verified</li>
                      <li>• Any mismatches are clearly highlighted</li>
                      <li>• Validation results are displayed for each file</li>
                    </ul>
                  </div>
                </div>
                
                <div className="border-l-4 border-green-400 pl-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Step 4: Review and Merge</h3>
                  <p className="text-gray-700 mb-3">Once validation passes, proceed with merging:</p>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <ul className="text-sm space-y-1">
                      <li>• Review the file list and validation status</li>
                      <li>• Click &quot;Merge CSV Files&quot; to start the process</li>
                      <li>• The tool combines all data rows while preserving headers</li>
                      <li>• Progress is shown during the merging process</li>
                    </ul>
                  </div>
                </div>
                
                <div className="border-l-4 border-green-400 pl-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Step 5: Download Merged File</h3>
                  <p className="text-gray-700 mb-3">Download your consolidated CSV file:</p>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <ul className="text-sm space-y-1">
                      <li>• Preview the merged data to verify results</li>
                      <li>• Check row counts and data integrity</li>
                      <li>• Download the merged file with a descriptive filename</li>
                      <li>• The merged file contains all data with a single header row</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Advanced Features */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Advanced Features</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-purple-900 mb-3">Smart Error Handling</h3>
                  <ul className="text-purple-800 space-y-2 text-sm">
                    <li>• Detailed error messages for structure mismatches</li>
                    <li>• File-by-file validation status</li>
                    <li>• Suggestions for fixing common issues</li>
                    <li>• Prevention of data corruption</li>
                  </ul>
                </div>
                
                <div className="bg-teal-50 border border-teal-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-teal-900 mb-3">Data Preservation</h3>
                  <ul className="text-teal-800 space-y-2 text-sm">
                    <li>• Original data formatting maintained</li>
                    <li>• No data modification during merge</li>
                    <li>• Proper handling of special characters</li>
                    <li>• Consistent row ordering</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Common Use Cases */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Common Use Cases</h2>
              
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-blue-900 mb-3">Business Scenarios</h3>
                  <ul className="text-blue-800 space-y-2 text-sm">
                    <li>• <strong>Monthly Reports</strong>: Combine monthly sales, financial, or performance reports</li>
                    <li>• <strong>Multi-Location Data</strong>: Merge data from different store locations or branches</li>
                    <li>• <strong>Department Consolidation</strong>: Combine reports from different departments</li>
                    <li>• <strong>Time Series Data</strong>: Merge historical data files into a comprehensive dataset</li>
                  </ul>
                </div>
                
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-green-900 mb-3">Data Analysis Scenarios</h3>
                  <ul className="text-green-800 space-y-2 text-sm">
                    <li>• <strong>Survey Data</strong>: Combine survey responses from multiple collection periods</li>
                    <li>• <strong>Experimental Results</strong>: Merge data from multiple experimental runs</li>
                    <li>• <strong>Log File Consolidation</strong>: Combine log files from different systems or time periods</li>
                    <li>• <strong>Database Exports</strong>: Merge exported data from multiple database queries</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Troubleshooting */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Troubleshooting Common Issues</h2>
              
              <div className="space-y-6">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-yellow-900 mb-3">Column Header Mismatches</h3>
                  <p className="text-yellow-800 mb-2"><strong>Problem:</strong> Files have different column names or order</p>
                  <p className="text-yellow-800 mb-2"><strong>Solution:</strong></p>
                  <ul className="text-yellow-800 space-y-1 text-sm">
                    <li>• Standardize column names across all files</li>
                    <li>• Ensure consistent column ordering</li>
                    <li>• Check for extra spaces or special characters in headers</li>
                  </ul>
                </div>
                
                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-red-900 mb-3">Different Column Counts</h3>
                  <p className="text-red-800 mb-2"><strong>Problem:</strong> Files have different numbers of columns</p>
                  <p className="text-red-800 mb-2"><strong>Solution:</strong></p>
                  <ul className="text-red-800 space-y-1 text-sm">
                    <li>• Add missing columns to files with fewer columns</li>
                    <li>• Remove extra columns from files with more columns</li>
                    <li>• Ensure all files follow the same template structure</li>
                  </ul>
                </div>
                
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-orange-900 mb-3">Encoding Issues</h3>
                  <p className="text-orange-800 mb-2"><strong>Problem:</strong> Special characters appear incorrectly</p>
                  <p className="text-orange-800 mb-2"><strong>Solution:</strong></p>
                  <ul className="text-orange-800 space-y-1 text-sm">
                    <li>• Save all files with UTF-8 encoding</li>
                    <li>• Use consistent encoding across all files</li>
                    <li>• Check file encoding before uploading</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Best Practices */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="w-6 h-6 text-indigo-600" />
                Best Practices
              </h2>
              
              <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6">
                <ul className="text-indigo-800 space-y-3 text-sm">
                  <li>• <strong>Create a Template</strong>: Use a standard template for all files to ensure consistency</li>
                  <li>• <strong>Validate Before Upload</strong>: Check file structures manually before using the merger</li>
                  <li>• <strong>Backup Original Files</strong>: Keep copies of original files before merging</li>
                  <li>• <strong>Test with Small Files</strong>: Test the merge process with smaller files first</li>
                  <li>• <strong>Document Your Process</strong>: Keep notes on file sources and merge procedures</li>
                  <li>• <strong>Verify Results</strong>: Always review the merged file to ensure data integrity</li>
                </ul>
              </div>
            </section>

            {/* Conclusion */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Conclusion</h2>
              <p className="text-gray-700 mb-4">
                The CSV Merger tool provides a reliable and efficient way to combine multiple CSV files while 
                maintaining data integrity. By following the structure requirements and best practices outlined 
                in this guide, you can successfully merge your data files and create comprehensive datasets.
              </p>
              
              <div className="bg-gray-50 rounded-lg p-6 mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Merge className="w-5 h-5" />
                  Ready to Merge Your CSV Files?
                </h3>
                <p className="text-gray-700 mb-4">
                  Try our CSV Merger tool now and experience efficient data consolidation with automatic 
                  structure validation and error detection.
                </p>
                <Link 
                  href="/tools/csv-merger" 
                  className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Open CSV Merger Tool
                </Link>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}