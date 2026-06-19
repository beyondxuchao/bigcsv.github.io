'use client';

import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Upload, RefreshCw, AlertCircle, CheckCircle, FileText, Loader2 } from 'lucide-react';
import { useDropzone } from 'react-dropzone';

type SupportedEncoding = 'utf-8' | 'gbk' | 'gb2312' | 'big5' | 'shift-jis' | 'iso-8859-1';

interface EncodingOption {
  encoding: SupportedEncoding;
  label: string;
  description: string;
}

interface EncodingConverterProps {
  defaultFromEncoding?: SupportedEncoding;
  defaultToEncoding?: SupportedEncoding;
}

const ensureBufferPolyfill = async () => {
  if (typeof window === 'undefined' || (window as any).Buffer) {
    return;
  }

  const { Buffer } = await import('buffer');
  (window as any).Buffer = Buffer;
};

export function EncodingConverter({ defaultFromEncoding, defaultToEncoding }: EncodingConverterProps = {}) {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [fileBuffer, setFileBuffer] = useState<ArrayBuffer | null>(null);
  const [detectedEncoding, setDetectedEncoding] = useState<SupportedEncoding | null>(null);
  const [fileContent, setFileContent] = useState<string>('');
  const [isConverting, setIsConverting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  // 预设模式检测
  const isPresetMode = defaultFromEncoding && defaultToEncoding;
  const sourceEncoding = defaultFromEncoding;
  const targetEncoding = defaultToEncoding;

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

  const detectEncoding = async (buffer: ArrayBuffer): Promise<SupportedEncoding> => {
    await ensureBufferPolyfill();
    const jschardet = await import('jschardet');
    const binaryString = Array.from(new Uint8Array(buffer))
      .map(byte => String.fromCharCode(byte))
      .join('');
    
    const result = jschardet.default.detect(binaryString);
    
    // Return detected encoding or default to UTF-8 if confidence is low
    if (result && result.encoding && result.confidence > 0.5) {
      const encoding = result.encoding.toLowerCase();
      if (encoding === 'gb2312' || encoding === 'gbk') return 'gbk';
      if (encoding === 'big5') return 'big5';
      if (encoding === 'shift_jis') return 'shift-jis';
      if (encoding === 'iso-8859-1') return 'iso-8859-1';
      if (encoding === 'utf-8' || encoding === 'ascii') return 'utf-8';
    }
    
    return 'utf-8';
  };

  const getAvailableEncodings = (currentEncoding: SupportedEncoding): EncodingOption[] => {
    const allEncodings: EncodingOption[] = [
      { encoding: 'utf-8', label: 'UTF-8', description: 'Universal encoding' },
      { encoding: 'gbk', label: 'GBK', description: 'Chinese simplified' },
      { encoding: 'gb2312', label: 'GB2312', description: 'Chinese simplified (legacy)' },
      { encoding: 'big5', label: 'Big5', description: 'Chinese traditional' },
      { encoding: 'shift-jis', label: 'Shift-JIS', description: 'Japanese' },
      { encoding: 'iso-8859-1', label: 'ISO-8859-1', description: 'Western European' },
    ];
    
    // 预设模式下只返回目标编码
    if (isPresetMode && targetEncoding) {
      return allEncodings.filter(enc => enc.encoding === targetEncoding);
    }
    
    return allEncodings.filter(enc => enc.encoding !== currentEncoding);
  };

  const handleFileUpload = useCallback(async (files: File[]) => {
    const file = files[0];
    if (!file) return;

    setIsLoading(true);
    setError('');
    setSuccess(false);

    try {
      const buffer = await file.arrayBuffer();
      const encoding = await detectEncoding(buffer);
      
      // 尝试用检测到的编码读取文件
      let content = '';
      try {
        const decoder = new TextDecoder(encoding);
        content = decoder.decode(buffer);
      } catch {
        // 如果检测的编码失败，尝试UTF-8
        const decoder = new TextDecoder('utf-8', { fatal: false });
        content = decoder.decode(buffer);
      }

      // 预设模式下验证编码格式
      if (isPresetMode && sourceEncoding && encoding !== sourceEncoding) {
        setError(`Please upload a ${sourceEncoding.toUpperCase()} encoded file. Detected encoding: ${encoding.toUpperCase()}`);
        setIsLoading(false);
        return;
      }
      
      setUploadedFile(file);
      setFileBuffer(buffer);
      setDetectedEncoding(encoding);
      setFileContent(content);
    } catch (err) {
      setError('Failed to read file. Please try again.');
      console.error('File reading error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [isPresetMode, sourceEncoding]);

  const handleEncodingChange = (newEncoding: string) => {
    const encoding = newEncoding as SupportedEncoding;
    setDetectedEncoding(encoding);
    
    if (fileBuffer) {
      try {
        const decoder = new TextDecoder(encoding);
        const content = decoder.decode(fileBuffer);
        setFileContent(content);
      } catch (err) {
        console.error('Re-decoding error:', err);
        setError(`Failed to decode with ${encoding.toUpperCase()}`);
      }
    }
  };

  const convertToEncoding = async (targetEncoding: SupportedEncoding) => {
    if (!uploadedFile || !fileContent) return;

    setIsConverting(true);
    setError('');
    setSuccess(false);

    try {
      let bytes: Uint8Array;
      if (targetEncoding === 'utf-8') {
        const encoder = new TextEncoder();
        bytes = encoder.encode(fileContent);
      } else {
        const mod = await import('iconv-lite');
        const iconv: any = (mod as any).default ?? mod;
        const encoded = iconv.encode(fileContent, targetEncoding);
        bytes = encoded instanceof Uint8Array ? encoded : new Uint8Array(encoded);
      }

      // 创建下载链接
      const blob = new Blob([bytes], { type: 'application/octet-stream' });
      const url = URL.createObjectURL(blob);
      
      // 生成文件名
      const originalName = uploadedFile.name;
      const nameWithoutExt = originalName.substring(0, originalName.lastIndexOf('.')) || originalName;
      const extension = originalName.substring(originalName.lastIndexOf('.')) || '';
      const timestamp = generateTimestamp();
      const newFileName = `${nameWithoutExt}_${targetEncoding}_${timestamp}${extension}`;
      
      // 触发下载
      const a = document.createElement('a');
      a.href = url;
      a.download = newFileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError('Conversion failed. Please try again.');
      console.error('Conversion error:', err);
    } finally {
      setIsConverting(false);
    }
  };

  const handleReset = () => {
    setUploadedFile(null);
    setDetectedEncoding(null);
    setFileContent('');
    setError('');
    setSuccess(false);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleFileUpload,
    accept: {
      'text/*': ['.txt', '.csv', '.tsv', '.json', '.xml', '.html', '.css', '.js'],
      'application/json': ['.json'],
      'text/csv': ['.csv'],
      'text/tab-separated-values': ['.tsv']
    },
    multiple: false,
    maxSize: 50 * 1024 * 1024, // 50MB
  });

  return (
    <div className="container mx-auto px-4 max-w-4xl">
      {/* Status Messages */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <span className="text-red-700">{error}</span>
        </div>
      )}
      
      {success && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
          <span className="text-green-700">File converted and downloaded successfully!</span>
        </div>
      )}

      {!uploadedFile ? (
        <>
          {/* Upload Area */}
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragActive
                ? 'border-blue-400 bg-blue-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center gap-4">
              {isLoading ? (
                <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
              ) : (
                <Upload className="w-12 h-12 text-gray-400" />
              )}
              <div>
                <p className="text-lg font-medium text-gray-900 mb-2">
                  {isLoading ? 'Processing file...' : 
                   isPresetMode ? `Upload ${sourceEncoding?.toUpperCase()} File for Conversion` :
                   'Drop your file here or click to browse'}
                </p>
                <p className="text-sm text-gray-600">
                  {isPresetMode ? 
                   `Convert ${sourceEncoding?.toUpperCase()} to ${targetEncoding?.toUpperCase()} encoding` :
                   'Supports: TXT, CSV, TSV, JSON, XML, HTML, CSS, JS files (max 50MB)'}
                </p>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="mt-8 bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Features</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <p>✓ <strong>Smart Encoding Detection</strong> - Automatically detects file encoding</p>
                <p>✓ <strong>Multiple Encodings</strong> - UTF-8, GBK, GB2312, Big5, Shift-JIS support</p>
                <p>✓ <strong>Instant Conversion</strong> - Convert with one click</p>
                <p>✓ <strong>Privacy Protected</strong> - All processing happens in your browser</p>
              </div>
            </div>
          </div>
          
          {/* Privacy Notice */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
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
          {/* File Info and Conversion Options */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <FileText className="w-8 h-8 text-blue-500" />
                <div>
                  <h3 className="font-semibold text-gray-900">{uploadedFile.name}</h3>
                  <div className="flex items-center text-sm text-gray-600 mt-1">
                    <span>Detected encoding: </span>
                    <select 
                      value={detectedEncoding || ''} 
                      onChange={(e) => handleEncodingChange(e.target.value)}
                      className="ml-2 px-2 py-0.5 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-blue-600 font-medium bg-white cursor-pointer hover:bg-gray-50"
                      title="If the text looks wrong, try changing this manually"
                    >
                      <option value="utf-8">UTF-8</option>
                      <option value="gbk">GBK</option>
                      <option value="gb2312">GB2312</option>
                      <option value="big5">Big5</option>
                      <option value="shift-jis">Shift-JIS</option>
                      <option value="iso-8859-1">ISO-8859-1</option>
                    </select>
                    <span className="ml-3 border-l pl-3 border-gray-300">{(uploadedFile.size / 1024).toFixed(1)} KB</span>
                  </div>
                </div>
              </div>
              <Button
                onClick={handleReset}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Reset
              </Button>
            </div>

            {/* Conversion Options */}
            {detectedEncoding && (
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Convert to:</h4>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {getAvailableEncodings(detectedEncoding).map((option) => (
                    <Button
                      key={option.encoding}
                      onClick={() => convertToEncoding(option.encoding)}
                      disabled={isConverting}
                      className="flex items-center justify-between p-4 h-auto text-left"
                      variant="outline"
                    >
                      <div>
                        <div className="font-medium">{option.label}</div>
                        <div className="text-xs text-gray-500">{option.description}</div>
                      </div>
                      {isConverting ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Download className="w-4 h-4" />
                      )}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* File Preview */}
          {fileContent && (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h4 className="font-medium text-gray-900 mb-3">File Preview</h4>
              <div className="bg-gray-50 rounded border p-4 max-h-64 overflow-auto">
                <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
                  {fileContent.substring(0, 1000)}
                  {fileContent.length > 1000 && '\n\n... (truncated)'}
                </pre>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default EncodingConverter;
