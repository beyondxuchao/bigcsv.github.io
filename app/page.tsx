/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { AlertTriangle, ExternalLink, X } from 'lucide-react';
import { FileUpload } from '@/components/FileUpload';
import { QueryBuilder } from '@/components/QueryBuilder';
import { DataTable } from '@/components/DataTable';
import { parseCSV } from '@/lib/csvParser';
import { StreamingCsvParser, StreamingProgress } from '@/lib/streamingCsvParser';
import { detectColumnTypes } from '@/lib/columnTypeDetection';
import { applyFilters } from '@/lib/filterOperations';
import { Column } from '@/types/column';
import { FilterGroup } from '@/types/filter';

interface EditableRow extends Record<string, any> {
  __rowId: string;
}

const emptyFilterGroup: FilterGroup = {
  filters: [],
  conjunction: 'AND',
};

const createRowId = () =>
  `${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;

const withRowIds = (rows: any[]): EditableRow[] =>
  rows.map((row) => ({
    ...row,
    __rowId: createRowId(),
  }));

const detectGarbledText = (data: any[]): boolean => {
  const replacementChar = '\uFFFD';

  for (const row of data) {
    for (const key in row) {
      const value = String(row[key] || '');
      if (value.includes(replacementChar)) {
        return true;
      }
    }
  }

  return false;
};

export default function Home() {
  const [data, setData] = useState<EditableRow[]>([]);
  const [columns, setColumns] = useState<Column[]>([]);
  const [filteredData, setFilteredData] = useState<EditableRow[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [error, setError] = useState('');
  const [hasEncodingIssue, setHasEncodingIssue] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [processingStatus, setProcessingStatus] = useState('');
  const [activeFilterGroup, setActiveFilterGroup] = useState<FilterGroup>(emptyFilterGroup);
  const [queryBuilderVersion, setQueryBuilderVersion] = useState(0);

  useEffect(() => {
    const nextFilteredData =
      activeFilterGroup.filters.length > 0 ? applyFilters(data, activeFilterGroup) : data;
    setFilteredData(nextFilteredData);
    setCurrentPage((previousPage) => {
      const nextTotalPages = Math.max(1, Math.ceil(nextFilteredData.length / pageSize));
      return Math.min(previousPage, nextTotalPages);
    });
  }, [activeFilterGroup, data, pageSize]);

  const handleFileSelect = async (file: File) => {
    try {
      setIsLoading(true);
      setLoadingProgress(0);
      setError('');
      setProcessingStatus('Initializing...');

      const fileSizeMB = file.size / (1024 * 1024);
      const useStreaming = fileSizeMB > 10;

      if (useStreaming) {
        setProcessingStatus(`Processing large file (${fileSizeMB.toFixed(1)}MB)...`);

        const result = await StreamingCsvParser.parseWithStreaming(
          file,
          (progress: StreamingProgress) => {
            setLoadingProgress(progress.percentage);
            setProcessingStatus(
              `Processing: ${progress.rowsProcessed.toLocaleString()} rows (${progress.percentage.toFixed(1)}%)`
            );
          },
          (_row: any, index: number) => {
            if (index % 10000 === 0) {
              setProcessingStatus(`Processing: ${(index + 1).toLocaleString()} rows...`);
            }
          }
        );

        setProcessingStatus('Analyzing data structure...');
        const detectedColumns = detectColumnTypes(result.data);
        const hasGarbled = detectGarbledText(result.data);
        const rowsWithIds = withRowIds(result.data);

        setHasEncodingIssue(hasGarbled);
        setData(rowsWithIds);
        setColumns(detectedColumns);
        setActiveFilterGroup(emptyFilterGroup);
        setCurrentPage(1);
        setQueryBuilderVersion((previous) => previous + 1);
        setProcessingStatus(`Completed! Processed ${result.totalRows.toLocaleString()} rows.`);
      } else {
        setProcessingStatus('Processing file...');

        const progressInterval = setInterval(() => {
          setLoadingProgress((prev) => {
            if (prev >= 80) {
              clearInterval(progressInterval);
              return prev;
            }
            return prev + Math.random() * 6 + 3;
          });
        }, 120);

        await new Promise((resolve) => setTimeout(resolve, 800));

        setLoadingProgress(85);
        setProcessingStatus('Parsing CSV data...');
        const result = await parseCSV(file);

        setLoadingProgress(95);
        setProcessingStatus('Analyzing data structure...');
        const detectedColumns = detectColumnTypes(result.data);

        setLoadingProgress(100);
        setProcessingStatus('Finalizing...');
        await new Promise((resolve) => setTimeout(resolve, 400));

        clearInterval(progressInterval);

        const hasGarbled = detectGarbledText(result.data);
        const rowsWithIds = withRowIds(result.data);
        setHasEncodingIssue(hasGarbled);
        setData(rowsWithIds);
        setColumns(detectedColumns);
        setActiveFilterGroup(emptyFilterGroup);
        setCurrentPage(1);
        setQueryBuilderVersion((previous) => previous + 1);
        setProcessingStatus(`Completed! Processed ${result.data.length.toLocaleString()} rows.`);
      }

      setTimeout(() => {
        setIsLoading(false);
        setLoadingProgress(0);
        setProcessingStatus('');
      }, 1500);
    } catch (err) {
      setIsLoading(false);
      setLoadingProgress(0);
      setProcessingStatus('');
      setHasEncodingIssue(false);
      console.error('Error parsing CSV file:', err);
      setError("Error parsing CSV file. Please ensure it's a valid CSV format.");
    }
  };

  const handleQueryChange = (filterGroup: FilterGroup) => {
    setActiveFilterGroup(filterGroup);
    setCurrentPage(1);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
  };

  const handleReset = () => {
    setData([]);
    setColumns([]);
    setFilteredData([]);
    setActiveFilterGroup(emptyFilterGroup);
    setCurrentPage(1);
    setPageSize(10);
    setError('');
    setHasEncodingIssue(false);
    setIsLoading(false);
    setLoadingProgress(0);
    setProcessingStatus('');
    setQueryBuilderVersion((previous) => previous + 1);
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

  const handleExport = async (format: string) => {
    const exportData = filteredData;
    if (exportData.length === 0) return;

    const filename = filteredData.length === data.length ? 'export_data' : 'filtered_data';
    const timestamp = generateTimestamp();
    const columnNames = columns.map((col) => col.name);

    if (format === 'json') {
      const jsonData = JSON.stringify(exportData, null, 2);
      downloadFile(jsonData, `${filename}${timestamp}.json`, 'application/json');
    } else if (format === 'csv') {
      const csvHeaders = columnNames.join(',');
      const csvRows = exportData.map((row) =>
        columnNames
          .map((column) => {
            const value = row[column] || '';
            if (
              typeof value === 'string' &&
              (value.includes(',') || value.includes('"') || value.includes('\n'))
            ) {
              return `"${value.replace(/"/g, '""')}"`;
            }
            return value;
          })
          .join(',')
      );
      const csvContent = [csvHeaders, ...csvRows].join('\n');
      downloadFile(csvContent, `${filename}${timestamp}.csv`, 'text/csv');
    } else if (format === 'tsv') {
      const tsvHeaders = columnNames.join('\t');
      const tsvRows = exportData.map((row) =>
        columnNames
          .map((column) => {
            const value = row[column] || '';
            if (typeof value === 'string' && value.includes('\t')) {
              return value.replace(/\t/g, ' ');
            }
            return value;
          })
          .join('\t')
      );
      const tsvContent = [tsvHeaders, ...tsvRows].join('\n');
      downloadFile(tsvContent, `${filename}${timestamp}.tsv`, 'text/tab-separated-values');
    } else if (format === 'xls') {
      const XLSX = await import('xlsx');
      const wb = XLSX.utils.book_new();
      const wsData = [columnNames];
      exportData.forEach((row) => {
        const rowData = columnNames.map((column) => row[column] || '');
        wsData.push(rowData);
      });
      const ws = XLSX.utils.aoa_to_sheet(wsData);
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      downloadFile(
        excelBuffer,
        `${filename}${timestamp}.xlsx`,
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      );
    }
  };

  const downloadFile = (content: string | ArrayBuffer, fileName: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const totalPages = Math.ceil(filteredData.length / pageSize);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleCellChange = (rowId: string, columnName: string, value: string) => {
    setData((previousData) =>
      previousData.map((row) =>
        row.__rowId === rowId
          ? {
              ...row,
              [columnName]: value,
            }
          : row
      )
    );
  };

  const handleHeaderRename = (currentName: string, newName: string) => {
    const trimmedName = newName.trim();

    if (!trimmedName) {
      setError('Column name cannot be empty.');
      return false;
    }

    if (trimmedName !== currentName && columns.some((column) => column.name === trimmedName)) {
      setError('Column name already exists. Please choose a unique name.');
      return false;
    }

    setError('');
    setColumns((previousColumns) =>
      previousColumns.map((column) =>
        column.name === currentName
          ? {
              ...column,
              name: trimmedName,
            }
          : column
      )
    );
    setData((previousData) =>
      previousData.map((row) => {
        const nextRow: EditableRow = { __rowId: row.__rowId };

        columns.forEach((column) => {
          const nextKey = column.name === currentName ? trimmedName : column.name;
          nextRow[nextKey] = row[column.name] ?? '';
        });

        return nextRow;
      })
    );
    setActiveFilterGroup(emptyFilterGroup);
    setCurrentPage(1);
    setQueryBuilderVersion((previous) => previous + 1);
    return true;
  };

  const handleAddRow = () => {
    const nextRow: EditableRow = { __rowId: createRowId() };
    columns.forEach((column) => {
      nextRow[column.name] = '';
    });

    setData((previousData) => [nextRow, ...previousData]);
    setCurrentPage(1);
  };

  const handleDeleteRow = (rowId: string) => {
    setData((previousData) => previousData.filter((row) => row.__rowId !== rowId));
  };

  return (
    <div>
      <div className="max-w-[1600px] mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 min-w-0">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            {hasEncodingIssue && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="text-yellow-800 font-medium mb-2">File may contain encoding issues</h3>
                    <p className="text-yellow-700 text-sm mb-3">
                      Garbled characters detected in the file. This is usually caused by the file not
                      being encoded in UTF-8. We recommend using UTF-8 encoding to re-save the file.
                    </p>
                    <Link
                      href="/tools/encoding-converter"
                      className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Go to File Encoding Converter
                    </Link>
                  </div>
                  <button
                    onClick={() => setHasEncodingIssue(false)}
                    className="text-yellow-600 hover:text-yellow-800 transition-colors p-1 rounded-md hover:bg-yellow-100"
                    title="Close this warning"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-6">
              {data.length === 0 ? (
                <>
                  <FileUpload
                    onFileSelect={handleFileSelect}
                    isLoading={isLoading}
                    loadingProgress={loadingProgress}
                    processingStatus={processingStatus}
                  />

                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <svg
                        className="w-5 h-5 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                      </svg>
                      <span className="font-semibold text-green-800">Privacy Protection</span>
                    </div>
                    <p className="text-sm text-green-700">
                      All data processing happens entirely in your browser. We do not upload, store, or
                      access any of your file data. Your privacy and data security are fully protected.
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <QueryBuilder
                    key={queryBuilderVersion}
                    columns={columns}
                    onQueryChange={handleQueryChange}
                    onExport={handleExport}
                    onReset={handleReset}
                  />

                  <div className="overflow-hidden opacity-[.98] shadow-lg hover:shadow-xl">
                    <DataTable
                      data={paginatedData}
                      columns={columns.map((col) => col.name)}
                      currentPage={currentPage}
                      totalPages={totalPages}
                      pageSize={pageSize}
                      totalItems={filteredData.length}
                      onPageChange={setCurrentPage}
                      onPageSizeChange={handlePageSizeChange}
                      onCellChange={handleCellChange}
                      onHeaderRename={handleHeaderRename}
                      onAddRow={handleAddRow}
                      onDeleteRow={handleDeleteRow}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
