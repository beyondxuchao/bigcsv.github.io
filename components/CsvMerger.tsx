'use client';

import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, FileText, Merge, AlertCircle, CheckCircle, X } from 'lucide-react';
import { ExportButton } from './ExportButton';
import { parseDelimitedRows } from '@/lib/delimited';

interface CsvMergerProps {
  className?: string;
}

interface FileData {
  name: string;
  headers: string[];
  data: string[][];
}

export function CsvMerger({ className = '' }: CsvMergerProps) {
  const [files, setFiles] = useState<FileData[]>([]);
  const [mergedData, setMergedData] = useState<string[][]>([]);
  const [mergedHeaders, setMergedHeaders] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const parseCSV = (content: string): { headers: string[]; data: string[][] } => {
    const rows = parseDelimitedRows(content, ',');
    if (rows.length === 0) {
      throw new Error('Empty file');
    }

    return {
      headers: rows[0],
      data: rows.slice(1),
    };
  };

  const validateHeaders = (newHeaders: string[], existingHeaders: string[]): boolean => {
    if (newHeaders.length !== existingHeaders.length) {
      return false;
    }
    return newHeaders.every((header, index) => header === existingHeaders[index]);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;

    setError('');
    setSuccess('');
    setIsProcessing(true);

    try {
      const newFiles: FileData[] = [];

      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        if (!file.name.toLowerCase().endsWith('.csv')) {
          throw new Error(`File "${file.name}" is not a CSV file`);
        }

        const content = await file.text();
        const { headers, data } = parseCSV(content);

        if (newFiles.length > 0 && !validateHeaders(headers, newFiles[0].headers)) {
          throw new Error(`File "${file.name}" has different columns.`);
        }

        if (files.length > 0 && !validateHeaders(headers, files[0].headers)) {
          throw new Error(`File "${file.name}" has different columns.`);
        }

        newFiles.push({
          name: file.name,
          headers,
          data,
        });
      }

      setFiles((prev) => [...prev, ...newFiles]);
      setSuccess(`Successfully uploaded ${newFiles.length} file(s)`);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to upload files. Ensure all CSV files have the same columns in the same order.'
      );
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setError('');
    setSuccess('');
  };

  const mergeFiles = () => {
    if (files.length === 0) {
      setError('Please upload at least one CSV file');
      return;
    }

    setIsProcessing(true);
    setError('');
    setSuccess('');

    try {
      const headers = files[0].headers;
      const allData = files.flatMap((file) => file.data);

      setMergedHeaders(headers);
      setMergedData(allData);
      setSuccess(`Successfully merged ${files.length} files with ${allData.length} total rows`);
    } catch {
      setError('Error occurred during merging process');
    } finally {
      setIsProcessing(false);
    }
  };

  const getMergedDataForExport = () => {
    if (mergedData.length === 0) return [];

    return mergedData.map((row) => {
      const obj: Record<string, string> = {};
      mergedHeaders.forEach((header, index) => {
        obj[header] = row[index] || '';
      });
      return obj;
    });
  };

  const clearAll = () => {
    setFiles([]);
    setMergedData([]);
    setMergedHeaders([]);
    setError('');
    setSuccess('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={`max-w-7xl mx-auto ${className}`}>
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Merge className="w-8 h-8 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">CSV Merger Tool</h2>
        </div>

        <p className="text-gray-600 mb-6">
          Upload multiple CSV files with the same column structure to merge them into a single file.
          All files must have identical headers in the same order.
        </p>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-yellow-800 mb-2">Important Requirements:</h3>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• All CSV files must have the same column structure</li>
                <li>• Column headers must be identical and in the same order</li>
                <li>• The merged file will contain one header row followed by all data rows</li>
                <li>• Files with different structures will be rejected</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">1. Upload CSV Files</h3>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              multiple
              onChange={handleFileUpload}
              className="hidden"
              id="csv-upload"
            />
            <label htmlFor="csv-upload" className="cursor-pointer">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-700 mb-2">Click to upload CSV files</p>
              <p className="text-sm text-gray-500">Select multiple `.csv` files with the same structure</p>
            </label>
          </div>
        </div>

        {files.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">2. Uploaded Files ({files.length})</h3>
            <div className="space-y-3">
              {files.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-gray-900">{file.name}</p>
                      <p className="text-sm text-gray-600">
                        {file.headers.length} columns, {file.data.length} rows
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={() => removeFile(index)}
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {files.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">3. Merge Files</h3>
            <div className="flex flex-wrap gap-4">
              <Button
                onClick={mergeFiles}
                disabled={isProcessing}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Merge className="w-4 h-4 mr-2" />
                {isProcessing ? 'Processing...' : 'Merge Files'}
              </Button>

              {mergedData.length > 0 && (
                <ExportButton
                  data={getMergedDataForExport()}
                  columns={mergedHeaders}
                  filename="merged_data"
                />
              )}

              <Button
                onClick={clearAll}
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Clear All
              </Button>
            </div>
          </div>
        )}
      </div>

      {mergedData.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Merge Results Preview</h3>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="mb-4">
              <p className="text-sm text-gray-600">
                <strong>Total Files:</strong> {files.length} | <strong>Total Rows:</strong> {mergedData.length}{' '}
                | <strong>Columns:</strong> {mergedHeaders.length}
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    {mergedHeaders.map((header, index) => (
                      <th key={index} className="px-3 py-2 text-left font-medium text-gray-900">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {mergedData.slice(0, 5).map((row, index) => (
                    <tr key={index} className="border-t border-gray-200">
                      {row.map((cell, cellIndex) => (
                        <td key={cellIndex} className="px-3 py-2 text-gray-700">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              {mergedData.length > 5 && (
                <p className="text-sm text-gray-500 mt-2 text-center">
                  Showing first 5 rows of {mergedData.length} total rows
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
          <p className="text-green-700">{success}</p>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Usage Instructions</h3>
        <div className="space-y-4 text-gray-600">
          <div className="flex gap-3">
            <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium mt-0.5">1</span>
            <span>Upload multiple CSV files that have the same column structure</span>
          </div>
          <div className="flex gap-3">
            <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium mt-0.5">2</span>
            <span>Ensure all files have identical headers in the same order</span>
          </div>
          <div className="flex gap-3">
            <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium mt-0.5">3</span>
            <span>Click &quot;Merge Files&quot; to combine all data into a single dataset</span>
          </div>
          <div className="flex gap-3">
            <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium mt-0.5">4</span>
            <span>Download the merged file with a single header row and all combined data</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CsvMerger;
