import { Metadata } from 'next'
import Link from 'next/link'
import { Clock, User, FileText, ArrowRight, CheckCircle, AlertTriangle, Code, Download } from 'lucide-react'
import TutorialHeader from '@/components/TutorialHeader'

export const metadata: Metadata = {
  title: 'Complete JSON to CSV Conversion Guide - Data Format Conversion Tutorial | CSVFilters',
  description: 'Learn how to convert JSON data to CSV format with detailed tutorials covering manual conversion, online tools, programming implementation, and best practices. Complete guide for beginners and developers.',
  keywords: 'JSON to CSV, data format conversion, JSON CSV converter, data processing, file format conversion, data export, CSV format',
  openGraph: {
    title: 'Complete JSON to CSV Conversion Guide - CSVFilters',
    description: 'From basics to advanced JSON to CSV conversion tutorial',
    type: 'article',
  },
}

export default function JsonToCsvGuidePage() {
  const breadcrumbItems = [
    { label: 'Tutorials', href: '/tutorials' }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <TutorialHeader 
        title="Complete JSON to CSV Conversion Guide"
        showBackButton={true}
        showBreadcrumb={true}
        breadcrumbItems={breadcrumbItems}
      />
      
      <div className="container mx-auto px-4 py-8">
        {/* Article Header */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
              Data Conversion Tutorial
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
            <span>Published: August 22, 2025</span>
          </div>
          
          <p className="text-lg text-gray-700 leading-relaxed">
            JSON (JavaScript Object Notation) and CSV (Comma-Separated Values) are two common data formats.
            This tutorial will provide detailed instructions on how to convert JSON data to CSV format, including manual conversion, using online tools, and programming implementations.
          </p>
        </div>

        {/* Table of Contents */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Table of Contents
          </h2>
          <nav className="space-y-2">
            <a href="#what-is-json-csv" className="block text-blue-600 hover:text-blue-800 transition-colors">
              1. What are JSON and CSV?
            </a>
            <a href="#why-convert" className="block text-blue-600 hover:text-blue-800 transition-colors">
              2. Why Convert JSON to CSV?
            </a>
            <a href="#data-structure" className="block text-blue-600 hover:text-blue-800 transition-colors">
              3. JSON Data Structure Analysis
            </a>
            <a href="#manual-conversion" className="block text-blue-600 hover:text-blue-800 transition-colors">
              4. Manual Conversion Methods
            </a>
            <a href="#online-tools" className="block text-blue-600 hover:text-blue-800 transition-colors">
              5. Using Online Tools for Conversion
            </a>
            <a href="#programming-methods" className="block text-blue-600 hover:text-blue-800 transition-colors">
              6. Programming Implementation Methods
            </a>
            <a href="#best-practices" className="block text-blue-600 hover:text-blue-800 transition-colors">
              7. Best Practices and Considerations
            </a>
            <a href="#common-issues" className="block text-blue-600 hover:text-blue-800 transition-colors">
              8. Common Issues and Solutions
            </a>
          </nav>
        </div>

        {/* Content Sections */}
        <div className="space-y-8">
          {/* Section 1: What is JSON and CSV */}
          <section id="what-is-json-csv" className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">1. What are JSON and CSV?</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">JSON Format</h3>
                <p className="text-gray-700 mb-4">
                  JSON is a lightweight data interchange format that is easy for humans to read and write, and easy for machines to parse and generate.
                </p>
                <div className="bg-gray-50 rounded p-3">
                  <code className="text-sm">
{`{
  "name": "John Doe",
  "age": 30,
  "city": "New York"
}`}
                  </code>
                </div>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">CSV Format</h3>
                <p className="text-gray-700 mb-4">
                  CSV is a simple file format used to store tabular data, where each line represents a record and fields are separated by commas.
                </p>
                <div className="bg-gray-50 rounded p-3">
                  <code className="text-sm">
{`name,age,city
John Doe,30,New York`}
                  </code>
                </div>
              </div>
            </div>
          </section>

          {/* Section 2: Why Convert */}
          <section id="why-convert" className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">2. Why Convert JSON to CSV?</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  Advantages of CSV
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Can be opened directly in Excel, Google Sheets, and other spreadsheet software</li>
                  <li>• Smaller file size with higher transmission efficiency</li>
                  <li>• Suitable for data analysis and statistics</li>
                  <li>• Good compatibility - supported by almost all data processing tools</li>
                  <li>• Easy to import data into databases</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <ArrowRight className="w-5 h-5 text-blue-600" />
                  Common Use Cases
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Exporting API data to Excel for analysis</li>
                  <li>• Converting website data to report format</li>
                  <li>• Database migration and backup</li>
                  <li>• Providing readable data format for non-technical users</li>
                  <li>• Batch data processing and cleaning</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 3: Data Structure Analysis */}
          <section id="data-structure" className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">3. JSON Data Structure Analysis</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Simple Object Array</h3>
                <p className="text-gray-700 mb-3">The most suitable JSON structure for CSV conversion:</p>
                <div className="bg-gray-50 rounded-lg p-4">
                  <code className="text-sm whitespace-pre">
{`[
  {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "age": 30
  },
  {
    "id": 2,
    "name": "Jane Smith",
    "email": "jane@example.com",
    "age": 25
  }
]`}
                  </code>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Nested Object Structure</h3>
                <p className="text-gray-700 mb-3">JSON with nested objects requires special handling:</p>
                <div className="bg-gray-50 rounded-lg p-4">
                  <code className="text-sm whitespace-pre">
{`[
  {
    "id": 1,
    "name": "John Doe",
    "address": {
      "street": "123 Main St",
      "city": "New York",
      "country": "USA"
    }
  }
]`}
                  </code>
                </div>
                <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                    <p className="text-yellow-800 text-sm">
                      Nested objects need to be flattened, either using dot notation (like address.city) or converting nested objects to JSON strings.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 4: Manual Conversion */}
          <section id="manual-conversion" className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">4. Manual Conversion Methods</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Step-by-Step Guide</h3>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center font-semibold text-sm">
                      1
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Analyze JSON Structure</h4>
                      <p className="text-gray-700 text-sm">Identify all possible field names, which will become CSV column headers.</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center font-semibold text-sm">
                      2
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Create CSV Header Row</h4>
                      <p className="text-gray-700 text-sm">Separate all field names with commas as the first line of the CSV file.</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center font-semibold text-sm">
                      3
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Convert Data Row by Row</h4>
                      <p className="text-gray-700 text-sm">For each JSON object, extract values in the order of the header row, separated by commas.</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center font-semibold text-sm">
                      4
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Handle Special Characters</h4>
                      <p className="text-gray-700 text-sm">If values contain commas, quotes, or line breaks, they need to be surrounded by double quotes and escaped.</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Conversion Example</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Original JSON:</h4>
                    <div className="bg-gray-50 rounded p-3">
                      <code className="text-sm whitespace-pre">
{`[
  {
    "name": "John Doe",
    "age": 30,
    "city": "New York"
  },
  {
    "name": "Jane Smith",
    "age": 25,
    "city": "Los Angeles"
  }
]`}
                      </code>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Converted CSV:</h4>
                    <div className="bg-gray-50 rounded p-3">
                      <code className="text-sm whitespace-pre">
{`name,age,city
John Doe,30,New York
Jane Smith,25,Los Angeles`}
                      </code>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 5: Online Tools */}
          <section id="online-tools" className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">5. Recommended Online Tools</h2>
            
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Download className="w-5 h-5 text-blue-600" />
                  Recommended: CSVFilters JSON to CSV Tool
                </h3>
                <p className="text-gray-700 mb-4">
                  We provide a professional JSON to CSV online tool that supports various conversion options and advanced features.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-gray-700">Supports nested object flattening</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-gray-700">Custom delimiters (comma, semicolon, tab, etc.)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-gray-700">Option to include or exclude headers</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-gray-700">Supports large file processing</span>
                  </div>
                </div>
                <div className="mt-4">
                  <Link href="/tools/json-to-csv-converter" className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    <ArrowRight className="w-4 h-4" />
                    Use Tool Now
                  </Link>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Usage Steps</h3>
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-gray-100 text-gray-700 rounded-full flex items-center justify-center text-sm font-medium">1</span>
                    <span className="text-gray-700">Paste JSON data into the input box or upload a JSON file</span>
                  </div>
                  <div className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-gray-100 text-gray-700 rounded-full flex items-center justify-center text-sm font-medium">2</span>
                    <span className="text-gray-700">Adjust conversion options as needed (delimiter, include headers, etc.)</span>
                  </div>
                  <div className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-gray-100 text-gray-700 rounded-full flex items-center justify-center text-sm font-medium">3</span>
                    <span className="text-gray-700">Click the &quot;Convert to CSV&quot; button to start conversion</span>
                  </div>
                  <div className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-gray-100 text-gray-700 rounded-full flex items-center justify-center text-sm font-medium">4</span>
                    <span className="text-gray-700">Preview the conversion results and download the CSV file after confirmation</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 6: Programming Methods */}
          <section id="programming-methods" className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">6. Programming Implementation Methods</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Code className="w-5 h-5" />
                  JavaScript Implementation
                </h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <code className="text-sm whitespace-pre">
{`function jsonToCsv(jsonArray) {
  if (!Array.isArray(jsonArray) || jsonArray.length === 0) {
    return '';
  }
  
  // Get all field names
  const headers = Object.keys(jsonArray[0]);
  
  // Create CSV header row
  const csvHeaders = headers.join(',');
  
  // Convert data rows
  const csvRows = jsonArray.map(obj => {
    return headers.map(header => {
      const value = obj[header];
      // Handle values containing commas or quotes
      if (typeof value === 'string' && 
          (value.includes(',') || value.includes('"'))) {
        return '"' + value.replace(/"/g, '""') + '"';
      }
      return value;
    }).join(',');
  });
  
  // Combine headers and data
  return [csvHeaders, ...csvRows].join('\\n');
}

// Usage example
const jsonData = [
  { name: 'John Doe', age: 30, city: 'New York' },
  { name: 'Jane Smith', age: 25, city: 'Los Angeles' }
];

const csvResult = jsonToCsv(jsonData);
console.log(csvResult);`}
                  </code>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Python Implementation</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <code className="text-sm whitespace-pre">
{`import json
import csv
import io

def json_to_csv(json_data):
    """
    Convert JSON data to CSV format
    """
    if not json_data:
        return ''
    
    # Get field names
    fieldnames = json_data[0].keys()
    
    # Create CSV string
    output = io.StringIO()
    writer = csv.DictWriter(output, fieldnames=fieldnames)
    
    # Write header row
    writer.writeheader()
    
    # Write data rows
    for row in json_data:
        writer.writerow(row)
    
    return output.getvalue()

# Usage example
json_string = '''
[
  {"name": "John Doe", "age": 30, "city": "New York"},
  {"name": "Jane Smith", "age": 25, "city": "Los Angeles"}
]
'''

json_data = json.loads(json_string)
csv_result = json_to_csv(json_data)
print(csv_result)`}
                  </code>
                </div>
              </div>
            </div>
          </section>

          {/* Section 7: Best Practices */}
          <section id="best-practices" className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">7. Best Practices and Considerations</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  Best Practices
                </h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">•</span>
                    <span>Validate JSON format validity before conversion</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">•</span>
                    <span>For large files, consider batch processing to avoid memory overflow</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">•</span>
                    <span>Maintain consistency in field names, avoid mixed case usage</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">•</span>
                    <span>Choose appropriate flattening strategies for nested objects</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">•</span>
                    <span>Use UTF-8 encoding to ensure proper character display</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-600" />
                  Important Considerations
                </h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-600 mt-1">•</span>
                    <span>CSV format does not support complex nested structures</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-600 mt-1">•</span>
                    <span>Array-type values need special handling (e.g., convert to JSON strings)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-600 mt-1">•</span>
                    <span>Pay attention to handling null and undefined values</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-600 mt-1">•</span>
                    <span>Special characters (commas, quotes, line breaks) need to be escaped</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-600 mt-1">•</span>
                    <span>Different objects may have different fields, need to handle missing values</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 8: Common Issues */}
          <section id="common-issues" className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">8. Common Issues and Solutions</h2>
            
            <div className="space-y-6">
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Issue 1: Character Encoding Problems</h3>
                <p className="text-gray-700 text-sm mb-2">Solutions:</p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Ensure CSV files are saved with UTF-8 encoding</li>
                  <li>• Select UTF-8 encoding when opening in Excel</li>
                  <li>• Add BOM (Byte Order Mark) at the beginning of CSV files</li>
                </ul>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Issue 2: Nested Objects Cannot Be Converted Properly</h3>
                <p className="text-gray-700 text-sm mb-2">Solutions:</p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Use dot notation: address.city, address.street</li>
                  <li>• Convert nested objects to JSON strings</li>
                  <li>• Pre-flatten JSON data structure</li>
                </ul>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Issue 3: Difficulty Handling Array Fields</h3>
                <p className="text-gray-700 text-sm mb-2">Solutions:</p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Convert arrays to semicolon-separated strings</li>
                  <li>• Create separate rows for each array element</li>
                  <li>• Serialize arrays as JSON strings</li>
                </ul>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Issue 4: Inconsistent Field Count</h3>
                <p className="text-gray-700 text-sm mb-2">Solutions:</p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• First collect all possible field names</li>
                  <li>• Fill missing fields with empty or default values</li>
                  <li>• Use union field set as CSV headers</li>
                </ul>
              </div>
            </div>
          </section>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8 mt-12">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Try Our JSON to CSV Tool Now</h2>
            <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
              Use our online tool to quickly convert your JSON data to CSV format. Supports multiple options, easy to use, and completely free.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/tools" className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                <ArrowRight className="w-5 h-5" />
                Start Converting
              </Link>
              <Link href="/tutorials" className="inline-flex items-center justify-center gap-2 border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors">
                View More Tutorials
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}