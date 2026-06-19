'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Upload, RefreshCw, AlertCircle, CheckCircle, FileText, Loader2 } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { normalizeDelimitedTable, parseDelimitedRows, stringifyDelimitedRows } from '@/lib/delimited';

type SupportedFormat = 'json' | 'csv' | 'tsv' | 'xls' | 'xml';
type SupportedTextEncoding = 'utf-8' | 'gbk' | 'big5' | 'shift-jis' | 'iso-8859-1';

interface ConversionOption {
  format: SupportedFormat;
  label: string;
  description: string;
}

interface FormatConverterProps {
  defaultFromFormat?: SupportedFormat;
  defaultToFormat?: SupportedFormat;
  allowedFormats?: SupportedFormat[];
}

interface DropzoneRejection {
  errors: readonly {
    code?: string;
    message?: string;
  }[];
}

const formatDisplayLabels: Record<SupportedFormat, string> = {
  json: 'JSON',
  csv: 'CSV',
  tsv: 'TSV',
  xls: 'XLSX',
  xml: 'XML',
};

const loadXlsx = async () => import('xlsx');

const ensureBufferPolyfill = async () => {
  if (typeof window === 'undefined' || (window as any).Buffer) {
    return;
  }

  const { Buffer } = await import('buffer');
  (window as any).Buffer = Buffer;
};

const normalizeDetectedEncoding = (encoding: string | undefined | null): SupportedTextEncoding => {
  if (!encoding) {
    return 'utf-8';
  }

  const normalized = encoding.toLowerCase();

  if (normalized === 'gb2312' || normalized === 'gbk' || normalized === 'gb18030') {
    return 'gbk';
  }

  if (normalized === 'big5') {
    return 'big5';
  }

  if (normalized === 'shift_jis' || normalized === 'shift-jis' || normalized === 'sjis') {
    return 'shift-jis';
  }

  if (normalized === 'iso-8859-1' || normalized === 'windows-1252') {
    return 'iso-8859-1';
  }

  return 'utf-8';
};

const detectTextEncoding = async (buffer: ArrayBuffer): Promise<SupportedTextEncoding> => {
  await ensureBufferPolyfill();
  const jschardet = await import('jschardet');
  const binaryString = Array.from(new Uint8Array(buffer))
    .map((byte) => String.fromCharCode(byte))
    .join('');

  const result = jschardet.default.detect(binaryString);
  if (!result || result.confidence <= 0.5) {
    return 'utf-8';
  }

  return normalizeDetectedEncoding(result.encoding);
};

const decodeTextFile = async (file: File): Promise<string> => {
  const buffer = await file.arrayBuffer();
  const encoding = await detectTextEncoding(buffer);

  try {
    return new TextDecoder(encoding).decode(buffer);
  } catch {
    return new TextDecoder('utf-8', { fatal: false }).decode(buffer);
  }
};

const getElementChildren = (element: Element): Element[] => Array.from(element.children);

const getDirectTextContent = (element: Element): string =>
  Array.from(element.childNodes)
    .filter((node) => node.nodeType === Node.TEXT_NODE)
    .map((node) => node.textContent ?? '')
    .join('')
    .trim();

const sanitizeXmlTagName = (name: string, fallback: string): string => {
  const replaced = name.trim().replace(/[^\w.-]+/g, '_').replace(/_+/g, '_');
  const normalized = replaced.replace(/^[^A-Za-z_]+/, '');
  return normalized || fallback;
};

const normalizeXmlFieldName = (name: string, fallback = 'field'): string => {
  const sanitized = sanitizeXmlTagName(name, fallback);
  return /^_+$/.test(sanitized) ? fallback : sanitized;
};

const escapeXml = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

const flattenXmlElement = (element: Element, prefix = ''): Record<string, string> => {
  const flattened: Record<string, string> = {};
  const keyPrefix = prefix ? `${prefix}.` : '';

  Array.from(element.attributes).forEach((attribute) => {
    flattened[`${keyPrefix}@${attribute.name}`] = attribute.value;
  });

  const children = getElementChildren(element);
  if (children.length === 0) {
    const textContent = getDirectTextContent(element);
    if (prefix) {
      flattened[prefix] = textContent;
    } else if (textContent) {
      flattened[normalizeXmlFieldName(element.tagName, 'value')] = textContent;
    }
    return flattened;
  }

  const groupedChildren = new Map<string, Element[]>();
  children.forEach((child) => {
    const group = groupedChildren.get(child.tagName) ?? [];
    group.push(child);
    groupedChildren.set(child.tagName, group);
  });

  groupedChildren.forEach((group, tagName) => {
    const normalizedTagName = normalizeXmlFieldName(tagName, 'field');
    const childKey = prefix ? `${prefix}.${normalizedTagName}` : normalizedTagName;
    const allLeafNodes = group.every(
      (child) => getElementChildren(child).length === 0 && child.attributes.length === 0
    );

    if (group.length > 1 && allLeafNodes) {
      group.forEach((child, index) => {
        flattened[`${childKey}_${index + 1}`] = getDirectTextContent(child);
      });
      return;
    }

    if (group.length > 1) {
      group.forEach((child, index) => {
        Object.assign(flattened, flattenXmlElement(child, `${childKey}_${index + 1}`));
      });
      return;
    }

    Object.assign(flattened, flattenXmlElement(group[0], childKey));
  });

  const directText = getDirectTextContent(element);
  if (directText && prefix) {
    flattened[`${prefix}.#text`] = directText;
  }

  return flattened;
};

const scoreXmlRecordGroup = (group: Element[]): number => {
  if (group.length === 0) {
    return -1;
  }

  const flattenedSamples = group.slice(0, 5).map((element) => flattenXmlElement(element));
  const averageFieldCount =
    flattenedSamples.reduce((sum, record) => sum + Object.keys(record).length, 0) / flattenedSamples.length;
  const childCountAverage =
    group.reduce((sum, element) => sum + getElementChildren(element).length, 0) / group.length;

  return averageFieldCount * 100 + childCountAverage * 10 + group.length;
};

interface XmlRecordCandidate {
  key: string;
  label: string;
  score: number;
  elements: Element[];
}

const collectXmlRecordCandidates = (xmlDocument: Document): XmlRecordCandidate[] => {
  const root = xmlDocument.documentElement;
  const candidates = new Map<string, XmlRecordCandidate>();

  const visit = (element: Element) => {
    const children = getElementChildren(element);
    if (children.length > 1) {
      const groupedChildren = new Map<string, Element[]>();
      children.forEach((child) => {
        const group = groupedChildren.get(child.tagName) ?? [];
        group.push(child);
        groupedChildren.set(child.tagName, group);
      });

      groupedChildren.forEach((group) => {
        const score = scoreXmlRecordGroup(group);
        const pathKey = `${group[0].parentElement?.tagName || 'root'}>${group[0].tagName}`;
        const current = candidates.get(pathKey);

        if (!current || score > current.score) {
          candidates.set(pathKey, {
            key: pathKey,
            label: `${group[0].tagName} (${group.length} items)`,
            score,
            elements: group,
          });
        }
      });
    }

    children.forEach(visit);
  };

  visit(root);

  const sortedCandidates = Array.from(candidates.values()).sort((a, b) => b.score - a.score);
  if (sortedCandidates.length > 0) {
    return sortedCandidates;
  }

  const rootChildren = getElementChildren(root);
  return rootChildren.length > 0
    ? [
        {
          key: `${root.tagName}>${rootChildren[0].tagName}`,
          label: `${rootChildren[0].tagName} (${rootChildren.length} items)`,
          score: scoreXmlRecordGroup(rootChildren),
          elements: rootChildren,
        },
      ]
    : [
        {
          key: root.tagName,
          label: `${root.tagName} (1 item)`,
          score: scoreXmlRecordGroup([root]),
          elements: [root],
        },
      ];
};

const parseXmlRecords = (
  xmlText: string,
  selectedCandidateKey?: string
): { candidates: XmlRecordCandidate[]; data: Record<string, string>[] } => {
  const parser = new DOMParser();
  const xmlDocument = parser.parseFromString(xmlText, 'application/xml');
  const parseError = xmlDocument.querySelector('parsererror');

  if (parseError) {
    throw new Error('Invalid XML format. Please upload a valid XML file.');
  }

  const candidates = collectXmlRecordCandidates(xmlDocument);
  const selectedCandidate =
    candidates.find((candidate) => candidate.key === selectedCandidateKey) ?? candidates[0];

  return {
    candidates,
    data: selectedCandidate.elements
    .map((element) => flattenXmlElement(element))
    .filter((record) => Object.keys(record).length > 0),
  };
};

const buildXmlNode = (
  tagName: string,
  value: unknown,
  indentLevel: number,
  skipEmptyFields: boolean
): string => {
  const indent = '  '.repeat(indentLevel);
  const safeTagName = sanitizeXmlTagName(tagName, 'field');

  if (value === null || value === undefined || value === '') {
    return skipEmptyFields ? '' : `${indent}<${safeTagName}></${safeTagName}>`;
  }

  if (Array.isArray(value)) {
    const children = value
      .map((item) => buildXmlNode('item', item, indentLevel + 1, skipEmptyFields))
      .filter(Boolean)
      .join('\n');
    return children
      ? `${indent}<${safeTagName}>\n${children}\n${indent}</${safeTagName}>`
      : skipEmptyFields
        ? ''
        : `${indent}<${safeTagName}></${safeTagName}>`;
  }

  if (typeof value === 'object') {
    const children = Object.entries(value as Record<string, unknown>)
      .map(([key, childValue]) => buildXmlNode(key, childValue, indentLevel + 1, skipEmptyFields))
      .filter(Boolean)
      .join('\n');
    return children
      ? `${indent}<${safeTagName}>\n${children}\n${indent}</${safeTagName}>`
      : skipEmptyFields
        ? ''
        : `${indent}<${safeTagName}></${safeTagName}>`;
  }

  return `${indent}<${safeTagName}>${escapeXml(String(value))}</${safeTagName}>`;
};

export function FormatConverter({
  defaultFromFormat,
  defaultToFormat,
  allowedFormats,
}: FormatConverterProps = {}) {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [detectedFormat, setDetectedFormat] = useState<SupportedFormat | null>(null);
  const [, setFileContent] = useState('');
  const [parsedData, setParsedData] = useState<any[]>([]);
  const [parsedTableRows, setParsedTableRows] = useState<string[][]>([]);
  const [rawXmlContent, setRawXmlContent] = useState('');
  const [xmlRecordCandidates, setXmlRecordCandidates] = useState<XmlRecordCandidate[]>([]);
  const [selectedXmlRecordKey, setSelectedXmlRecordKey] = useState('');
  const [isConverting, setIsConverting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [includeHeaders, setIncludeHeaders] = useState(true);
  const [separator, setSeparator] = useState(',');
  const [flattenObjects, setFlattenObjects] = useState(false);
  const [isPresetMode, setIsPresetMode] = useState(false);
  const [targetFormat, setTargetFormat] = useState<SupportedFormat | null>(null);
  const [xmlRootName, setXmlRootName] = useState('rows');
  const [xmlRowName, setXmlRowName] = useState('row');
  const [skipEmptyXmlFields, setSkipEmptyXmlFields] = useState(false);

  const isAllowedFormat = useCallback(
    (format: SupportedFormat) =>
      !allowedFormats || allowedFormats.length === 0 || allowedFormats.includes(format),
    [allowedFormats]
  );

  useEffect(() => {
    if (defaultFromFormat && defaultToFormat) {
      setTargetFormat(defaultToFormat);
      setIsPresetMode(true);
    }
  }, [defaultFromFormat, defaultToFormat]);

  useEffect(() => {
    if (!rawXmlContent || detectedFormat !== 'xml') {
      return;
    }

    try {
      const parsedXml = parseXmlRecords(rawXmlContent, selectedXmlRecordKey || undefined);
      setXmlRecordCandidates(parsedXml.candidates);
      setParsedData(parsedXml.data);
      if (!selectedXmlRecordKey && parsedXml.candidates[0]) {
        setSelectedXmlRecordKey(parsedXml.candidates[0].key);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process XML file');
    }
  }, [rawXmlContent, selectedXmlRecordKey, detectedFormat]);

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

  const detectFileFormat = (filename: string): SupportedFormat | null => {
    const extension = filename.toLowerCase().split('.').pop();
    switch (extension) {
      case 'json':
        return 'json';
      case 'csv':
        return 'csv';
      case 'tsv':
        return 'tsv';
      case 'xls':
      case 'xlsx':
        return 'xls';
      case 'xml':
        return 'xml';
      default:
        return null;
    }
  };

  const getAvailableFormats = (sourceFormat: SupportedFormat): ConversionOption[] => {
    const allFormats: ConversionOption[] = [
      { format: 'json', label: 'JSON', description: 'JavaScript Object Notation' },
      { format: 'csv', label: 'CSV', description: 'Comma Separated Values' },
      { format: 'tsv', label: 'TSV', description: 'Tab Separated Values' },
      { format: 'xls', label: 'XLSX', description: 'Excel Spreadsheet' },
      { format: 'xml', label: 'XML', description: 'Extensible Markup Language' },
    ];

    if (isPresetMode && targetFormat) {
      return allFormats.filter((format) => format.format === targetFormat);
    }

    return allFormats.filter(
      (format) => format.format !== sourceFormat && isAllowedFormat(format.format)
    );
  };

  const availableFormats = detectedFormat ? getAvailableFormats(detectedFormat) : [];
  const canOutputCsv = availableFormats.some((format) => format.format === 'csv');
  const visibleFormats = allowedFormats?.length
    ? allowedFormats
    : (['json', 'csv', 'tsv', 'xls', 'xml'] as SupportedFormat[]);
  const visibleFormatLabels = visibleFormats.map((format) => formatDisplayLabels[format]);

  const extractCoreArray = (jsonData: any): any[] => {
    if (Array.isArray(jsonData)) {
      return jsonData;
    }

    if (typeof jsonData === 'object' && jsonData !== null) {
      const arrayKeys = ['data', 'list', 'items', 'results', 'records', 'rows'];

      if (jsonData.data && Array.isArray(jsonData.data.list)) {
        return jsonData.data.list;
      }

      if (jsonData.data && Array.isArray(jsonData.data)) {
        return jsonData.data;
      }

      for (const key of arrayKeys) {
        if (jsonData[key] && Array.isArray(jsonData[key])) {
          return jsonData[key];
        }
      }

      return [jsonData];
    }

    return [jsonData];
  };

  const flattenObject = (obj: any, prefix = ''): any => {
    const flattened: any = {};

    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const newKey = prefix ? `${prefix}_${key}` : key;

        if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
          Object.assign(flattened, flattenObject(obj[key], newKey));
        } else if (Array.isArray(obj[key])) {
          if (obj[key].every((item: any) => typeof item !== 'object')) {
            flattened[newKey] = obj[key].join('; ');
          } else {
            flattened[newKey] = JSON.stringify(obj[key]);
          }
        } else {
          flattened[newKey] = obj[key];
        }
      }
    }

    return flattened;
  };

  const processMultiValueFields = (data: any[]): any[] => {
    return data.map((item) => {
      const processedItem = { ...item };
      const multiValueFields = ['role', 'staff', 'cast', 'actors', 'directors'];

      multiValueFields.forEach((field) => {
        if (
          processedItem[field] &&
          typeof processedItem[field] === 'string' &&
          processedItem[field].includes('\n')
        ) {
          const values = processedItem[field]
            .split('\n')
            .map((v: string) => v.trim())
            .filter((v: string) => v);
          processedItem[field] = values.join('; ');
        }
      });

      return processedItem;
    });
  };

  const prepareTabularData = (data: any[]) => {
    let processedData = processMultiValueFields([...data]);

    if (flattenObjects) {
      processedData = processedData.map((item) => flattenObject(item));
    }

    const allKeys = Array.from(new Set(processedData.flatMap((item) => Object.keys(item))));
    const rows: string[][] = [];

    if (includeHeaders) {
      rows.push(allKeys);
    }

    processedData.forEach((item) => {
      rows.push(allKeys.map((key) => String(item[key] ?? '')));
    });

    return { processedData, allKeys, rows };
  };

  const handleFileUpload = useCallback(
    async (file: File) => {
      try {
        setIsLoading(true);
        setError('');
        setSuccess(false);

        const format = detectFileFormat(file.name);
        if (!format) {
          throw new Error('Unsupported file format. Please upload JSON, CSV, TSV, XML, or XLS/XLSX files.');
        }

        if (!isAllowedFormat(format)) {
          const allowedFormatList = (allowedFormats ?? []).map((item) => item.toUpperCase()).join(', ');
          throw new Error(`This converter only supports ${allowedFormatList} files.`);
        }

        if (isPresetMode && defaultFromFormat && format !== defaultFromFormat) {
          throw new Error(
            `Please upload a ${defaultFromFormat.toUpperCase()} file. Detected format: ${format.toUpperCase()}`
          );
        }

        setUploadedFile(file);
        setDetectedFormat(format);

        let parsed: any[] = [];

        if (format === 'xls') {
          const XLSX = await loadXlsx();
          const arrayBuffer = await file.arrayBuffer();
          const workbook = XLSX.read(arrayBuffer, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const sheetRows = XLSX.utils.sheet_to_json<any[]>(worksheet, { header: 1 });
          const normalizedTable = normalizeDelimitedTable(
            sheetRows.map((row) => (Array.isArray(row) ? row.map((cell) => String(cell ?? '')) : []))
          );
          parsed = normalizedTable.data;

          setFileContent('Excel file processed');
          setParsedTableRows(normalizedTable.rows);
          setRawXmlContent('');
          setXmlRecordCandidates([]);
          setSelectedXmlRecordKey('');
        } else {
          const content = await decodeTextFile(file);
          setFileContent(content);

          if (format === 'json') {
            parsed = extractCoreArray(JSON.parse(content));
            setParsedTableRows([]);
            setRawXmlContent('');
            setXmlRecordCandidates([]);
            setSelectedXmlRecordKey('');
          } else if (format === 'xml') {
            const parsedXml = parseXmlRecords(content);
            parsed = parsedXml.data;
            setParsedTableRows([]);
            setRawXmlContent(content);
            setXmlRecordCandidates(parsedXml.candidates);
            setSelectedXmlRecordKey(parsedXml.candidates[0]?.key ?? '');
          } else {
            const delimiter = format === 'csv' ? ',' : '\t';
            const normalizedTable = normalizeDelimitedTable(parseDelimitedRows(content, delimiter));
            setParsedTableRows(normalizedTable.rows);
            parsed = normalizedTable.data;
            setRawXmlContent('');
            setXmlRecordCandidates([]);
            setSelectedXmlRecordKey('');
          }
        }

        setParsedData(parsed);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to process file');
      } finally {
        setIsLoading(false);
      }
    },
    [allowedFormats, defaultFromFormat, isAllowedFormat, isPresetMode]
  );

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        handleFileUpload(acceptedFiles[0]);
      }
    },
    [handleFileUpload]
  );

  const onDropRejected = useCallback(
    (rejections: readonly DropzoneRejection[]) => {
      const firstError = rejections[0]?.errors[0];

      if (firstError?.message) {
        setError(firstError.message);
        return;
      }

      setError(
        allowedFormats?.length
          ? `This converter only supports ${visibleFormatLabels.join(', ')} files.`
          : 'Unsupported file format. Please upload a supported file.'
      );
    },
    [allowedFormats, visibleFormatLabels]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDropRejected,
    accept: {
      ...(isAllowedFormat('json') ? { 'application/json': ['.json'] } : {}),
      ...(isAllowedFormat('csv')
        ? {
            'text/csv': ['.csv'],
            'application/vnd.ms-excel': ['.csv'],
            'text/plain': ['.csv'],
          }
        : {}),
      ...(isAllowedFormat('tsv') ? { 'text/tab-separated-values': ['.tsv'] } : {}),
      ...(isAllowedFormat('xml')
        ? {
            'application/xml': ['.xml'],
            'text/xml': ['.xml'],
            'application/octet-stream': ['.xml'],
            'text/plain': ['.xml'],
          }
        : {}),
      ...(isAllowedFormat('xls')
        ? {
            'application/vnd.ms-excel': ['.xls'],
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
          }
        : {}),
    },
    validator: (file) => {
      const format = detectFileFormat(file.name);

      if (!format) {
        return {
          code: 'file-invalid-type',
          message: 'Unsupported file format. Please upload a supported file.',
        };
      }

      if (!isAllowedFormat(format)) {
        return {
          code: 'file-invalid-type',
          message: `This converter only supports ${visibleFormatLabels.join(', ')} files.`,
        };
      }

      return null;
    },
    multiple: false,
  });

  const convertToCSV = (data: any[]): string => {
    if (data.length === 0) return '';
    const { rows } = prepareTabularData(data);
    return stringifyDelimitedRows(rows, separator);
  };

  const convertToTSV = (data: any[]): string => {
    if (data.length === 0) return '';
    const { rows } = prepareTabularData(data);
    return stringifyDelimitedRows(rows, '\t');
  };

  const convertToXLSAsync = async (data: any[]): Promise<ArrayBuffer> => {
    const XLSX = await loadXlsx();

    if (data.length === 0) {
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.aoa_to_sheet([[]]);
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
      return XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    }

    const shouldPreserveSourceRows =
      (detectedFormat === 'csv' || detectedFormat === 'tsv' || detectedFormat === 'xls') &&
      parsedTableRows.length > 0;
    const rows = shouldPreserveSourceRows
      ? includeHeaders
        ? parsedTableRows
        : parsedTableRows.slice(1)
      : prepareTabularData(data).rows;
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(rows);
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    return XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  };

  const convertToJSON = (data: any[]): string => {
    const processedData = flattenObjects ? data.map((item) => flattenObject(item)) : data;
    return JSON.stringify(processedData, null, 2);
  };

  const convertToXML = (data: any[]): string => {
    const processedData = processMultiValueFields(
      flattenObjects ? data.map((item) => flattenObject(item)) : [...data]
    );
    const rootTag = sanitizeXmlTagName(xmlRootName, 'rows');
    const rowTag = sanitizeXmlTagName(xmlRowName, 'row');
    const body = processedData
      .map((item) => buildXmlNode(rowTag, item, 1, skipEmptyXmlFields))
      .filter(Boolean)
      .join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>\n<${rootTag}>${body ? `\n${body}\n` : ''}</${rootTag}>`;
  };

  const convertToFormat = async (targetFormat: SupportedFormat) => {
    if (!parsedData.length) {
      setError('No data to convert');
      return;
    }

    setIsConverting(true);
    setError('');
    setSuccess(false);

    try {
      let result: string | ArrayBuffer;
      const timestamp = generateTimestamp();
      const baseName = uploadedFile?.name.split('.')[0] || 'converted';

      switch (targetFormat) {
        case 'json':
          result = convertToJSON(parsedData);
          break;
        case 'csv':
          result = convertToCSV(parsedData);
          break;
        case 'tsv':
          result = convertToTSV(parsedData);
          break;
        case 'xls':
          result = await convertToXLSAsync(parsedData);
          break;
        case 'xml':
          result = convertToXML(parsedData);
          break;
        default:
          throw new Error('Unsupported output format');
      }

      const fileExtension = targetFormat === 'xls' ? 'xlsx' : targetFormat;
      const filename = `${baseName}_${timestamp}.${fileExtension}`;
      downloadConvertedFile(result, filename, targetFormat);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Conversion failed');
    } finally {
      setIsConverting(false);
    }
  };

  const downloadConvertedFile = (content: string | ArrayBuffer, fileName: string, format: SupportedFormat) => {
    const mimeTypes = {
      json: 'application/json',
      csv: 'text/csv',
      tsv: 'text/tab-separated-values',
      xls: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      xml: 'application/xml',
    };

    const blob = new Blob([content], { type: mimeTypes[format] });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    if (isPresetMode) {
      const virtualFile = new File([''], `sample.${defaultFromFormat}`, { type: 'text/plain' });
      setUploadedFile(virtualFile);
      setFileContent('');
      setParsedData([]);
      setParsedTableRows([]);
      setRawXmlContent('');
      setXmlRecordCandidates([]);
      setSelectedXmlRecordKey('');
    } else {
      setUploadedFile(null);
      setDetectedFormat(null);
      setFileContent('');
      setParsedData([]);
      setParsedTableRows([]);
      setRawXmlContent('');
      setXmlRecordCandidates([]);
      setSelectedXmlRecordKey('');
    }
    setError('');
    setSuccess(false);
    setIsLoading(false);
    setIsConverting(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <span className="text-red-700">{error}</span>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-green-500" />
          <span className="text-green-700">File converted and downloaded successfully!</span>
        </div>
      )}

      {!uploadedFile ? (
        <>
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
              isLoading
                ? 'border-green-300 bg-green-50 cursor-default'
                : isDragActive
                  ? 'border-blue-400 bg-blue-50 cursor-pointer'
                  : 'border-gray-300 hover:border-blue-400 cursor-pointer'
            }`}
          >
            <input {...getInputProps()} disabled={isLoading} />

            {isLoading ? (
              <>
                <Loader2 className="w-16 h-16 mx-auto mb-6 text-green-500 animate-spin" />
                <p className="text-xl font-medium text-gray-900 mb-4">Processing File...</p>
                <p className="text-sm text-gray-600">Please wait while we analyze your file...</p>
              </>
            ) : (
              <>
                <Upload
                  className={`w-16 h-16 mx-auto mb-6 ${isDragActive ? 'text-blue-500' : 'text-gray-400'}`}
                />
                <p className="text-xl font-medium text-gray-900">
                  {isPresetMode
                    ? `Upload ${defaultFromFormat?.toUpperCase()} File for Conversion`
                    : isDragActive
                      ? 'Drop your file here'
                      : 'Upload File for Conversion'}
                </p>
                <p className="mt-2 text-sm text-gray-600">
                  {isPresetMode
                    ? `Upload your ${defaultFromFormat?.toUpperCase()} file to convert to ${targetFormat?.toUpperCase()} format`
                    : allowedFormats && allowedFormats.length > 0
                      ? `Drag & drop your file or click to select. Supports ${visibleFormatLabels.join(', ')} files.`
                      : 'Drag & drop your file or click to select. Supports JSON, CSV, TSV, XML, XLSX files.'}
                </p>
                <div className="mt-4 text-xs text-gray-500 space-y-1">
                  <p>• <strong>Smart Format Detection</strong> - Automatically detects file format</p>
                  <p>• <strong>Real Conversion</strong> - Parses and rewrites structured data</p>
                  <p>• <strong>Multiple Formats</strong> - JSON, CSV, TSV, XML, XLSX support</p>
                  <p>• <strong>Privacy Protected</strong> - All processing happens in your browser</p>
                </div>
              </>
            )}
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              All file processing happens entirely in your browser. We do not upload, store, or access any of your file data.
            </p>
          </div>
        </>
      ) : (
        <>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <FileText className="w-8 h-8 text-blue-500" />
                <div>
                  <h3 className="font-semibold text-gray-900">{uploadedFile.name}</h3>
                  <p className="text-sm text-gray-600">
                    Detected format: <span className="font-medium text-blue-600">{detectedFormat?.toUpperCase()}</span>
                    {parsedData.length > 0 && <span className="ml-2">• {parsedData.length} records</span>}
                  </p>
                </div>
              </div>
              <Button onClick={handleReset} variant="outline" size="sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                Upload New File
              </Button>
            </div>

            {detectedFormat && (
              <>
                <h4 className="font-medium text-gray-900 mb-3">Convert to:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {availableFormats.map((format) => (
                    <Button
                      key={format.format}
                      onClick={() => convertToFormat(format.format)}
                      disabled={isConverting}
                      className="flex flex-col items-center p-4 h-auto"
                      variant="outline"
                    >
                      {isConverting ? (
                        <Loader2 className="w-6 h-6 mb-2 animate-spin" />
                      ) : (
                        <Download className="w-6 h-6 mb-2" />
                      )}
                      <span className="font-medium">{format.label}</span>
                      <span className="text-xs text-gray-500 text-center">{format.description}</span>
                    </Button>
                  ))}
                </div>
              </>
            )}
          </div>
        </>
      )}

      {uploadedFile && detectedFormat && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="font-medium text-gray-900 mb-4">Conversion Options</h3>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="includeHeaders"
                checked={includeHeaders}
                onChange={(e) => setIncludeHeaders(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="includeHeaders" className="text-sm font-medium text-gray-700">
                Include Headers
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="flattenObjects"
                checked={flattenObjects}
                onChange={(e) => setFlattenObjects(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="flattenObjects" className="text-sm font-medium text-gray-700">
                Flatten Nested Objects
              </label>
            </div>

            {detectedFormat === 'xml' && xmlRecordCandidates.length > 0 && (
              <div className="flex items-center space-x-2">
                <label htmlFor="xmlRecordNode" className="text-sm font-medium text-gray-700">
                  Record Node:
                </label>
                <select
                  id="xmlRecordNode"
                  value={selectedXmlRecordKey}
                  onChange={(e) => setSelectedXmlRecordKey(e.target.value)}
                  className="border border-gray-300 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {xmlRecordCandidates.map((candidate) => (
                    <option key={candidate.key} value={candidate.key}>
                      {candidate.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {detectedFormat !== 'xml' && (
              <>
                <div className="flex items-center space-x-2">
                  <label htmlFor="xmlRootName" className="text-sm font-medium text-gray-700">
                    XML Root:
                  </label>
                  <input
                    id="xmlRootName"
                    type="text"
                    value={xmlRootName}
                    onChange={(e) => setXmlRootName(e.target.value)}
                    className="border border-gray-300 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <label htmlFor="xmlRowName" className="text-sm font-medium text-gray-700">
                    XML Row:
                  </label>
                  <input
                    id="xmlRowName"
                    type="text"
                    value={xmlRowName}
                    onChange={(e) => setXmlRowName(e.target.value)}
                    className="border border-gray-300 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="skipEmptyXmlFields"
                    checked={skipEmptyXmlFields}
                    onChange={(e) => setSkipEmptyXmlFields(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="skipEmptyXmlFields" className="text-sm font-medium text-gray-700">
                    Skip Empty XML Fields
                  </label>
                </div>
              </>
            )}

            {canOutputCsv && (
              <div className="flex items-center space-x-2">
                <label htmlFor="separator" className="text-sm font-medium text-gray-700">
                  CSV Delimiter:
                </label>
                <select
                  id="separator"
                  value={separator}
                  onChange={(e) => setSeparator(e.target.value)}
                  className="border border-gray-300 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value=",">Comma (,)</option>
                  <option value=";">Semicolon (;)</option>
                  <option value="\t">Tab</option>
                  <option value="|">Pipe (|)</option>
                </select>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h3 className="font-medium text-gray-900 mb-4">How It Works</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-600">
          <div>
            <h4 className="font-medium text-gray-800 mb-2">Supported Formats</h4>
            <ul className="space-y-1">
              <li>• <strong>JSON:</strong> JavaScript Object Notation</li>
              <li>• <strong>CSV:</strong> Comma Separated Values</li>
              <li>• <strong>TSV:</strong> Tab Separated Values</li>
              <li>• <strong>XLSX:</strong> Excel Spreadsheet</li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-gray-800 mb-2">Simple Process</h4>
            <ol className="space-y-1">
              <li>1. Upload your file</li>
              <li>2. We parse it into structured records</li>
              <li>3. Choose your target format</li>
              <li>4. Download the newly generated file</li>
            </ol>
          </div>
        </div>

        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded text-sm text-blue-700">
          <strong>Privacy First:</strong> All file processing happens entirely in your browser. No data is uploaded to our servers.
        </div>
      </div>
    </div>
  );
}

export default FormatConverter;
