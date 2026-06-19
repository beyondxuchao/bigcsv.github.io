'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Upload, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';

interface ConversionOptions {
  includeHeaders: boolean;
  delimiter: string;
  flattenNested: boolean;
}

export function JsonToCsvConverter() {
  const [jsonInput, setJsonInput] = useState('');
  const [csvOutput, setCsvOutput] = useState('');
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [options, setOptions] = useState<ConversionOptions>({
    includeHeaders: true,
    delimiter: ',',
    flattenNested: false
  });

  const flattenObject = (obj: any, prefix = ''): any => {
    const flattened: any = {};
    
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const newKey = prefix ? `${prefix}.${key}` : key;
        
        if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
          Object.assign(flattened, flattenObject(obj[key], newKey));
        } else if (Array.isArray(obj[key])) {
          flattened[newKey] = JSON.stringify(obj[key]);
        } else {
          flattened[newKey] = obj[key];
        }
      }
    }
    
    return flattened;
  };

  const escapeCSVValue = (value: any): string => {
    if (value === null || value === undefined) {
      return '';
    }
    
    const stringValue = String(value);
    
    // If the value contains delimiter, newline, or quote, wrap it in quotes
    if (stringValue.includes(options.delimiter) || stringValue.includes('\n') || stringValue.includes('"')) {
      return `"${stringValue.replace(/"/g, '""')}"`;
    }
    
    return stringValue;
  };

  const convertJsonToCsv = () => {
    setIsConverting(true);
    setError('');
    setSuccess(false);

    try {
      if (!jsonInput.trim()) {
        throw new Error('Please enter JSON data');
      }

      const jsonData = JSON.parse(jsonInput);
      
      if (!Array.isArray(jsonData)) {
        throw new Error('JSON data must be an array of objects');
      }

      if (jsonData.length === 0) {
        throw new Error('JSON array is empty');
      }

      // Process data based on options
      let processedData = jsonData;
      if (options.flattenNested) {
        processedData = jsonData.map(item => flattenObject(item));
      }

      // Get all unique keys
      const allKeys = new Set<string>();
      processedData.forEach(item => {
        Object.keys(item).forEach(key => allKeys.add(key));
      });
      
      const headers = Array.from(allKeys);
      let csvContent = '';

      // Add headers if option is enabled
      if (options.includeHeaders) {
        csvContent += headers.map(header => escapeCSVValue(header)).join(options.delimiter) + '\n';
      }

      // Add data rows
      processedData.forEach(item => {
        const row = headers.map(header => escapeCSVValue(item[header] || ''));
        csvContent += row.join(options.delimiter) + '\n';
      });

      setCsvOutput(csvContent);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during conversion');
    } finally {
      setIsConverting(false);
    }
  };

  const generateTimestamp = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    return `${year}${month}${day}${hours}${minutes}${seconds}`;
  };

  const downloadCsv = () => {
    if (!csvOutput) return;

    const timestamp = generateTimestamp();
    const blob = new Blob([csvOutput], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `converted_data${timestamp}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setJsonInput(content);
      };
      reader.readAsText(file);
    }
  };

  const clearAll = () => {
    setJsonInput('');
    setCsvOutput('');
    setError('');
    setSuccess(false);
  };

  const sampleJson = `[
  {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "age": 30,
    "address": {
      "street": "123 Main St",
      "city": "New York",
      "country": "USA"
    }
  },
  {
    "id": 2,
    "name": "Jane Smith",
    "email": "jane@example.com",
    "age": 25,
    "address": {
      "street": "456 Oak Ave",
      "city": "Los Angeles",
      "country": "USA"
    }
  }
]`;

  return (
    <div className="max-w-7xl mx-auto">
      {/* Options Panel */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Conversion Options</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="includeHeaders"
              checked={options.includeHeaders}
              onChange={(e) => setOptions(prev => ({ ...prev, includeHeaders: e.target.checked }))}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="includeHeaders" className="text-sm font-medium text-gray-700">
              Include Headers
            </label>
          </div>
          
          <div className="flex items-center space-x-2">
            <label htmlFor="delimiter" className="text-sm font-medium text-gray-700">
              Delimiter:
            </label>
            <select
              id="delimiter"
              value={options.delimiter}
              onChange={(e) => setOptions(prev => ({ ...prev, delimiter: e.target.value }))}
              className="border border-gray-300 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value=",">Comma (,)</option>
              <option value=";">Semicolon (;)</option>
              <option value="\t">Tab</option>
              <option value="|">Pipe (|)</option>
            </select>
          </div>
          
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="flattenNested"
              checked={options.flattenNested}
              onChange={(e) => setOptions(prev => ({ ...prev, flattenNested: e.target.checked }))}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="flattenNested" className="text-sm font-medium text-gray-700">
              Flatten Nested Objects
            </label>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* JSON Input */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">JSON Input</h2>
            <div className="flex gap-2">
              <input
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload">
                <Button variant="outline" size="sm" className="cursor-pointer" asChild>
                  <span>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload File
                  </span>
                </Button>
              </label>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setJsonInput(sampleJson)}
              >
                Load Sample
              </Button>
            </div>
          </div>
          
          <textarea
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            placeholder="Paste your JSON data here or upload a file..."
            className="w-full h-96 p-4 border border-gray-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
          />
          
          <div className="flex gap-2 mt-4">
            <Button
              onClick={convertJsonToCsv}
              disabled={isConverting || !jsonInput.trim()}
              className="flex items-center gap-2"
            >
              {isConverting ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4" />
              )}
              {isConverting ? 'Converting...' : 'Convert to CSV'}
            </Button>
            
            <Button variant="outline" onClick={clearAll}>
              Clear All
            </Button>
          </div>
        </div>

        {/* CSV Output */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">CSV Output</h2>
            {csvOutput && (
              <Button onClick={downloadCsv} className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                Download CSV
              </Button>
            )}
          </div>
          
          <textarea
            value={csvOutput}
            readOnly
            placeholder="CSV output will appear here..."
            className="w-full h-96 p-4 border border-gray-300 rounded-lg font-mono text-sm bg-gray-50 resize-none"
          />
          
          {/* Status Messages */}
          {error && (
            <div className="flex items-center gap-2 mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <span className="text-red-700 text-sm">{error}</span>
            </div>
          )}
          
          {success && !error && (
            <div className="flex items-center gap-2 mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
              <span className="text-green-700 text-sm">Conversion completed successfully!</span>
            </div>
          )}
        </div>
      </div>

      {/* Usage Instructions */}
      <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">How to Use</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Step 1: Prepare Your JSON</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• JSON data must be an array of objects</li>
              <li>• Each object represents a row in the CSV</li>
              <li>• Object keys become column headers</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Step 2: Configure Options</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Choose whether to include headers</li>
              <li>• Select your preferred delimiter</li>
              <li>• Enable flattening for nested objects</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Step 3: Convert & Download</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Click &quot;Convert to CSV&quot; to process</li>
              <li>• Review the output in the right panel</li>
              <li>• Download the CSV file when ready</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Tips</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Use &quot;Load Sample&quot; to see an example</li>
              <li>• Large files may take a moment to process</li>
              <li>• Nested objects can be flattened automatically</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}