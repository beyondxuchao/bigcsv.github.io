import { Metadata } from 'next'
import { Clock, User } from 'lucide-react'
import TutorialHeader from '@/components/TutorialHeader'

export const metadata: Metadata = {
  title: 'What is JSON Format? Complete Guide to JavaScript Object Notation - CSVFilters',
  description: 'Learn everything about JSON (JavaScript Object Notation) format: definition, syntax, features, use cases, and best practices for data exchange and storage.',
  keywords: 'JSON format, JavaScript Object Notation, JSON file, data exchange, API, web development, data storage',
  openGraph: {
    title: 'What is JSON Format? Complete Guide to JavaScript Object Notation',
    description: 'Complete guide to understanding and working with JSON files',
    type: 'article',
  },
}

export default function WhatIsJsonFormatPage() {
  const breadcrumbItems = [
    { label: 'Tutorials', href: '/tutorials' }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <TutorialHeader 
        title="What is JSON Format? Complete Guide to JavaScript Object Notation"
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
              <span>Reading time: 8 minutes</span>
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
          
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Introduction to JSON</h2>
              <p className="text-gray-600 mb-6">
                JSON (JavaScript Object Notation) is a lightweight, text-based data interchange format. Despite its name suggesting a connection to JavaScript, JSON is language-independent and is used across many programming languages.
              </p>

              <h2 className="text-2xl font-bold text-gray-800 mb-4">Key Features of JSON</h2>
              <ul className="list-disc pl-6 mb-6 text-gray-600">
                <li><strong>Human-readable:</strong> JSON files can be easily read and understood by humans</li>
                <li><strong>Lightweight</strong>: Compared to XML, JSON is more concise and takes up less storage space</li>
                <li><strong>Language-independent</strong>: Almost all programming languages support JSON</li>
                <li><strong>Structured</strong>: Supports nested objects and array structures</li>
                <li><strong>Standardized</strong>: Based on RFC 7159 standard</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-800 mb-4">JSON Syntax Rules</h2>
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h3 className="text-lg font-semibold mb-3">Basic Syntax:</h3>
                <ul className="list-disc pl-6 text-gray-600">
                  <li>Data exists in key-value pairs</li>
                  <li>Data is separated by commas</li>
                  <li>Objects are enclosed in curly braces {}</li>
                  <li>Arrays are enclosed in square brackets []</li>
                  <li>Strings must be enclosed in double quotes</li>
                </ul>
              </div>

              <h2 className="text-2xl font-bold text-gray-800 mb-4">JSON Data Types</h2>
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-800 mb-2">Primitive Types:</h3>
                  <ul className="text-sm text-blue-700">
                    <li>• String</li>
                    <li>• Number</li>
                    <li>• Boolean</li>
                    <li>• null</li>
                  </ul>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-green-800 mb-2">Complex Types:</h3>
                  <ul className="text-sm text-green-700">
                    <li>• Object</li>
                    <li>• Array</li>
                  </ul>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-gray-800 mb-4">JSON Example</h2>
              <div className="bg-gray-900 text-green-400 p-4 rounded-lg mb-6 overflow-x-auto">
                <pre className="text-sm">
{`{
  "name": "John Doe",
  "age": 30,
  "isStudent": false,
  "address": {
    "city": "New York",
    "zipCode": "10001"
  },
  "hobbies": ["reading", "swimming", "programming"],
  "spouse": null
}`}
                </pre>
              </div>

              <h2 className="text-2xl font-bold text-gray-800 mb-4">JSON Use Cases</h2>
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-purple-800 mb-2">Web Development:</h3>
                  <ul className="text-sm text-purple-700">
                    <li>• API data exchange</li>
                    <li>• AJAX request/response</li>
                    <li>• Configuration files</li>
                    <li>• Frontend-backend data transmission</li>
                  </ul>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-orange-800 mb-2">Other Applications:</h3>
                  <ul className="text-sm text-orange-700">
                    <li>• Data storage</li>
                    <li>• Logging</li>
                    <li>• Mobile app development</li>
                    <li>• Microservices communication</li>
                  </ul>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-gray-800 mb-4">JSON vs Other Formats</h2>
              <div className="overflow-x-auto mb-6">
                <table className="min-w-full bg-white border border-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 border-b text-left">Feature</th>
                      <th className="px-4 py-2 border-b text-left">JSON</th>
                      <th className="px-4 py-2 border-b text-left">XML</th>
                      <th className="px-4 py-2 border-b text-left">CSV</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="px-4 py-2 border-b font-medium">Readability</td>
                      <td className="px-4 py-2 border-b text-green-600">High</td>
                      <td className="px-4 py-2 border-b text-yellow-600">Medium</td>
                      <td className="px-4 py-2 border-b text-green-600">High</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 border-b font-medium">File Size</td>
                      <td className="px-4 py-2 border-b text-green-600">Small</td>
                      <td className="px-4 py-2 border-b text-red-600">Large</td>
                      <td className="px-4 py-2 border-b text-green-600">Small</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 border-b font-medium">Nested Support</td>
                      <td className="px-4 py-2 border-b text-green-600">Yes</td>
                      <td className="px-4 py-2 border-b text-green-600">Yes</td>
                      <td className="px-4 py-2 border-b text-red-600">No</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 border-b font-medium">Parsing Speed</td>
                      <td className="px-4 py-2 border-b text-green-600">Fast</td>
                      <td className="px-4 py-2 border-b text-yellow-600">Medium</td>
                      <td className="px-4 py-2 border-b text-green-600">Fast</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h2 className="text-2xl font-bold text-gray-800 mb-4">JSON Best Practices</h2>
              <div className="bg-yellow-50 p-6 rounded-lg mb-6">
                <h3 className="font-semibold text-yellow-800 mb-3">Writing Guidelines:</h3>
                <ul className="list-disc pl-6 text-yellow-700">
                  <li>Use meaningful key names</li>
                  <li>Maintain consistent naming conventions (e.g., camelCase)</li>
                  <li>Avoid overly deep nested structures</li>
                  <li>Use arrays and objects appropriately</li>
                  <li>Pay attention to data type correctness</li>
                  <li>Use JSON validation tools to check format</li>
                </ul>
              </div>

              <h2 className="text-2xl font-bold text-gray-800 mb-4">Common Mistakes</h2>
              <div className="bg-red-50 p-6 rounded-lg mb-6">
                <h3 className="font-semibold text-red-800 mb-3">Avoid These Errors:</h3>
                <ul className="list-disc pl-6 text-red-700">
                  <li>Using single quotes instead of double quotes</li>
                  <li>Adding comma after the last element</li>
                  <li>Using undefined data types</li>
                  <li>Key names not enclosed in quotes</li>
                  <li>Comments (JSON doesn&apos;t support comments)</li>
                </ul>
              </div>

              <h2 className="text-2xl font-bold text-gray-800 mb-4">Conclusion</h2>
              <p className="text-gray-600 mb-4">
                JSON is an indispensable data format in modern web development. Its simplicity, readability, and widespread support make it
                the preferred format for data exchange. Mastering JSON syntax and best practices is an essential skill for any developer.
              </p>
              
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-2">Related Tools:</h3>
                <p className="text-blue-700 text-sm">
                  Our website provides JSON to CSV conversion tools to help you convert between different data formats.
                  <a href="/tools/format-converter/json-to-csv" className="text-blue-600 hover:underline ml-1">
                    Try it now →
                  </a>
                </p>
          </div>
        </div>
      </div>
    </div>
  )
}