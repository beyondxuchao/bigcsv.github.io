import React from 'react';
import { Download, FileText, FileSpreadsheet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { stringifyDelimitedRows } from '@/lib/delimited';

interface ExportButtonProps {
  data: any[];
  columns: string[];
  filename?: string;
}

const loadXlsx = async () => import('xlsx');

export function ExportButton({ data, columns, filename = 'export' }: ExportButtonProps) {
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

  const exportToJSON = () => {
    const jsonData = JSON.stringify(data, null, 2);
    const timestamp = generateTimestamp();
    downloadFile(jsonData, `${filename}${timestamp}.json`, 'application/json');
  };

  const exportToCSV = () => {
    if (data.length === 0) return;

    const rows = [
      columns,
      ...data.map((row) => columns.map((column) => String(row[column] ?? ''))),
    ];
    const csvContent = stringifyDelimitedRows(rows, ',');
    const timestamp = generateTimestamp();
    downloadFile(csvContent, `${filename}${timestamp}.csv`, 'text/csv');
  };

  const exportToXLSX = async () => {
    if (data.length === 0) return;

    const XLSX = await loadXlsx();
    const wb = XLSX.utils.book_new();
    const wsData = [columns];

    data.forEach((row) => {
      wsData.push(columns.map((column) => row[column] || ''));
    });

    const ws = XLSX.utils.aoa_to_sheet(wsData);
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

    const timestamp = generateTimestamp();
    downloadFile(
      excelBuffer,
      `${filename}${timestamp}.xlsx`,
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
  };

  const exportToTSV = () => {
    if (data.length === 0) return;

    const rows = [
      columns,
      ...data.map((row) => columns.map((column) => String(row[column] ?? ''))),
    ];
    const tsvContent = stringifyDelimitedRows(rows, '\t');
    const timestamp = generateTimestamp();
    downloadFile(tsvContent, `${filename}${timestamp}.tsv`, 'text/tab-separated-values');
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

  return (
    <div className="flex flex-wrap gap-2">
      <Button onClick={exportToJSON} variant="outline" size="sm" className="flex items-center gap-2">
        <FileText className="h-4 w-4" />
        Export JSON
      </Button>

      <Button onClick={exportToCSV} variant="outline" size="sm" className="flex items-center gap-2">
        <Download className="h-4 w-4" />
        Export CSV
      </Button>

      <Button onClick={exportToTSV} variant="outline" size="sm" className="flex items-center gap-2">
        <FileText className="h-4 w-4" />
        Export TSV
      </Button>

      <Button onClick={exportToXLSX} variant="outline" size="sm" className="flex items-center gap-2">
        <FileSpreadsheet className="h-4 w-4" />
        Export XLSX
      </Button>
    </div>
  );
}
