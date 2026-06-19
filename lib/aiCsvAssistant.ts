import { detectColumnTypes } from '@/lib/columnTypeDetection';

export interface CsvColumnExample {
  name: string;
  type: string;
  nonEmptyValues: number;
  examples: string[];
  stats?: {
    min: number;
    max: number;
    avg: number;
  };
}

export interface CsvAssistantContext {
  fileName: string;
  rowCount: number;
  columnCount: number;
  columns: CsvColumnExample[];
  sampleRows: Record<string, string>[];
}

function normalizeCellValue(value: unknown): string {
  if (value === null || value === undefined) {
    return '';
  }

  return String(value);
}

function collectExamples(
  rows: Record<string, unknown>[],
  columnName: string,
  limit: number
): string[] {
  const examples: string[] = [];
  const seen = new Set<string>();

  for (const row of rows) {
    const value = normalizeCellValue(row[columnName]).trim();
    if (!value || seen.has(value)) {
      continue;
    }

    examples.push(value);
    seen.add(value);

    if (examples.length >= limit) {
      break;
    }
  }

  return examples;
}

function collectNumericStats(rows: Record<string, unknown>[], columnName: string) {
  const numericValues: number[] = [];

  for (const row of rows) {
    const rawValue = normalizeCellValue(row[columnName]).trim();
    if (!rawValue) {
      continue;
    }

    const parsed = Number(rawValue);
    if (!Number.isNaN(parsed) && Number.isFinite(parsed)) {
      numericValues.push(parsed);
    }
  }

  if (numericValues.length === 0) {
    return undefined;
  }

  const total = numericValues.reduce((sum, value) => sum + value, 0);

  return {
    min: Math.min(...numericValues),
    max: Math.max(...numericValues),
    avg: total / numericValues.length,
  };
}

export function buildCsvAssistantContext(
  fileName: string,
  rows: Record<string, unknown>[]
): CsvAssistantContext {
  const typedColumns = detectColumnTypes(rows as Record<string, string>[]);
  const sampleWindow = rows.slice(0, 250);
  const sampleRows = rows.slice(0, 8).map((row) => {
    const preview: Record<string, string> = {};

    for (const [key, value] of Object.entries(row)) {
      preview[key] = normalizeCellValue(value);
    }

    return preview;
  });

  const columns = typedColumns.map((column) => {
    const nonEmptyValues = sampleWindow.reduce((count, row) => {
      return normalizeCellValue(row[column.name]).trim() ? count + 1 : count;
    }, 0);

    return {
      name: column.name,
      type: column.type,
      nonEmptyValues,
      examples: collectExamples(sampleWindow, column.name, 4),
      stats:
        column.type === 'number'
          ? collectNumericStats(sampleWindow, column.name)
          : undefined,
    };
  });

  return {
    fileName,
    rowCount: rows.length,
    columnCount: typedColumns.length,
    columns,
    sampleRows,
  };
}
