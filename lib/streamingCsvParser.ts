import Papa from 'papaparse';
import { normalizeDelimitedTable } from '@/lib/delimited';

export interface StreamingParseResult {
  data: any[];
  columns: string[];
  totalRows: number;
  error?: string;
}

export interface StreamingProgress {
  bytesLoaded: number;
  totalBytes: number;
  rowsProcessed: number;
  percentage: number;
}

export class StreamingCsvParser {
  private onProgress?: (progress: StreamingProgress) => void;
  private onRowProcessed?: (row: any, index: number) => void;
  private batchSize: number = 1000; // Process in batches of 1000 rows
  private processedRows: any[] = [];
  private totalBytes: number = 0;
  private bytesLoaded: number = 0;
  private rowsProcessed: number = 0;
  private columns: string[] = [];
  private rawHeaders: string[] = [];

  constructor(options?: {
    onProgress?: (progress: StreamingProgress) => void;
    onRowProcessed?: (row: any, index: number) => void;
    batchSize?: number;
  }) {
    this.onProgress = options?.onProgress;
    this.onRowProcessed = options?.onRowProcessed;
    this.batchSize = options?.batchSize || 1000;
  }

  async parseFile(file: File): Promise<StreamingParseResult> {
    this.totalBytes = file.size;
    this.bytesLoaded = 0;
    this.rowsProcessed = 0;
    this.processedRows = [];
    this.columns = [];
    this.rawHeaders = [];

    return new Promise((resolve, reject) => {
      // Use PapaParse with streaming for large files
      const parseConfig: Papa.ParseConfig<string[]> = {
        skipEmptyLines: 'greedy',
        step: (results: Papa.ParseStepResult<string[]>) => {
          // Process each row as it's parsed
          if (results.errors.length > 0) {
            console.warn('Row parsing errors:', results.errors);
            return;
          }

          const row = Array.isArray(results.data)
            ? results.data.map((cell) => String(cell ?? ''))
            : [];

          if (this.rawHeaders.length === 0) {
            this.rawHeaders = row;
            const normalizedHeader = normalizeDelimitedTable([row]);
            this.columns = normalizedHeader.columns;
            return;
          }

          const normalizedRowResult = normalizeDelimitedTable([this.rawHeaders, row]);
          const normalizedRow = normalizedRowResult.data[0];

          if (normalizedRow) {
            this.columns = normalizedRowResult.columns;
            this.processedRows.push(normalizedRow);
            this.rowsProcessed++;

            if (this.onRowProcessed) {
              this.onRowProcessed(normalizedRow, this.rowsProcessed - 1);
            }

            this.bytesLoaded = Math.min(
              this.totalBytes,
              (this.rowsProcessed / 1000) * (this.totalBytes / 100)
            );

            if (this.rowsProcessed % 100 === 0 && this.onProgress) {
              this.onProgress({
                bytesLoaded: this.bytesLoaded,
                totalBytes: this.totalBytes,
                rowsProcessed: this.rowsProcessed,
                percentage: Math.min(95, (this.bytesLoaded / this.totalBytes) * 100)
              });
            }
          }
        },
        complete: () => {
          // Final progress update
          if (this.onProgress) {
            this.onProgress({
              bytesLoaded: this.totalBytes,
              totalBytes: this.totalBytes,
              rowsProcessed: this.rowsProcessed,
              percentage: 100
            });
          }

          resolve({
            data: this.processedRows,
            columns: this.columns,
            totalRows: this.rowsProcessed,
          });
        },
        // Additional config for better performance
        fastMode: true,
        preview: 0, // Parse all rows
        dynamicTyping: false, // Keep as strings for better performance
      };

      try {
        Papa.parse(file as any, parseConfig);
      } catch (error) {
        reject(new Error(`CSV parsing error: ${error instanceof Error ? error.message : 'Unknown error'}`));
      }
    });
  }

  // Method to parse with chunked processing for extremely large files
  async parseFileChunked(file: File, chunkSize: number = 1024 * 1024): Promise<StreamingParseResult> {
    this.totalBytes = file.size;
    this.bytesLoaded = 0;
    this.rowsProcessed = 0;
    this.processedRows = [];
    this.columns = [];
    this.rawHeaders = [];

    return new Promise(async (resolve, reject) => {
      try {
        let offset = 0;
        let remainingData = '';
        let isFirstChunk = true;

        while (offset < file.size) {
          const chunk = file.slice(offset, offset + chunkSize);
          const chunkText = await this.readChunkAsText(chunk);
          
          // Combine with remaining data from previous chunk
          const fullText = remainingData + chunkText;
          const lines = fullText.split('\n');
          
          // Keep the last incomplete line for next chunk
          remainingData = lines.pop() || '';
          
          // Process complete lines
          for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;

            if (isFirstChunk && i === 0) {
              // First line is header
              this.rawHeaders = this.parseCSVLine(line);
              this.columns = normalizeDelimitedTable([this.rawHeaders]).columns;
              isFirstChunk = false;
              continue;
            }

            const rowData = this.parseCSVLine(line);
            if (this.rawHeaders.length > 0) {
              const normalizedRowResult = normalizeDelimitedTable([this.rawHeaders, rowData]);
              const rowObject = normalizedRowResult.data[0];

              if (!rowObject) {
                continue;
              }

              this.columns = normalizedRowResult.columns;
              this.processedRows.push(rowObject);
              this.rowsProcessed++;

              if (this.onRowProcessed) {
                this.onRowProcessed(rowObject, this.rowsProcessed - 1);
              }
            }
          }

          this.bytesLoaded = offset + chunkSize;
          offset += chunkSize;

          // Report progress
          if (this.onProgress) {
            this.onProgress({
              bytesLoaded: Math.min(this.bytesLoaded, this.totalBytes),
              totalBytes: this.totalBytes,
              rowsProcessed: this.rowsProcessed,
              percentage: Math.min(100, (this.bytesLoaded / this.totalBytes) * 100)
            });
          }

          // Allow UI to update
          await new Promise(resolve => setTimeout(resolve, 0));
        }

        // Process remaining data
        if (remainingData.trim()) {
          const rowData = this.parseCSVLine(remainingData.trim());
          if (this.rawHeaders.length > 0) {
            const normalizedRowResult = normalizeDelimitedTable([this.rawHeaders, rowData]);
            const rowObject = normalizedRowResult.data[0];

            if (rowObject) {
              this.columns = normalizedRowResult.columns;
              this.processedRows.push(rowObject);
              this.rowsProcessed++;
            }
          }
        }

        resolve({
          data: this.processedRows,
          columns: this.columns,
          totalRows: this.rowsProcessed,
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  private readChunkAsText(chunk: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(reader.error);
      reader.readAsText(chunk, 'utf-8');
    });
  }

  private parseCSVLine(line: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          // Escaped quote
          current += '"';
          i++; // Skip next quote
        } else {
          // Toggle quote state
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        // Field separator
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    
    // Add the last field
    result.push(current.trim());
    return result;
  }

  // Static method for simple streaming parse
  static async parseWithStreaming(
    file: File,
    onProgress?: (progress: StreamingProgress) => void,
    onRowProcessed?: (row: any, index: number) => void
  ): Promise<StreamingParseResult> {
    const parser = new StreamingCsvParser({
      onProgress,
      onRowProcessed,
    });

    // Use chunked processing for very large files (>100MB)
    if (file.size > 100 * 1024 * 1024) {
      return parser.parseFileChunked(file);
    } else {
      return parser.parseFile(file);
    }
  }
}

// Export the original parseCSV function for backward compatibility
export async function parseCSV(file: File): Promise<{ data: any[]; columns: string[]; error?: string }> {
  try {
    const result = await StreamingCsvParser.parseWithStreaming(file);
    return {
      data: result.data,
      columns: result.columns,
    };
  } catch (error) {
    return {
      data: [],
      columns: [],
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
