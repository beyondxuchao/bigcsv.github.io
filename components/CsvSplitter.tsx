'use client';

import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import {
  Upload,
  Download,
  FileText,
  Scissors,
  AlertCircle,
  CheckCircle,
  Split,
  Grid3X3,
} from 'lucide-react';
import { parseDelimitedRows, stringifyDelimitedRows } from '@/lib/delimited';

interface CsvSplitterProps {
  className?: string;
}

interface SplitResult {
  [key: string]: string[][];
}

type SplitMode = 'column' | 'rows';

const loadJsZip = async () => import('jszip');

export function CsvSplitter({ className = '' }: CsvSplitterProps) {
  const [activeTab, setActiveTab] = useState<SplitMode>('column');
  const [csvData, setCsvData] = useState<string[][]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [selectedColumn, setSelectedColumn] = useState('');
  const [splitCount, setSplitCount] = useState(2);
  const [splitResults, setSplitResults] = useState<SplitResult>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const parseCSV = (text: string): string[][] => parseDelimitedRows(text, ',');

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.csv')) {
      setError('Please upload a CSV format file');
      return;
    }

    setError('');
    setSuccess('');
    setIsProcessing(true);

    try {
      const text = await file.text();
      const parsed = parseCSV(text);

      if (parsed.length === 0) {
        setError('CSV file is empty or format is incorrect');
        return;
      }

      const headerRow = parsed[0];
      const dataRows = parsed.slice(1);

      setCsvData([headerRow, ...dataRows]);
      setHeaders(headerRow);
      setSelectedColumn('');
      setSplitResults({});
      setSuccess(`Successfully loaded CSV file with ${dataRows.length} rows of data`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'File reading failed, please check the file format');
    } finally {
      setIsProcessing(false);
    }
  };

  const splitCSV = () => {
    if (activeTab === 'column') {
      splitByColumn();
    } else {
      splitByRows();
    }
  };

  const splitByColumn = () => {
    if (!selectedColumn || csvData.length === 0) {
      setError('Please upload a file and select a column to split first');
      return;
    }

    setIsProcessing(true);
    setError('');

    try {
      const headerRow = csvData[0];
      const dataRows = csvData.slice(1);
      const columnIndex = headerRow.indexOf(selectedColumn);

      if (columnIndex === -1) {
        setError('Selected column does not exist');
        return;
      }

      const groups: SplitResult = {};

      for (const row of dataRows) {
        const value = row[columnIndex] || 'Empty';
        if (!groups[value]) {
          groups[value] = [headerRow];
        }
        groups[value].push(row);
      }

      setSplitResults(groups);
      setSuccess(`Successfully split into ${Object.keys(groups).length} files`);
    } catch {
      setError('An error occurred during the splitting process');
    } finally {
      setIsProcessing(false);
    }
  };

  const splitByRows = () => {
    if (csvData.length === 0) {
      setError('Please upload a CSV file first');
      return;
    }

    if (splitCount < 2 || splitCount > 100) {
      setError('Split count must be between 2 and 100');
      return;
    }

    setIsProcessing(true);
    setError('');

    try {
      const headerRow = csvData[0];
      const dataRows = csvData.slice(1);
      const totalRows = dataRows.length;
      const rowsPerFile = Math.ceil(totalRows / splitCount);
      const groups: SplitResult = {};

      for (let i = 0; i < splitCount; i++) {
        const startIndex = i * rowsPerFile;
        const endIndex = Math.min(startIndex + rowsPerFile, totalRows);

        if (startIndex < totalRows) {
          groups[`part_${i + 1}`] = [headerRow, ...dataRows.slice(startIndex, endIndex)];
        }
      }

      setSplitResults(groups);
      setSuccess(`Successfully split into ${Object.keys(groups).length} files`);
    } catch {
      setError('An error occurred during the splitting process');
    } finally {
      setIsProcessing(false);
    }
  };

  const convertToCSV = (data: string[][]): string => stringifyDelimitedRows(data, ',');

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

  const downloadZip = async () => {
    if (Object.keys(splitResults).length === 0) {
      setError('No split results available for download');
      return;
    }

    setIsProcessing(true);

    try {
      const JSZip = (await loadJsZip()).default;
      const zip = new JSZip();

      Object.entries(splitResults).forEach(([value, data]) => {
        const csvContent = convertToCSV(data);
        const baseName =
          activeTab === 'column'
            ? `${selectedColumn}_${value.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '_')}`
            : value;
        zip.file(`${baseName}.csv`, csvContent);
      });

      const content = await zip.generateAsync({ type: 'blob' });
      const timestamp = generateTimestamp();
      const suffix = activeTab === 'column' ? selectedColumn || 'column' : 'rows';
      const url = URL.createObjectURL(content);
      const a = document.createElement('a');
      a.href = url;
      a.download = `csv_split_${suffix}_${timestamp}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setSuccess('ZIP file downloaded successfully!');
    } catch {
      setError('An error occurred while generating the ZIP file');
    } finally {
      setIsProcessing(false);
    }
  };

  const clearAll = () => {
    setCsvData([]);
    setHeaders([]);
    setSelectedColumn('');
    setSplitCount(2);
    setSplitResults({});
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
          <Scissors className="w-8 h-8 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">CSV Splitter Tool</h2>
        </div>

        <div className="flex border-b border-gray-200 mb-6">
          <button
            onClick={() => {
              setActiveTab('column');
              setSplitResults({});
              setError('');
              setSuccess('');
            }}
            className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'column'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Split className="w-4 h-4 inline mr-2" />
            Column Split
          </button>
          <button
            onClick={() => {
              setActiveTab('rows');
              setSplitResults({});
              setError('');
              setSuccess('');
            }}
            className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'rows'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Grid3X3 className="w-4 h-4 inline mr-2" />
            Row Split
          </button>
        </div>

        <p className="text-gray-600 mb-6">
          {activeTab === 'column'
            ? 'Upload a CSV file, select a column to split by, and divide the data into multiple files based on different values in that column.'
            : 'Upload a CSV file and split it into multiple smaller files with an even row distribution while preserving the header row.'}
        </p>

        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">1. Upload CSV File</h3>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="hidden"
              id="csv-upload"
            />
            <label htmlFor="csv-upload" className="cursor-pointer">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-700 mb-2">Click to upload CSV file</p>
              <p className="text-sm text-gray-500">Supports `.csv` format files</p>
            </label>
          </div>
        </div>

        {headers.length > 0 && activeTab === 'column' && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">2. Select Column to Split</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {headers.map((header, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedColumn(header)}
                  className={`p-3 text-left border rounded-lg transition-colors ${
                    selectedColumn === header
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  <FileText className="w-4 h-4 inline mr-2" />
                  {header}
                </button>
              ))}
            </div>
          </div>
        )}

        {headers.length > 0 && activeTab === 'rows' && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">2. Set Number of Files</h3>
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium text-gray-700">Split into:</label>
              <input
                type="number"
                min="2"
                max="100"
                value={splitCount}
                onChange={(e) => setSplitCount(parseInt(e.target.value) || 2)}
                className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <span className="text-sm text-gray-600">files</span>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Current file has {csvData.length - 1} rows and will be split into approximately{' '}
              {Math.ceil((csvData.length - 1) / splitCount)} rows per file.
            </p>
          </div>
        )}

        {csvData.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">3. Execute Split</h3>
            <div className="flex flex-wrap gap-4">
              <Button
                onClick={splitCSV}
                disabled={(activeTab === 'column' && !selectedColumn) || isProcessing}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Scissors className="w-4 h-4 mr-2" />
                {isProcessing ? 'Processing...' : activeTab === 'column' ? 'Split by Column' : 'Split by Rows'}
              </Button>

              {Object.keys(splitResults).length > 0 && (
                <Button
                  onClick={downloadZip}
                  disabled={isProcessing}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download ZIP File
                </Button>
              )}

              <Button
                onClick={clearAll}
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Clear & Reset
              </Button>
            </div>
          </div>
        )}
      </div>

      {Object.keys(splitResults).length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Split Results Preview</h3>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(splitResults).map(([value, data]) => (
                <div key={value} className="bg-white rounded-lg p-4 border">
                  <h4 className="font-medium text-gray-900 mb-2">
                    {activeTab === 'column' ? `${selectedColumn}: ${value}` : `File ${value.replace('part_', '')}`}
                  </h4>
                  <p className="text-sm text-gray-600">{data.length - 1} rows of data</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <span className="text-red-700">{error}</span>
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <span className="text-green-700">{success}</span>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Usage Instructions</h3>
        {activeTab === 'column' ? (
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium mt-0.5">1</span>
              <span>Upload a CSV file and let the tool parse the table structure</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium mt-0.5">2</span>
              <span>Select the column used as the grouping key</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium mt-0.5">3</span>
              <span>Each distinct value becomes an independent CSV file</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium mt-0.5">4</span>
              <span>Download all split files as a ZIP archive</span>
            </li>
          </ul>
        ) : (
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-medium mt-0.5">1</span>
              <span>Upload a CSV file and review the total row count</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-medium mt-0.5">2</span>
              <span>Choose how many output files to create</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-medium mt-0.5">3</span>
              <span>Each file keeps the same header structure and a fair row distribution</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-medium mt-0.5">4</span>
              <span>Download all output files as a ZIP archive</span>
            </li>
          </ul>
        )}
      </div>
    </div>
  );
}

export default CsvSplitter;
