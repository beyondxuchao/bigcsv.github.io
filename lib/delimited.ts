import Papa from 'papaparse';

export interface ParsedDelimitedTable {
  columns: string[];
  data: Record<string, string>[];
  rows: string[][];
}

export function parseDelimitedRows(text: string, delimiter: string): string[][] {
  const result = Papa.parse<string[]>(text, {
    delimiter,
    skipEmptyLines: 'greedy',
  });

  if (result.errors.length > 0) {
    throw new Error(result.errors[0].message);
  }

  return result.data.map((row) => row.map((cell) => cell ?? ''));
}

function makeUniqueColumnName(baseName: string, seenNames: Map<string, number>): string {
  const existingCount = seenNames.get(baseName) ?? 0;
  seenNames.set(baseName, existingCount + 1);

  if (existingCount === 0) {
    return baseName;
  }

  return `${baseName}_${existingCount + 1}`;
}

export function normalizeDelimitedTable(rows: string[][]): ParsedDelimitedTable {
  if (rows.length === 0) {
    return {
      columns: [],
      data: [],
      rows: [],
    };
  }

  const maxColumnCount = rows.reduce((max, row) => Math.max(max, row.length), 0);
  const paddedRows = rows.map((row) =>
    Array.from({ length: maxColumnCount }, (_, index) => row[index] ?? '')
  );
  const headerRow = paddedRows[0];
  const seenNames = new Map<string, number>();

  const keptColumns = Array.from({ length: maxColumnCount }, (_, index) => {
    const rawHeader = headerRow[index] ?? '';
    const trimmedHeader = rawHeader.trim();
    const columnHasData = paddedRows
      .slice(1)
      .some((row) => String(row[index] ?? '').trim() !== '');

    if (!trimmedHeader && !columnHasData) {
      return null;
    }

    const baseName = trimmedHeader || `column_${index + 1}`;
    return {
      index,
      name: makeUniqueColumnName(baseName, seenNames),
    };
  }).filter((column): column is { index: number; name: string } => column !== null);

  const normalizedHeaderRow = keptColumns.map((column) => column.name);
  const normalizedDataRows = paddedRows.slice(1).map((row) =>
    keptColumns.map((column) => String(row[column.index] ?? ''))
  );
  const data = normalizedDataRows.map((row) => {
    const normalizedRow: Record<string, string> = {};

    keptColumns.forEach((column, index) => {
      normalizedRow[column.name] = row[index] ?? '';
    });

    return normalizedRow;
  });

  return {
    columns: normalizedHeaderRow,
    data,
    rows: [normalizedHeaderRow, ...normalizedDataRows],
  };
}

export function parseDelimitedObjects(
  text: string,
  delimiter: string
): { columns: string[]; data: Record<string, string>[] } {
  const normalizedTable = normalizeDelimitedTable(parseDelimitedRows(text, delimiter));
  const { columns, data } = normalizedTable;

  return { columns, data };
}

export function stringifyDelimitedRows(rows: string[][], delimiter: string): string {
  return Papa.unparse(rows, {
    delimiter,
    newline: '\n',
  });
}
