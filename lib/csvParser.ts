import Papa from 'papaparse';
import { normalizeDelimitedTable } from '@/lib/delimited';

export interface ParseResult {
  data: any[];
  columns: string[];
  error?: string;
}

export async function parseCSV(file: File): Promise<ParseResult> {
  return new Promise((resolve, reject) => {
    Papa.parse<string[]>(file, {
      skipEmptyLines: 'greedy',
      complete: (results) => {
        if (results.errors.length > 0) {
          reject(new Error('Error parsing CSV file'));
          return;
        }

        const rows = (results.data || []).map((row) =>
          Array.isArray(row) ? row.map((cell) => String(cell ?? '')) : []
        );
        const normalizedTable = normalizeDelimitedTable(rows);
        resolve({
          data: normalizedTable.data,
          columns: normalizedTable.columns,
        });
      },
      error: (error) => {
        reject(error);
      },
    });
  });
}
