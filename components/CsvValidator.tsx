'use client';

import React, { useMemo, useState } from 'react';
import {
  AlertCircle,
  CheckCircle,
  Download,
  FileSearch,
  RefreshCw,
  ShieldCheck,
  Upload,
  WandSparkles,
} from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { parseDelimitedRows, stringifyDelimitedRows } from '@/lib/delimited';

type ValidationSeverity = 'error' | 'warning' | 'info';

interface ValidationIssue {
  id: string;
  severity: ValidationSeverity;
  title: string;
  description: string;
  details?: string;
}

interface ValidationSummary {
  totalRows: number;
  totalColumns: number;
  dataRowCount: number;
  emptyDataRowCount: number;
  inconsistentRowCount: number;
  duplicateHeaderCount: number;
  blankHeaderCount: number;
  trailingEmptyHeaderCount: number;
}

interface ValidationResult {
  fileName: string;
  summary: ValidationSummary;
  issues: ValidationIssue[];
  previewHeaders: string[];
  previewRows: string[][];
}

interface CleaningOptions {
  trimCells: boolean;
  removeEmptyRows: boolean;
  removeTrailingEmptyColumns: boolean;
  autoFillBlankHeaders: boolean;
  dedupeHeaders: boolean;
  padShortRows: boolean;
}

interface CleanedCsvData {
  headers: string[];
  rows: string[][];
}

const defaultCleaningOptions: CleaningOptions = {
  trimCells: true,
  removeEmptyRows: true,
  removeTrailingEmptyColumns: true,
  autoFillBlankHeaders: true,
  dedupeHeaders: true,
  padShortRows: true,
};

const severityStyles: Record<ValidationSeverity, string> = {
  error: 'bg-red-50 border-red-200 text-red-800',
  warning: 'bg-amber-50 border-amber-200 text-amber-800',
  info: 'bg-blue-50 border-blue-200 text-blue-800',
};

const severityLabels: Record<ValidationSeverity, string> = {
  error: 'Error',
  warning: 'Warning',
  info: 'Info',
};

function buildUniqueHeaders(headers: string[]): string[] {
  const counts = new Map<string, number>();

  return headers.map((header, index) => {
    const baseName = header.trim() || `column_${index + 1}`;
    const currentCount = counts.get(baseName) ?? 0;
    counts.set(baseName, currentCount + 1);
    return currentCount === 0 ? baseName : `${baseName}_${currentCount + 1}`;
  });
}

function analyzeRows(fileName: string, rows: string[][]): ValidationResult {
  if (rows.length === 0) {
    return {
      fileName,
      summary: {
        totalRows: 0,
        totalColumns: 0,
        dataRowCount: 0,
        emptyDataRowCount: 0,
        inconsistentRowCount: 0,
        duplicateHeaderCount: 0,
        blankHeaderCount: 0,
        trailingEmptyHeaderCount: 0,
      },
      issues: [
        {
          id: 'empty-file',
          severity: 'error',
          title: 'Empty CSV file',
          description: 'The file does not contain any rows.',
          details: 'Add a header row and at least one data row before using this file in other tools.',
        },
      ],
      previewHeaders: [],
      previewRows: [],
    };
  }

  const headerRow = rows[0].map((value) => value ?? '');
  const dataRows = rows.slice(1);
  const expectedColumnCount = headerRow.length;
  const issues: ValidationIssue[] = [];

  const blankHeaderIndexes = headerRow
    .map((header, index) => (header.trim() === '' ? index : -1))
    .filter((index) => index >= 0);

  const duplicateHeaderMap = new Map<string, number[]>();
  headerRow.forEach((header, index) => {
    const normalized = header.trim();
    if (!normalized) return;
    const existing = duplicateHeaderMap.get(normalized) ?? [];
    existing.push(index);
    duplicateHeaderMap.set(normalized, existing);
  });

  const duplicateHeaders = Array.from(duplicateHeaderMap.entries()).filter(([, indexes]) => indexes.length > 1);

  const trailingEmptyHeaderCount = (() => {
    let count = 0;
    for (let index = headerRow.length - 1; index >= 0; index -= 1) {
      if (headerRow[index].trim() !== '') {
        break;
      }
      count += 1;
    }
    return count;
  })();

  const emptyDataRows = dataRows
    .map((row, index) => ({
      rowNumber: index + 2,
      isEmpty: row.every((cell) => String(cell ?? '').trim() === ''),
    }))
    .filter((item) => item.isEmpty);

  const inconsistentRows = dataRows
    .map((row, index) => ({
      rowNumber: index + 2,
      columnCount: row.length,
    }))
    .filter((row) => row.columnCount !== expectedColumnCount);

  const trailingEmptyColumnIndexes = headerRow
    .map((header, index) => {
      if (header.trim() !== '') return -1;
      const hasData = dataRows.some((row) => String(row[index] ?? '').trim() !== '');
      return hasData ? -1 : index;
    })
    .filter((index) => index >= 0);

  if (blankHeaderIndexes.length > 0) {
    issues.push({
      id: 'blank-headers',
      severity: 'warning',
      title: 'Blank header cells detected',
      description: `${blankHeaderIndexes.length} column header${blankHeaderIndexes.length > 1 ? 's are' : ' is'} empty.`,
      details: `Empty headers found at column ${blankHeaderIndexes.map((index) => index + 1).join(', ')}.`,
    });
  }

  if (duplicateHeaders.length > 0) {
    issues.push({
      id: 'duplicate-headers',
      severity: 'error',
      title: 'Duplicate header names found',
      description: `${duplicateHeaders.length} duplicate header name${duplicateHeaders.length > 1 ? 's were' : ' was'} detected.`,
      details: duplicateHeaders
        .map(([name, indexes]) => `${name} at columns ${indexes.map((index) => index + 1).join(', ')}`)
        .join(' | '),
    });
  }

  if (trailingEmptyColumnIndexes.length > 0) {
    issues.push({
      id: 'trailing-empty-columns',
      severity: 'warning',
      title: 'Trailing empty columns detected',
      description: 'The file appears to contain unused empty columns at the end of the table.',
      details: `Likely unused columns: ${trailingEmptyColumnIndexes.map((index) => index + 1).join(', ')}.`,
    });
  }

  if (inconsistentRows.length > 0) {
    issues.push({
      id: 'inconsistent-rows',
      severity: 'error',
      title: 'Inconsistent column counts',
      description: `${inconsistentRows.length} row${inconsistentRows.length > 1 ? 's do' : ' does'} not match the header column count of ${expectedColumnCount}.`,
      details: inconsistentRows
        .slice(0, 10)
        .map((row) => `Row ${row.rowNumber}: ${row.columnCount} columns`)
        .join(' | '),
    });
  }

  if (emptyDataRows.length > 0) {
    issues.push({
      id: 'empty-data-rows',
      severity: 'info',
      title: 'Empty data rows found',
      description: `${emptyDataRows.length} fully empty row${emptyDataRows.length > 1 ? 's were' : ' was'} detected.`,
      details: `Rows: ${emptyDataRows.slice(0, 10).map((row) => row.rowNumber).join(', ')}.`,
    });
  }

  if (dataRows.length === 0) {
    issues.push({
      id: 'headers-only',
      severity: 'warning',
      title: 'Header row only',
      description: 'The file contains headers but no data rows.',
      details: 'This can be valid as a template, but there is no data to validate beyond the header row.',
    });
  }

  if (trailingEmptyHeaderCount > 0) {
    issues.push({
      id: 'blank-tail-headers',
      severity: 'info',
      title: 'Trailing blank header cells',
      description: `${trailingEmptyHeaderCount} blank header cell${trailingEmptyHeaderCount > 1 ? 's were' : ' was'} found at the end of the header row.`,
      details: 'This often comes from accidental extra commas in the first row.',
    });
  }

  if (issues.length === 0) {
    issues.push({
      id: 'valid-csv',
      severity: 'info',
      title: 'No structural issues detected',
      description: 'The CSV looks structurally valid based on header, row, and column consistency checks.',
      details: 'You can still review content-specific rules separately if needed.',
    });
  }

  return {
    fileName,
    summary: {
      totalRows: rows.length,
      totalColumns: expectedColumnCount,
      dataRowCount: dataRows.length,
      emptyDataRowCount: emptyDataRows.length,
      inconsistentRowCount: inconsistentRows.length,
      duplicateHeaderCount: duplicateHeaders.length,
      blankHeaderCount: blankHeaderIndexes.length,
      trailingEmptyHeaderCount,
    },
    issues,
    previewHeaders: headerRow,
    previewRows: dataRows.slice(0, 5),
  };
}

function cleanCsvRows(rows: string[][], options: CleaningOptions): CleanedCsvData {
  if (rows.length === 0) {
    return { headers: [], rows: [] };
  }

  let workingRows = rows.map((row) =>
    row.map((cell) => {
      const normalized = String(cell ?? '');
      return options.trimCells ? normalized.trim() : normalized;
    })
  );

  if (options.removeEmptyRows) {
    workingRows = [
      workingRows[0],
      ...workingRows.slice(1).filter((row) => row.some((cell) => cell.trim() !== '')),
    ];
  }

  const maxColumnCount = workingRows.reduce((max, row) => Math.max(max, row.length), 0);
  workingRows = workingRows.map((row) => {
    if (!options.padShortRows) {
      return [...row];
    }

    return Array.from({ length: maxColumnCount }, (_, index) => row[index] ?? '');
  });

  let headers = [...workingRows[0]];
  let dataRows = workingRows.slice(1);

  if (options.removeTrailingEmptyColumns) {
    const keepIndexes = workingRows[0]
      .map((header, index) => {
        const hasHeader = String(header ?? '').trim() !== '';
        const hasData = workingRows.slice(1).some((row) => String(row[index] ?? '').trim() !== '');
        return hasHeader || hasData;
      });

    headers = workingRows[0].filter((_, index) => keepIndexes[index]);
    dataRows = workingRows.slice(1).map((row) => keepIndexes.map((keep, index) => (keep ? row[index] ?? '' : null)).filter((cell): cell is string => cell !== null));
  } else {
    headers = [...workingRows[0]];
    dataRows = workingRows.slice(1).map((row) => {
      const paddedLength = Math.max(headers.length, row.length);
      return Array.from({ length: paddedLength }, (_, index) => row[index] ?? '');
    });
    headers = Array.from({ length: Math.max(headers.length, ...dataRows.map((row) => row.length), 0) }, (_, index) => headers[index] ?? '');
    dataRows = dataRows.map((row) => Array.from({ length: headers.length }, (_, index) => row[index] ?? ''));
  }

  if (options.autoFillBlankHeaders) {
    headers = headers.map((header, index) => header.trim() || `column_${index + 1}`);
  }

  if (options.dedupeHeaders) {
    headers = buildUniqueHeaders(headers);
  }

  return {
    headers,
    rows: dataRows,
  };
}

function downloadCsvFile(fileName: string, headers: string[], rows: string[][]) {
  const csv = stringifyDelimitedRows([headers, ...rows], ',');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function CsvValidator() {
  const [result, setResult] = useState<ValidationResult | null>(null);
  const [rawRows, setRawRows] = useState<string[][]>([]);
  const [sourceFileName, setSourceFileName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [cleaningOptions, setCleaningOptions] = useState<CleaningOptions>(defaultCleaningOptions);

  const summaryCards = useMemo(() => {
    if (!result) return [];

    return [
      { label: 'Rows', value: result.summary.totalRows },
      { label: 'Columns', value: result.summary.totalColumns },
      { label: 'Errors', value: result.issues.filter((issue) => issue.severity === 'error').length },
      { label: 'Warnings', value: result.issues.filter((issue) => issue.severity === 'warning').length },
    ];
  }, [result]);

  const cleanedData = useMemo(() => {
    if (rawRows.length === 0) {
      return null;
    }

    return cleanCsvRows(rawRows, cleaningOptions);
  }, [cleaningOptions, rawRows]);

  const cleanedPreviewRows = cleanedData?.rows.slice(0, 5) ?? [];

  const processFile = async (file: File) => {
    setIsLoading(true);
    setError('');
    setResult(null);
    setRawRows([]);
    setSourceFileName('');

    try {
      if (!file.name.toLowerCase().endsWith('.csv')) {
        throw new Error('Please upload a CSV file.');
      }

      const content = await file.text();
      const parsedRows = parseDelimitedRows(content, ',');
      const validationResult = analyzeRows(file.name, parsedRows);

      setRawRows(parsedRows);
      setResult(validationResult);
      setSourceFileName(file.name.replace(/\.csv$/i, ''));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to validate CSV file.');
    } finally {
      setIsLoading(false);
    }
  };

  const onDrop = async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    await processFile(file);
  };

  const onDropRejected = () => {
    setError('Please upload a valid CSV file.');
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDropRejected,
    multiple: false,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.ms-excel': ['.csv'],
      'text/plain': ['.csv'],
    },
    disabled: isLoading,
    validator: (file) => {
      if (!file.name.toLowerCase().endsWith('.csv')) {
        return {
          code: 'file-invalid-type',
          message: 'Please upload a valid CSV file.',
        };
      }

      return null;
    },
  });

  const resetValidator = () => {
    setResult(null);
    setRawRows([]);
    setSourceFileName('');
    setError('');
    setIsLoading(false);
    setCleaningOptions(defaultCleaningOptions);
  };

  const toggleCleaningOption = (key: keyof CleaningOptions) => {
    setCleaningOptions((current) => ({
      ...current,
      [key]: !current[key],
    }));
  };

  const handleDownloadCleanedCsv = () => {
    if (!cleanedData) return;
    downloadCsvFile(`${sourceFileName || 'cleaned'}_cleaned.csv`, cleanedData.headers, cleanedData.rows);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <ShieldCheck className="w-8 h-8 text-blue-600" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">CSV Validator</h2>
            <p className="text-gray-600 mt-1">
              Validate CSV structure before importing, converting, or sharing your data.
            </p>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <FileSearch className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-800 space-y-1">
              <p>Checks include duplicate headers, blank headers, inconsistent row lengths, empty rows, and trailing empty columns.</p>
              <p>Custom cleaning options let you repair common CSV issues and download a cleaned version immediately.</p>
            </div>
          </div>
        </div>

        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isLoading
              ? 'border-blue-300 bg-blue-50 cursor-default'
              : isDragActive
                ? 'border-blue-500 bg-blue-50 cursor-pointer'
                : 'border-gray-300 hover:border-blue-400 cursor-pointer'
          }`}
        >
          <input {...getInputProps()} />
          <div>
            {isLoading ? (
              <>
                <RefreshCw className="w-12 h-12 text-blue-600 mx-auto mb-4 animate-spin" />
                <p className="text-lg font-medium text-gray-800">Validating CSV file...</p>
              </>
            ) : (
              <>
                <Upload className={`w-12 h-12 mx-auto mb-4 ${isDragActive ? 'text-blue-500' : 'text-gray-400'}`} />
                <p className="text-lg font-medium text-gray-800">
                  {isDragActive ? 'Drop your CSV file here' : 'Upload CSV File'}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Drag and drop a `.csv` file here, or click to choose one for validation and cleaning
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {result && (
        <>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{result.fileName}</h3>
                <p className="text-sm text-gray-600 mt-1">
                  {result.summary.dataRowCount} data rows • {result.summary.totalColumns} columns
                </p>
              </div>
              <Button onClick={resetValidator} variant="outline">
                <RefreshCw className="w-4 h-4 mr-2" />
                Validate Another File
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {summaryCards.map((card) => (
                <div key={card.label} className="rounded-lg border border-gray-200 p-4">
                  <div className="text-sm text-gray-500">{card.label}</div>
                  <div className="text-2xl font-bold text-gray-900 mt-1">{card.value}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Validation Results</h3>
            <div className="space-y-4">
              {result.issues.map((issue) => (
                <div
                  key={issue.id}
                  className={`border rounded-lg p-4 ${severityStyles[issue.severity]}`}
                >
                  <div className="flex items-start gap-3">
                    {issue.severity === 'info' ? (
                      <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                    ) : (
                      <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                    )}
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold uppercase tracking-wide">
                          {severityLabels[issue.severity]}
                        </span>
                        <h4 className="font-semibold">{issue.title}</h4>
                      </div>
                      <p className="text-sm">{issue.description}</p>
                      {issue.details ? <p className="text-sm mt-2 opacity-90">{issue.details}</p> : null}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <WandSparkles className="w-6 h-6 text-emerald-600" />
              <h3 className="text-xl font-semibold text-gray-900">Cleaning Options</h3>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <label className="flex items-start gap-3 rounded-lg border border-gray-200 p-4">
                <input
                  type="checkbox"
                  checked={cleaningOptions.trimCells}
                  onChange={() => toggleCleaningOption('trimCells')}
                  className="mt-1"
                />
                <div>
                  <div className="font-medium text-gray-900">Trim spaces in every cell</div>
                  <div className="text-sm text-gray-600">Remove leading and trailing whitespace from headers and data.</div>
                </div>
              </label>

              <label className="flex items-start gap-3 rounded-lg border border-gray-200 p-4">
                <input
                  type="checkbox"
                  checked={cleaningOptions.removeEmptyRows}
                  onChange={() => toggleCleaningOption('removeEmptyRows')}
                  className="mt-1"
                />
                <div>
                  <div className="font-medium text-gray-900">Remove fully empty rows</div>
                  <div className="text-sm text-gray-600">Drop rows where every cell is empty.</div>
                </div>
              </label>

              <label className="flex items-start gap-3 rounded-lg border border-gray-200 p-4">
                <input
                  type="checkbox"
                  checked={cleaningOptions.removeTrailingEmptyColumns}
                  onChange={() => toggleCleaningOption('removeTrailingEmptyColumns')}
                  className="mt-1"
                />
                <div>
                  <div className="font-medium text-gray-900">Remove trailing empty columns</div>
                  <div className="text-sm text-gray-600">Useful when accidental extra commas create empty tail columns.</div>
                </div>
              </label>

              <label className="flex items-start gap-3 rounded-lg border border-gray-200 p-4">
                <input
                  type="checkbox"
                  checked={cleaningOptions.autoFillBlankHeaders}
                  onChange={() => toggleCleaningOption('autoFillBlankHeaders')}
                  className="mt-1"
                />
                <div>
                  <div className="font-medium text-gray-900">Auto-fill blank headers</div>
                  <div className="text-sm text-gray-600">Generate names like `column_3` for empty header cells.</div>
                </div>
              </label>

              <label className="flex items-start gap-3 rounded-lg border border-gray-200 p-4">
                <input
                  type="checkbox"
                  checked={cleaningOptions.dedupeHeaders}
                  onChange={() => toggleCleaningOption('dedupeHeaders')}
                  className="mt-1"
                />
                <div>
                  <div className="font-medium text-gray-900">Make duplicate headers unique</div>
                  <div className="text-sm text-gray-600">Rename duplicates like `name_2`, `name_3` automatically.</div>
                </div>
              </label>

              <label className="flex items-start gap-3 rounded-lg border border-gray-200 p-4">
                <input
                  type="checkbox"
                  checked={cleaningOptions.padShortRows}
                  onChange={() => toggleCleaningOption('padShortRows')}
                  className="mt-1"
                />
                <div>
                  <div className="font-medium text-gray-900">Pad short rows to header length</div>
                  <div className="text-sm text-gray-600">Fill missing cells with empty values so row lengths stay consistent.</div>
                </div>
              </label>
            </div>
          </div>

          {cleanedData && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Cleaned Preview</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {cleanedData.rows.length} cleaned data rows • {cleanedData.headers.length} cleaned columns
                  </p>
                </div>
                <Button onClick={handleDownloadCleanedCsv}>
                  <Download className="w-4 h-4 mr-2" />
                  Download Cleaned CSV
                </Button>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full text-sm border border-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {cleanedData.headers.map((header, index) => (
                        <th
                          key={`${header}-${index}`}
                          className="px-3 py-2 text-left border-b border-gray-200 font-medium text-gray-900"
                        >
                          {header || <span className="text-red-500">(blank)</span>}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {cleanedPreviewRows.length > 0 ? (
                      cleanedPreviewRows.map((row, rowIndex) => (
                        <tr key={rowIndex} className="border-t border-gray-200">
                          {cleanedData.headers.map((_, cellIndex) => (
                            <td key={cellIndex} className="px-3 py-2 text-gray-700 align-top">
                              {row[cellIndex] || ''}
                            </td>
                          ))}
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={Math.max(cleanedData.headers.length, 1)}
                          className="px-3 py-6 text-center text-gray-500"
                        >
                          No data rows to preview after cleaning.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Original Preview</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm border border-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {result.previewHeaders.map((header, index) => (
                      <th
                        key={`${header}-${index}`}
                        className="px-3 py-2 text-left border-b border-gray-200 font-medium text-gray-900"
                      >
                        {header || <span className="text-red-500">(blank)</span>}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {result.previewRows.length > 0 ? (
                    result.previewRows.map((row, rowIndex) => (
                      <tr key={rowIndex} className="border-t border-gray-200">
                        {result.previewHeaders.map((_, cellIndex) => (
                          <td key={cellIndex} className="px-3 py-2 text-gray-700 align-top">
                            {row[cellIndex] || ''}
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={Math.max(result.previewHeaders.length, 1)}
                        className="px-3 py-6 text-center text-gray-500"
                      >
                        No data rows to preview.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">What This Validator Checks</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
              <div className="rounded-lg border border-gray-200 p-4">
                <div className="font-semibold text-gray-900 mb-2">Structural Checks</div>
                <ul className="space-y-1">
                  <li>• Duplicate column names</li>
                  <li>• Blank header cells</li>
                  <li>• Rows with too many or too few columns</li>
                </ul>
              </div>
              <div className="rounded-lg border border-gray-200 p-4">
                <div className="font-semibold text-gray-900 mb-2">Cleanup Signals</div>
                <ul className="space-y-1">
                  <li>• Fully empty rows</li>
                  <li>• Trailing empty columns</li>
                  <li>• Header-only template files</li>
                </ul>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default CsvValidator;
