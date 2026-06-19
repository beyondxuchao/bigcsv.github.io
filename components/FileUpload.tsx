import React, { useCallback } from 'react';
import { Upload, Loader2 } from 'lucide-react';
import { useDropzone } from 'react-dropzone';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  isLoading?: boolean;
  loadingProgress?: number;
  processingStatus?: string;
}

export function FileUpload({
  onFileSelect,
  isLoading = false,
  loadingProgress = 0,
  processingStatus = '',
}: FileUploadProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        onFileSelect(acceptedFiles[0]);
      }
    },
    [onFileSelect]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
    },
    multiple: false,
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
        isLoading
          ? 'border-green-300 bg-green-50 cursor-default'
          : isDragActive
            ? 'border-primary bg-primary/5 cursor-pointer'
            : 'border-border hover:border-primary cursor-pointer'
      }`}
    >
      <input {...getInputProps()} disabled={isLoading} />

      {isLoading ? (
        <>
          <Loader2 className="w-16 h-16 mx-auto mb-6 text-green-500 animate-spin" />
          <p className="text-xl font-medium text-gray-900 mb-4">
            {processingStatus || 'Processing CSV File...'}
          </p>
          <div className="w-full max-w-md mx-auto mb-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Progress</span>
              <span>{Math.round(loadingProgress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${loadingProgress}%` }}
              />
            </div>
          </div>
          <p className="text-sm text-gray-600">Please wait while we process your file...</p>
        </>
      ) : (
        <>
          <Upload
            className={`w-16 h-16 mx-auto mb-6 ${isDragActive ? 'text-primary' : 'text-gray-400'}`}
          />
          <p className="text-xl font-medium text-gray-900">
            {isDragActive ? 'Drop your CSV file here' : 'Upload CSV File for Analysis'}
          </p>
          <p className="mt-2 text-sm text-gray-600">
            Drag and drop your CSV file or click to select. Supports large CSV files.
          </p>
          <div className="mt-4 text-xs text-gray-500 space-y-1">
            <p>• <strong>CSV Analysis Tool</strong> - Filter and process your data instantly</p>
            <p>• <strong>Large File Support</strong> - Handle big CSV files with ease</p>
            <p>• <strong>Online CSV Editor</strong> - No software installation required</p>
            <p>• <strong>CSV File Viewer</strong> - Preview and analyze your data in real time</p>
          </div>
        </>
      )}
    </div>
  );
}
