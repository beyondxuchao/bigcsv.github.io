/* eslint-disable react/no-unescaped-entities */
import { Metadata } from 'next'
import Link from 'next/link'
import { Clock, User, FileSpreadsheet, Users, Target, AlertTriangle, CheckCircle, Upload } from 'lucide-react'
import TutorialHeader from '@/components/TutorialHeader'

export const metadata: Metadata = {
  alternates: { canonical: '/tutorials/excel-template-generator-guide/' },
  title: 'Excel Template Generator Complete Guide - Automated Document Creation',
  description: 'Master the Excel Template Generator tool. Learn how to create personalized documents from templates, handle group data, and automate file generation for business workflows.',
  keywords: 'Excel template generator, automated document creation, template variables, group data processing, business automation, personalized documents, Excel automation',
  openGraph: {
    title: 'Excel Template Generator Complete Guide - CSVFilters',
    description: 'Complete guide to automated document creation with Excel Template Generator',
    type: 'article',
  },
}

export default function ExcelTemplateGeneratorGuidePage() {
  const breadcrumbItems = [
    { label: 'Tutorials', href: '/tutorials' }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <TutorialHeader 
        title="Excel Template Generator Complete Guide"
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
              <span>Reading time: 8 minutes</span>
            </div>
            <div className="flex items-center gap-1">
              <User className="w-4 h-4" />
              <span>Author: CSVFilters Team</span>
            </div>
            <span>Published: 2025-01-09</span>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Excel Template Generator: Complete Guide to Automated Document Creation
          </h1>
          
          <p className="text-lg text-gray-700 leading-relaxed">
            Learn how to transform your data into personalized documents using our Excel Template Generator. 
            This powerful tool automatically creates customized files from templates, perfect for generating 
            reports, certificates, invoices, and other business documents at scale.
          </p>
        </div>

        {/* Table of Contents */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Table of Contents</h2>
          <nav className="space-y-2">
            <a href="#what-is-template-generator" className="block text-blue-600 hover:text-blue-800 transition-colors">
              1. What is Excel Template Generator?
            </a>
            <a href="#use-cases" className="block text-blue-600 hover:text-blue-800 transition-colors">
              2. Common Use Cases and Scenarios
            </a>
            <a href="#how-it-works" className="block text-blue-600 hover:text-blue-800 transition-colors">
              3. How It Works: Smart Grouping & Variables
            </a>
            <a href="#step-by-step" className="block text-blue-600 hover:text-blue-800 transition-colors">
              4. Step-by-Step Tutorial
            </a>
            <a href="#template-variables" className="block text-blue-600 hover:text-blue-800 transition-colors">
              5. Template Variables Reference
            </a>
            <a href="#advanced-features" className="block text-blue-600 hover:text-blue-800 transition-colors">
              6. Advanced Features
            </a>
            <a href="#best-practices" className="block text-blue-600 hover:text-blue-800 transition-colors">
              7. Best Practices & Tips
            </a>
            <a href="#troubleshooting" className="block text-blue-600 hover:text-blue-800 transition-colors">
              8. Troubleshooting Common Issues
            </a>
          </nav>
        </div>

        {/* What is Excel Template Generator */}
        <div id="what-is-template-generator" className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <FileSpreadsheet className="w-8 h-8 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">What is Excel Template Generator?</h2>
          </div>
          
          <div className="prose max-w-none">
            <p className="text-gray-700 mb-4">
              The Excel Template Generator is an intelligent automation tool that creates personalized documents 
              by combining template files with data files. It automatically groups related records and generates 
              individual files for each group, making it perfect for bulk document creation.
            </p>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-blue-900 mb-2">Key Features:</h3>
              <ul className="text-blue-800 space-y-1">
                <li>• <strong>Smart Grouping:</strong> Automatically groups records with matching values</li>
                <li>• <strong>Template Variables:</strong> Use {'{{variableName}}'} placeholders for dynamic content</li>
                <li>• <strong>Format Preservation:</strong> Maintains Excel formatting (fonts, colors, borders)</li>
                <li>• <strong>Multiple Formats:</strong> Supports both Excel (.xlsx) and CSV files</li>
                <li>• <strong>Bulk Generation:</strong> Creates multiple files in one operation</li>
                <li>• <strong>Group Statistics:</strong> Includes member count and grouping information</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Use Cases */}
        <div id="use-cases" className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Target className="w-8 h-8 text-green-600" />
            <h2 className="text-2xl font-bold text-gray-900">Common Use Cases and Scenarios</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-green-900 mb-2">🏢 Business & HR</h3>
              <ul className="text-green-800 text-sm space-y-1">
                <li>• Employee certificates and awards</li>
                <li>• Department reports with team member lists</li>
                <li>• Payroll summaries by department</li>
                <li>• Training completion certificates</li>
                <li>• Performance review documents</li>
              </ul>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">📊 Sales & Marketing</h3>
              <ul className="text-blue-800 text-sm space-y-1">
                <li>• Customer invoices with order details</li>
                <li>• Sales reports by region or team</li>
                <li>• Product catalogs for different markets</li>
                <li>• Commission statements</li>
                <li>• Client proposals with team information</li>
              </ul>
            </div>
            
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h3 className="font-semibold text-purple-900 mb-2">🎓 Education</h3>
              <ul className="text-purple-800 text-sm space-y-1">
                <li>• Student grade reports by class</li>
                <li>• Course completion certificates</li>
                <li>• Class rosters with student details</li>
                <li>• Parent-teacher conference schedules</li>
                <li>• Academic transcripts</li>
              </ul>
            </div>
            
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <h3 className="font-semibold text-orange-900 mb-2">🏥 Healthcare & Services</h3>
              <ul className="text-orange-800 text-sm space-y-1">
                <li>• Patient appointment summaries</li>
                <li>• Medical reports by department</li>
                <li>• Insurance claim documents</li>
                <li>• Service provider schedules</li>
                <li>• Treatment plan documents</li>
              </ul>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div id="how-it-works" className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Users className="w-8 h-8 text-purple-600" />
            <h2 className="text-2xl font-bold text-gray-900">How It Works: Smart Grouping & Variables</h2>
          </div>
          
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3">1. Smart Grouping Algorithm</h3>
              <p className="text-gray-700 mb-3">
                The tool automatically analyzes your data to find the best grouping field - the field with the most 
                duplicate values. Records sharing the same value in this field are grouped together.
              </p>
              <div className="bg-white border rounded p-3 text-sm">
                <strong>Example:</strong> If you have employee data with departments, all employees in "Sales" 
                will be grouped together, "Marketing" in another group, etc.
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3">2. Primary and Related Records</h3>
              <p className="text-gray-700 mb-3">
                Within each group, the first record becomes the "primary record" and the rest become "related records". 
                This structure allows you to create documents like team reports where one person is the lead.
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3">3. Template Variable System</h3>
              <p className="text-gray-700 mb-3">
                Use {'{{variableName}}'} placeholders in your template. The tool replaces these with actual data 
                from your records, creating personalized documents for each group.
              </p>
            </div>
          </div>
        </div>

        {/* Step by Step Tutorial */}
        <div id="step-by-step" className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <h2 className="text-2xl font-bold text-gray-900">Step-by-Step Tutorial</h2>
          </div>
          
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold">
                1
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Prepare Your Template File</h3>
                <p className="text-gray-700 mb-3">
                  Create an Excel or CSV file with your desired layout. Use {'{{variableName}}'} placeholders 
                  where you want dynamic content to appear.
                </p>
                <div className="bg-gray-50 border rounded p-3 text-sm">
                  <strong>Example Template:</strong><br/>
                  Employee Report<br/>
                  Name: {'{{name}}'}<br/>
                  Department: {'{{department}}'}<br/>
                  Team Size: {'{{memberCount}}'} members<br/>
                  Team Members: {'{{related1_name}}'}, {'{{related2_name}}'}
                </div>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold">
                2
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Prepare Your Data File</h3>
                <p className="text-gray-700 mb-3">
                  Create a data file (Excel or CSV) with headers matching your template variables. 
                  Each row represents one record.
                </p>
                <div className="bg-gray-50 border rounded p-3 text-sm">
                  <strong>Example Data:</strong><br/>
                  name,department,position,salary<br/>
                  John Smith,Sales,Manager,75000<br/>
                  Jane Doe,Sales,Representative,55000<br/>
                  Mike Johnson,Marketing,Director,85000
                </div>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold">
                3
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Upload Files to the Tool</h3>
                <p className="text-gray-700 mb-3">
                  Go to the Excel Template Generator tool and upload both your template and data files. 
                  The tool accepts both Excel (.xlsx) and CSV formats.
                </p>
                <Link href="/tools/excel-template-generator" className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
                  <Upload className="w-4 h-4" />
                  Open Template Generator
                </Link>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold">
                4
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Generate and Download</h3>
                <p className="text-gray-700 mb-3">
                  Click "Generate Files" to create personalized documents. The tool will automatically 
                  group your data and generate one file per group, then package everything into a ZIP file.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Template Variables Reference */}
        <div id="template-variables" className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Template Variables Reference</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Primary Record Variables</h3>
              <div className="space-y-2 text-sm">
                <div className="bg-gray-50 p-2 rounded">
                  <code className="text-blue-600">{'{{any_field_name}}'}</code>
                  <p className="text-gray-600">Any field from the primary record</p>
                </div>
                <div className="bg-gray-50 p-2 rounded">
                  <code className="text-blue-600">{'{{groupingField}}'}</code>
                  <p className="text-gray-600">Name of the field used for grouping</p>
                </div>
                <div className="bg-gray-50 p-2 rounded">
                  <code className="text-blue-600">{'{{groupValue}}'}</code>
                  <p className="text-gray-600">Value of the grouping field</p>
                </div>
                <div className="bg-gray-50 p-2 rounded">
                  <code className="text-blue-600">{'{{memberCount}}'}</code>
                  <p className="text-gray-600">Total number of members in the group</p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Related Records Variables</h3>
              <div className="space-y-2 text-sm">
                <div className="bg-gray-50 p-2 rounded">
                  <code className="text-blue-600">{'{{related1_fieldname}}'}</code>
                  <p className="text-gray-600">First related record's field</p>
                </div>
                <div className="bg-gray-50 p-2 rounded">
                  <code className="text-blue-600">{'{{related2_fieldname}}'}</code>
                  <p className="text-gray-600">Second related record's field</p>
                </div>
                <div className="bg-gray-50 p-2 rounded">
                  <code className="text-blue-600">{'{{relatedN_fieldname}}'}</code>
                  <p className="text-gray-600">Nth related record's field (any number)</p>
                </div>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded p-3 mt-4">
                <p className="text-blue-800 text-sm">
                  <strong>Smart Handling:</strong> You can use any number (e.g., {'{{related10_name}}'}) - 
                  the system automatically fills available data and removes unused variables.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Advanced Features */}
        <div id="advanced-features" className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Advanced Features</h2>
          
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">🎨 Format Preservation</h3>
              <p className="text-gray-700 text-sm">
                When using Excel templates, all formatting is preserved including fonts, colors, borders, 
                merged cells, and number formats. Your generated documents maintain professional appearance.
              </p>
            </div>
            
            <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">🔄 Mixed File Format Support</h3>
              <p className="text-gray-700 text-sm">
                You can mix file formats - use a CSV template with Excel data, or vice versa. 
                The tool handles format conversion automatically.
              </p>
            </div>
            
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">🧠 Intelligent Grouping</h3>
              <p className="text-gray-700 text-sm">
                The algorithm automatically selects the best grouping field by analyzing which field 
                has the most duplicate values, ensuring optimal document organization.
              </p>
            </div>
            
            <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">📦 Bulk Processing</h3>
              <p className="text-gray-700 text-sm">
                Generate hundreds of documents in seconds. All files are automatically packaged 
                into a convenient ZIP file for easy download and distribution.
              </p>
            </div>
          </div>
        </div>

        {/* Best Practices */}
        <div id="best-practices" className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Best Practices & Tips</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-green-600 mb-3">✅ Do's</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  Use descriptive variable names that match your data headers exactly
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  Test with a small dataset first to verify your template works correctly
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  Include {'{{memberCount}}'} to show group size information
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  Use Excel templates when you need formatted output
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  Keep data clean with consistent formatting and no empty rows
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-red-600 mb-3">❌ Don'ts</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                  Don't use spaces or special characters in variable names
                </li>
                <li className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                  Don't forget the double curly braces {'{{}}'}  around variable names
                </li>
                <li className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                  Don't include header rows in your data beyond the first row
                </li>
                <li className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                  Don't use the same variable name for different data types
                </li>
                <li className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                  Don't process extremely large files without testing smaller batches first
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Troubleshooting */}
        <div id="troubleshooting" className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Troubleshooting Common Issues</h2>
          
          <div className="space-y-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">❓ Variables not being replaced</h3>
              <p className="text-gray-700 text-sm mb-2">
                <strong>Cause:</strong> Variable names don't match data headers exactly.
              </p>
              <p className="text-green-700 text-sm">
                <strong>Solution:</strong> Check that variable names in your template match the column 
                headers in your data file exactly (case-sensitive).
              </p>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">❓ No files generated</h3>
              <p className="text-gray-700 text-sm mb-2">
                <strong>Cause:</strong> Data file has no valid grouping or empty rows.
              </p>
              <p className="text-green-700 text-sm">
                <strong>Solution:</strong> Ensure your data has at least 2 rows (header + data) and 
                remove any completely empty rows.
              </p>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">❓ Formatting lost in output</h3>
              <p className="text-gray-700 text-sm mb-2">
                <strong>Cause:</strong> Using CSV template instead of Excel template.
              </p>
              <p className="text-green-700 text-sm">
                <strong>Solution:</strong> Use Excel (.xlsx) templates to preserve formatting. 
                CSV templates will generate plain text output.
              </p>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">❓ Related variables showing empty</h3>
              <p className="text-gray-700 text-sm mb-2">
                <strong>Cause:</strong> Not enough related records in the group or incorrect variable syntax.
              </p>
              <p className="text-green-700 text-sm">
                <strong>Solution:</strong> Use {'{{related1_fieldname}}'} format and ensure groups have 
                multiple records. Unused variables are automatically removed.
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Automate Your Document Creation?</h2>
          <p className="text-blue-100 mb-6">
            Start generating personalized documents from your data in minutes. 
            Try our Excel Template Generator tool now!
          </p>
          <Link 
            href="/tools/excel-template-generator" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
          >
            <FileSpreadsheet className="w-5 h-5" />
            Open Excel Template Generator
          </Link>
        </div>

        {/* Related Tutorials */}
        <div className="bg-white rounded-xl shadow-lg p-8 mt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Related Tutorials</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <Link href="/tutorials/csv-merger-guide" className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
              <h3 className="font-semibold text-gray-900 mb-2">CSV Merger Guide</h3>
              <p className="text-gray-600 text-sm">Learn how to combine multiple CSV files efficiently</p>
            </Link>
            <Link href="/tutorials/format-converter" className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
              <h3 className="font-semibold text-gray-900 mb-2">Format Converter</h3>
              <p className="text-gray-600 text-sm">Convert between different file formats</p>
            </Link>
            <Link href="/tutorials/csv-splitter-guide" className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
              <h3 className="font-semibold text-gray-900 mb-2">CSV Splitter Guide</h3>
              <p className="text-gray-600 text-sm">Split large CSV files into smaller chunks</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
