import { Metadata } from 'next'
import Link from 'next/link'
import { Clock, User, Split, Grid3X3, FileText, Download } from 'lucide-react'
import TutorialHeader from '@/components/TutorialHeader'

export const metadata: Metadata = {
  alternates: { canonical: '/tutorials/csv-splitter-guide/' },
  title: 'CSV Splitter Complete Guide - Split Large CSV Files Efficiently',
  description: 'Learn how to split CSV files using column-based splitting and row-based splitting. Master both one-to-many and large-to-small splitting techniques for efficient data management.',
  keywords: 'CSV splitter, split CSV files, column splitting, row splitting, data management, file processing, CSV tools',
  openGraph: {
    title: 'CSV Splitter Complete Guide - CSVFilters',
    description: 'Complete guide to splitting CSV files efficiently',
    type: 'article',
  },
}

export default function CSVSplitterGuidePage() {
  const breadcrumbItems = [
    { label: 'Tutorials', href: '/tutorials' }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <TutorialHeader 
        title="CSV Splitter Complete Guide"
        showBackButton={true}
        showBreadcrumb={true}
        breadcrumbItems={breadcrumbItems}
      />
      
      <div className="container mx-auto px-4 py-8">
        {/* Article Header */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
              Tool Tutorial
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
            <span>Published: 2025-08-26</span>
          </div>
          
          <p className="text-xl text-gray-700 leading-relaxed">
            Learn how to efficiently split large CSV files using our advanced CSV Splitter tool. 
            Master both column-based splitting for data categorization and row-based splitting for file size management.
          </p>
        </div>

        {/* Article Content */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="prose prose-lg max-w-none">
            {/* Introduction */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Why Split CSV Files?</h2>
              <p className="text-gray-700 mb-4">
                CSV file splitting is essential for data management, especially when dealing with large datasets. 
                Our CSV Splitter offers two powerful splitting modes to handle different scenarios:
              </p>
              
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center gap-2">
                    <Split className="w-5 h-5" />
                    Column Split (One-to-Many)
                  </h3>
                  <ul className="text-blue-800 space-y-2 text-sm">
                    <li>• Split data by unique column values</li>
                    <li>• Create separate files for each category</li>
                    <li>• Perfect for data segmentation</li>
                    <li>• Maintain data relationships</li>
                  </ul>
                </div>
                
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-green-900 mb-3 flex items-center gap-2">
                    <Grid3X3 className="w-5 h-5" />
                    Row Split (Large-to-Small)
                  </h3>
                  <ul className="text-green-800 space-y-2 text-sm">
                    <li>• Split large files into smaller chunks</li>
                    <li>• Preserve headers in each file</li>
                    <li>• Even distribution of data</li>
                    <li>• Easier file management</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Column Split Guide */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Split className="w-6 h-6 text-blue-600" />
                Column Split: One-to-Many Splitting
              </h2>
              
              <p className="text-gray-700 mb-4">
                Column splitting allows you to divide your CSV file based on unique values in a specific column. 
                This is perfect for creating separate files for different categories, regions, or any grouping criteria.
              </p>
              
              <div className="space-y-6">
                <div className="border-l-4 border-blue-400 pl-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Step 1: Upload Your CSV File</h3>
                  <p className="text-gray-700 mb-3">Start by uploading your CSV file to the CSV Splitter tool:</p>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <ul className="text-sm space-y-1">
                      <li>• Click the upload area or drag and drop your CSV file</li>
                      <li>• The tool will automatically parse and display your data</li>
                      <li>• Column headers will be detected automatically</li>
                      <li>• Preview the first few rows to verify correct parsing</li>
                    </ul>
                  </div>
                </div>
                
                <div className="border-l-4 border-blue-400 pl-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Step 2: Select Column Split Mode</h3>
                  <p className="text-gray-700 mb-3">Choose the &quot;Column Split&quot; tab to access column-based splitting:</p>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <ul className="text-sm space-y-1">
                      <li>• Click on the &quot;Column Split&quot; tab</li>
                      <li>• This mode splits data based on unique column values</li>
                      <li>• Each unique value creates a separate output file</li>
                    </ul>
                  </div>
                </div>
                
                <div className="border-l-4 border-blue-400 pl-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Step 3: Choose Split Column</h3>
                  <p className="text-gray-700 mb-3">Select the column you want to use for splitting:</p>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <ul className="text-sm space-y-1">
                      <li>• Choose from available column headers</li>
                      <li>• Consider columns with meaningful categories</li>
                      <li>• Avoid columns with too many unique values</li>
                      <li>• Preview shows how many files will be created</li>
                    </ul>
                  </div>
                </div>
                
                <div className="border-l-4 border-blue-400 pl-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Step 4: Execute and Download</h3>
                  <p className="text-gray-700 mb-3">Split your file and download the results:</p>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <ul className="text-sm space-y-1">
                      <li>• Click &quot;Split by Column&quot; to process the file</li>
                      <li>• Review the split results in the preview</li>
                      <li>• Download individual files or all files as ZIP</li>
                      <li>• Each file contains only rows with the same column value</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Row Split Guide */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Grid3X3 className="w-6 h-6 text-green-600" />
                Row Split: Large-to-Small Splitting
              </h2>
              
              <p className="text-gray-700 mb-4">
                Row splitting divides large CSV files into smaller, more manageable chunks while preserving 
                the header row in each output file. This is ideal for processing large datasets in smaller batches.
              </p>
              
              <div className="space-y-6">
                <div className="border-l-4 border-green-400 pl-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Step 1: Upload and Select Row Split</h3>
                  <p className="text-gray-700 mb-3">After uploading your CSV file, switch to row splitting mode:</p>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <ul className="text-sm space-y-1">
                      <li>• Upload your CSV file as usual</li>
                      <li>• Click on the &quot;Row Split&quot; tab</li>
                      <li>• This mode splits data into equal-sized chunks</li>
                      <li>• Headers are preserved in each output file</li>
                    </ul>
                  </div>
                </div>
                
                <div className="border-l-4 border-green-400 pl-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Step 2: Configure Split Settings</h3>
                  <p className="text-gray-700 mb-3">Set how many files you want to create:</p>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <ul className="text-sm space-y-1">
                      <li>• Enter the desired number of output files</li>
                      <li>• The tool calculates rows per file automatically</li>
                      <li>• See estimated rows per file in real-time</li>
                      <li>• Minimum 2 files, adjust based on your needs</li>
                    </ul>
                  </div>
                </div>
                
                <div className="border-l-4 border-green-400 pl-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Step 3: Execute Row Splitting</h3>
                  <p className="text-gray-700 mb-3">Process your file and download the chunks:</p>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <ul className="text-sm space-y-1">
                      <li>• Click &quot;Split by Rows&quot; to start processing</li>
                      <li>• Files are created with sequential numbering</li>
                      <li>• Each file maintains the original header row</li>
                      <li>• Download as individual files or ZIP archive</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Best Practices */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="w-6 h-6 text-purple-600" />
                Best Practices and Tips
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Column Split Tips</h3>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <ul className="text-blue-800 space-y-2 text-sm">
                      <li>• Choose columns with meaningful categories</li>
                      <li>• Avoid columns with too many unique values</li>
                      <li>• Consider data distribution before splitting</li>
                      <li>• Use descriptive column names for better file naming</li>
                    </ul>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Row Split Tips</h3>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <ul className="text-green-800 space-y-2 text-sm">
                      <li>• Consider your processing capacity when setting file count</li>
                      <li>• Ensure each chunk has enough data for analysis</li>
                      <li>• Keep file sizes manageable for your tools</li>
                      <li>• Document the splitting strategy for future reference</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Common Use Cases */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Common Use Cases</h2>
              
              <div className="space-y-6">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-yellow-900 mb-3">When to Use Column Split</h3>
                  <ul className="text-yellow-800 space-y-2 text-sm">
                    <li>• Separating sales data by region or product category</li>
                    <li>• Creating department-specific reports from company data</li>
                    <li>• Splitting customer data by subscription type</li>
                    <li>• Organizing survey responses by demographic groups</li>
                  </ul>
                </div>
                
                <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-indigo-900 mb-3">When to Use Row Split</h3>
                  <ul className="text-indigo-800 space-y-2 text-sm">
                    <li>• Processing large datasets in smaller batches</li>
                    <li>• Preparing data for systems with file size limits</li>
                    <li>• Creating manageable chunks for manual review</li>
                    <li>• Distributing large datasets across multiple processors</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Conclusion */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Conclusion</h2>
              <p className="text-gray-700 mb-4">
                The CSV Splitter tool provides flexible options for managing your data files efficiently. 
                Whether you need to categorize data using column splitting or manage file sizes with row splitting, 
                both methods preserve data integrity while making your files more manageable.
              </p>
              
              <div className="bg-gray-50 rounded-lg p-6 mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Download className="w-5 h-5" />
                  Ready to Split Your CSV Files?
                </h3>
                <p className="text-gray-700 mb-4">
                  Try our CSV Splitter tool now and experience efficient file management with both column and row splitting capabilities.
                </p>
                <Link 
                  href="/tools/csv-splitter" 
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Open CSV Splitter Tool
                </Link>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}