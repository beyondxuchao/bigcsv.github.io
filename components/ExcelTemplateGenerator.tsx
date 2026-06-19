/* eslint-disable react/no-unescaped-entities */
'use client';

import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Download, FileSpreadsheet, AlertCircle, CheckCircle, Grid3X3 } from 'lucide-react';

interface ExcelTemplateGeneratorProps {
  className?: string;
}

interface TemplateData {
  [key: string]: any;
}

const loadXlsx = async () => import('xlsx');
const loadJsZip = async () => import('jszip');

export function ExcelTemplateGenerator({ className = '' }: ExcelTemplateGeneratorProps) {
  const [templateFile, setTemplateFile] = useState<File | null>(null);
  const [dataFile, setDataFile] = useState<File | null>(null);
  const [templateData, setTemplateData] = useState<any>(null);
  const [dataRows, setDataRows] = useState<TemplateData[]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [generatedCount, setGeneratedCount] = useState(0);
  
  const templateInputRef = useRef<HTMLInputElement>(null);
  const dataInputRef = useRef<HTMLInputElement>(null);

  const handleTemplateUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setTemplateFile(file);
      let workbook;
      
      if (file.name.toLowerCase().endsWith('.csv')) {
        const XLSX = await loadXlsx();
        // Handle CSV files
        const text = await file.text();
        workbook = XLSX.read(text, { type: 'string' });
      } else {
        const XLSX = await loadXlsx();
        // Handle Excel files
        const arrayBuffer = await file.arrayBuffer();
        workbook = XLSX.read(arrayBuffer, { type: 'array' });
      }
      
      setTemplateData(workbook);
      setError('');
    } catch {
      setError('Failed to read template file. Please ensure it\'s a valid Excel or CSV file.');
      setTemplateFile(null);
      setTemplateData(null);
    }
  };

  const handleDataUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setDataFile(file);
      let workbook;
      const XLSX = await loadXlsx();
      
      if (file.name.toLowerCase().endsWith('.csv')) {
        // Handle CSV files
        const text = await file.text();
        workbook = XLSX.read(text, { type: 'string' });
      } else {
        // Handle Excel files
        const arrayBuffer = await file.arrayBuffer();
        workbook = XLSX.read(arrayBuffer, { type: 'array' });
      }
      
      // Get the first sheet
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      
      // Convert to JSON
      const jsonData = XLSX.utils.sheet_to_json<any[]>(worksheet, { header: 1 });
      
      if (jsonData.length < 2) {
        throw new Error('Data file must have at least a header row and one data row');
      }
      
      // Convert to objects with headers
      const headers = jsonData[0] as string[];
      const rows = jsonData.slice(1).map((row: any[]) => {
        const obj: TemplateData = {};
        headers.forEach((header, index) => {
          obj[header] = row[index] || '';
        });
        return obj;
      }).filter(row => Object.values(row).some(val => val !== ''));
      
      setDataRows(rows);
      setError('');
    } catch {
      setError('Failed to read data file. Please ensure it\'s a valid Excel or CSV file with proper headers.');
      setDataFile(null);
      setDataRows([]);
    }
  };

  const replaceTemplateVariables = (XLSX: typeof import('xlsx'), templateWorkbook: any, data: TemplateData) => {
    const newWorkbook = XLSX.utils.book_new();
    
    // Copy workbook properties
    if (templateWorkbook.Props) newWorkbook.Props = { ...templateWorkbook.Props };
    if (templateWorkbook.Custprops) newWorkbook.Custprops = { ...templateWorkbook.Custprops };
    if (templateWorkbook.Workbook) newWorkbook.Workbook = { ...templateWorkbook.Workbook };
    
    templateWorkbook.SheetNames.forEach((sheetName: string) => {
      const worksheet = templateWorkbook.Sheets[sheetName];
      const newWorksheet: any = {};
      
      // Copy all worksheet properties to preserve formatting
      Object.keys(worksheet).forEach(key => {
        if (key.startsWith('!')) {
          newWorksheet[key] = worksheet[key];
        }
      });
      
      // Process each cell while preserving all formatting
      const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');
      for (let row = range.s.r; row <= range.e.r; row++) {
        for (let col = range.s.c; col <= range.e.c; col++) {
          const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
          const cell = worksheet[cellAddress];
          
          if (cell) {
            // Deep copy the cell to preserve all properties (formatting, style, etc.)
            const newCell = { ...cell };
            
            if (cell.v !== undefined) {
              let cellValue = cell.v.toString();
              
              // Replace variables in format {{variableName}}
              Object.keys(data).forEach(key => {
                const placeholder = `{{${key}}}`;
                if (cellValue.includes(placeholder)) {
                  const replacement = data[key] !== undefined && data[key] !== null ? String(data[key]) : '';
                  cellValue = cellValue.replace(new RegExp(placeholder.replace(/[{}]/g, '\\$&'), 'g'), replacement);
                }
              });
              
              // Handle dynamic related record variables
              // Find all {{relatedX_fieldname}} patterns in the cell
              const relatedMatches = cellValue.match(/\{\{related(\d+)_([^}]+)\}\}/g);
              if (relatedMatches && data.relatedRecords) {
                relatedMatches.forEach((match: string) => {
                  const matchResult = match.match(/\{\{related(\d+)_([^}]+)\}\}/);
                  if (matchResult) {
                    const recordIndex = parseInt(matchResult[1]) - 1; // Convert to 0-based index
                    const fieldName = matchResult[2];
                    
                    if (recordIndex < data.relatedRecords.length && data.relatedRecords[recordIndex][fieldName] !== undefined) {
                      // Replace with actual data
                      const replacement = String(data.relatedRecords[recordIndex][fieldName] || '');
                      cellValue = cellValue.replace(match, replacement);
                    } else {
                      // Remove unused variable
                      cellValue = cellValue.replace(match, '');
                    }
                  }
                });
              }
              
              // Clean up any remaining unused {{related}} variables
              cellValue = cellValue.replace(/\{\{related\d+_[^}]+\}\}/g, '');
              
              // Update cell value while preserving all other properties
              newCell.v = cellValue;
              newCell.w = cellValue;
              
              // Preserve cell type if it was a number and the replacement is also a number
              if (cell.t === 'n' && !isNaN(Number(cellValue)) && cellValue !== '') {
                newCell.v = Number(cellValue);
                newCell.t = 'n';
              } else if (cellValue === '') {
                newCell.v = '';
                newCell.t = 's';
              } else {
                newCell.t = 's';
              }
            }
            
            newWorksheet[cellAddress] = newCell;
          }
        }
      }
      
      XLSX.utils.book_append_sheet(newWorkbook, newWorksheet, sheetName);
    });
    
    return newWorkbook;
  };

  const generateFiles = async () => {
    if (!templateData || dataRows.length === 0) {
      setError('Please upload both template and data files.');
      return;
    }

    setIsProcessing(true);
    setError('');
    setSuccess('');

    try {
      const XLSX = await loadXlsx();
      const JSZip = (await loadJsZip()).default;
      const zip = new JSZip();
      
      // Find the best grouping field (field with most duplicate values)
      const fieldCounts: { [field: string]: { [value: string]: number } } = {};
      
      // Count occurrences of each value for each field
      dataRows.forEach(row => {
        Object.keys(row).forEach(field => {
          if (!fieldCounts[field]) fieldCounts[field] = {};
          const value = String(row[field] || '').trim();
          if (value) {
            fieldCounts[field][value] = (fieldCounts[field][value] || 0) + 1;
          }
        });
      });
      
      // Find field with most groups (values that appear more than once)
      let bestField = '';
      let maxGroups = 0;
      
      Object.keys(fieldCounts).forEach(field => {
        const groupCount = Object.values(fieldCounts[field]).filter(count => count > 1).length;
        if (groupCount > maxGroups) {
          maxGroups = groupCount;
          bestField = field;
        }
      });
      
      // If no field has duplicates, use the first field
      if (!bestField && dataRows.length > 0) {
        bestField = Object.keys(dataRows[0])[0];
      }
      
      const groupingField = bestField;
      
      // Group data by the selected field
      const dataGroups: { [key: string]: TemplateData[] } = {};
      
      dataRows.forEach(row => {
        const groupValue = String(row[groupingField] || '').trim();
        if (groupValue) {
          if (!dataGroups[groupValue]) {
            dataGroups[groupValue] = [];
          }
          dataGroups[groupValue].push(row);
        }
      });

      let fileCount = 0;
      
      // Generate a file for each group
      Object.entries(dataGroups).forEach(([groupValue, groupMembers]) => {
        if (groupMembers.length === 0) return;
        
        // First record is the primary record (主记录)
        const primaryRecord = groupMembers[0];
        // Rest are related records (关联记录)
        const relatedRecords = groupMembers.slice(1);
        
        // Create template data with primary record and related records
        const templateVars: TemplateData = {
          ...primaryRecord, // All fields from primary record
          primaryRecord: primaryRecord,
          relatedRecords: relatedRecords,
          groupingField: groupingField,
          groupValue: groupValue,
          memberCount: groupMembers.length // Total number of members in this group
        };
        
        // Add individual related record data with indexes
        relatedRecords.forEach((record, index) => {
          const recordIndex = index + 1;
          Object.keys(record).forEach(key => {
            templateVars[`related${recordIndex}_${key}`] = record[key];
          });
        });
        
        const newWorkbook = replaceTemplateVariables(XLSX, templateData, templateVars);
        
        // Convert workbook to buffer
        const buffer = XLSX.write(newWorkbook, { type: 'array', bookType: 'xlsx' });
        
        // Create filename based on primary record name or group value
        const nameField = Object.keys(primaryRecord).find(key => 
          key.includes('姓名') || key.includes('name') || 
          key.toLowerCase().includes('name') ||
          key.includes('名字') || key.includes('标题') || key.includes('title') ||
          key.toLowerCase().includes('title')
        );
        
        const primaryName = nameField && primaryRecord[nameField] 
          ? String(primaryRecord[nameField]).replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '_')
          : groupValue.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '_');
        
        const filename = `${primaryName}_${groupValue}_generated.xlsx`;
        
        // Store in zip
        zip.file(filename, buffer);
        fileCount++;
      });
      
      if (fileCount === 0) {
        throw new Error('No files were generated. Please check your data.');
      }
      
      // Generate and download zip file
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `excel_templates_${new Date().toISOString().slice(0, 10)}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setGeneratedCount(fileCount);
      setSuccess(`Successfully generated ${fileCount} Excel files!`);
    } catch (err) {
      setError(`Error generating files: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const clearAll = () => {
    setTemplateFile(null);
    setDataFile(null);
    setTemplateData(null);
    setDataRows([]);
    setError('');
    setSuccess('');
    setGeneratedCount(0);
    if (templateInputRef.current) {
      templateInputRef.current.value = '';
    }
    if (dataInputRef.current) {
      dataInputRef.current.value = '';
    }
  };

  return (
    <div className={`max-w-7xl mx-auto ${className}`}>
      {/* Main Tool Panel */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <FileSpreadsheet className="w-8 h-8 text-green-600" />
          <h2 className="text-2xl font-bold text-gray-900">Excel Template Generator</h2>
        </div>
        
        <p className="text-gray-600 mb-4">
          Upload a template file (Excel or CSV) and a data file (Excel or CSV) to generate grouped customized files. 
          Records with the same value in any field will be automatically grouped together, with the first record as the primary record.
          Use <code className="bg-gray-100 px-2 py-1 rounded text-sm">{'{{variableName}}'}</code> in your template to mark replacement points.
          <strong className="text-blue-600"> When using Excel templates, all formatting (fonts, colors, merged cells, borders, etc.) will be preserved in the generated files.</strong>
        </p>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h4 className="font-semibold text-blue-900 mb-2">📋 Example Files</h4>
          <p className="text-blue-700 text-sm mb-3">
            Download these example files to understand the format:
          </p>
          <div className="flex flex-wrap gap-2">
            <a 
              href="/family_template_example.csv" 
              download
              className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200 transition-colors"
            >
              <Download className="w-3 h-3" />
              Template Example (CSV)
            </a>
            <a 
              href="/family_data_example.csv" 
              download
              className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded text-sm hover:bg-green-200 transition-colors"
            >
              <Download className="w-3 h-3" />
              Data Example (CSV)
            </a>
            <a 
              href="/template_example.csv" 
              download
              className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200 transition-colors"
            >
              <Download className="w-3 h-3" />
              Simple Template
            </a>
            <a 
              href="/data_example.csv" 
              download
              className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200 transition-colors"
            >
              <Download className="w-3 h-3" />
              Simple Data
            </a>
          </div>
          <p className="text-blue-600 text-xs mt-2">
            💡 Tip: Convert CSV files to Excel format (.xlsx) before uploading
          </p>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <h4 className="font-semibold text-green-900 mb-2">📊 Smart Grouping & Template Variables</h4>
          <div className="text-green-700 text-sm space-y-2">
            <p><strong>How it works:</strong> Records with the same value in any field are automatically grouped together.</p>
            <p><strong>🎨 Format Preservation:</strong> All Excel formatting (fonts, colors, merged cells, borders, number formats) will be exactly preserved in generated files.</p>
            <p><strong>Available template variables:</strong></p>
            <div className="grid md:grid-cols-2 gap-4 mt-3">
              <div>
                <p className="font-medium mb-1">Primary Record:</p>
                <ul className="text-xs space-y-1 ml-4">
                  <li>• <code className="bg-green-100 px-1 rounded">{'{{any_field_name}}'}</code> - Any field from primary record</li>
                  <li>• <code className="bg-green-100 px-1 rounded">{'{{primary_record}}'}</code> - Full primary record data</li>
                  <li>• <code className="bg-green-100 px-1 rounded">{'{{grouping_field}}'}</code> - Grouping field name</li>
                  <li>• <code className="bg-green-100 px-1 rounded">{'{{grouping_value}}'}</code> - Grouping field value</li>
                  <li>• <code className="bg-green-100 px-1 rounded">{'{{memberCount}}'}</code> - Total number of members in this group</li>
                </ul>
              </div>
              <div>
                <p className="font-medium mb-1">Related Records:</p>
                <ul className="text-xs space-y-1 ml-4">
                  <li>• <code className="bg-green-100 px-1 rounded">{'{{related1_fieldname}}'}</code> - 1st related record's field</li>
                  <li>• <code className="bg-green-100 px-1 rounded">{'{{related2_fieldname}}'}</code> - 2nd related record's field</li>
                  <li>• <code className="bg-green-100 px-1 rounded">{'{{member1_name}}'}</code> - Alternative format</li>
                  <li>• Replace "fieldname" with any column name</li>
                  <li className="text-blue-600 font-medium">• 💡 Smart handling: Use any number ({'{{related5_name}}'}, {'{{related10_email}}'}, etc.) - system will automatically fill available data and remove unused variables</li>
                  <li className="text-green-600 font-medium">• 🎯 Example: If you have 4 records but only write {'{{related3_name}}'}, the 4th record data is still accessible via {'{{related4_name}}'} dynamically</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* File Upload Section */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Template File Upload */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Template File (.xlsx, .csv)
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-green-400 transition-colors">
              <input
                ref={templateInputRef}
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleTemplateUpload}
                className="hidden"
                id="template-upload"
              />
              <label htmlFor="template-upload" className="cursor-pointer">
                <FileSpreadsheet className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">
                  {templateFile ? templateFile.name : 'Click to upload template file'}
                </p>
              </label>
            </div>
          </div>

          {/* Data File Upload */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Data File (.xlsx, .csv)
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 transition-colors">
              <input
                ref={dataInputRef}
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleDataUpload}
                className="hidden"
                id="data-upload"
              />
              <label htmlFor="data-upload" className="cursor-pointer">
                <Grid3X3 className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">
                  {dataFile ? dataFile.name : 'Click to upload data file'}
                </p>
              </label>
            </div>
          </div>
        </div>

        {/* Error and Success Messages */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <span className="text-red-700">{error}</span>
            </div>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-green-700">{success}</span>
            </div>
          </div>
        )}

        {/* File Information */}
        {(templateFile || dataFile || dataRows.length > 0) && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h4 className="font-medium text-gray-900 mb-2">File Information</h4>
            <div className="space-y-1 text-sm text-gray-600">
              {templateFile && (
                <p>📄 Template: {templateFile.name} ({(templateFile.size / 1024).toFixed(1)} KB)</p>
              )}
              {dataFile && (
                <p>📊 Data: {dataFile.name} ({(dataFile.size / 1024).toFixed(1)} KB)</p>
              )}
              {dataRows.length > 0 && (
                <p>🔢 Data rows: {dataRows.length} (will generate {dataRows.length} files)</p>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          <Button
            onClick={generateFiles}
            disabled={!templateData || dataRows.length === 0 || isProcessing}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            {isProcessing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Generating...
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Generate Files
              </>
            )}
          </Button>

          <Button
            onClick={clearAll}
            variant="outline"
            disabled={isProcessing}
          >
            Clear All
          </Button>
        </div>

        {generatedCount > 0 && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-700 text-sm">
              ✅ Successfully generated {generatedCount} files and packaged them into a ZIP file for download.
            </p>
          </div>
        )}
      </div>

      {/* How to Use Section */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">How to Use</h3>
        <div className="space-y-4 text-gray-600">
          <div className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-medium">1</span>
            <div>
              <p className="font-medium text-gray-900">Prepare Template File</p>
              <p className="text-sm">Create an Excel file with placeholders like <code className="bg-gray-100 px-1 rounded">{'{{name}}'}</code>, <code className="bg-gray-100 px-1 rounded">{'{{email}}'}</code>, etc.</p>
            </div>
          </div>
          <div className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-medium">2</span>
            <div>
              <p className="font-medium text-gray-900">Prepare Data File</p>
              <p className="text-sm">Create an Excel file with headers matching your template variables and data rows.</p>
            </div>
          </div>
          <div className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-medium">3</span>
            <div>
              <p className="font-medium text-gray-900">Upload and Generate</p>
              <p className="text-sm">Upload both files and click "Generate Files" to create customized files for each data row.</p>
            </div>
          </div>
          <div className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-medium">4</span>
            <div>
              <p className="font-medium text-gray-900">Download Results</p>
              <p className="text-sm">All generated files will be packaged into a ZIP file for easy download.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExcelTemplateGenerator;
