import React, { useState } from 'react';
import { Download, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ExportDropdownButtonProps {
  onExport: (format: string) => void;
  disabled?: boolean;
}

export function ExportDropdownButton({ onExport, disabled = false }: ExportDropdownButtonProps) {
  const [exportFormat, setExportFormat] = useState('csv');
  const [isOpen, setIsOpen] = useState(false);

  const formats = [
    { value: 'csv', label: 'CSV' },
    { value: 'json', label: 'JSON' },
    { value: 'tsv', label: 'TSV' },
    { value: 'xls', label: 'XLSX' }
  ];

  const handleExport = () => {
    if (!disabled) {
      onExport(exportFormat);
      setIsOpen(false);
    }
  };

  const handleFormatChange = (format: string) => {
    setExportFormat(format);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-flex">
      {/* Main Export Button */}
      <Button
        onClick={handleExport}
        disabled={disabled}
        className="flex items-center gap-2 rounded-r-none border-r-0"
      >
        <Download className="h-4 w-4" />
        <span className="hidden sm:inline">Export {exportFormat === 'xls' ? 'XLSX' : exportFormat.toUpperCase()}</span>
        <span className="sm:hidden">Export</span>
      </Button>
      
      {/* Dropdown Button */}
      <div className="relative">
        <Button
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          variant="default"
          size="default"
          className="px-2 rounded-l-none border-l border-primary-foreground/20"
        >
          <ChevronDown className="h-4 w-4" />
        </Button>
        
        {/* Dropdown Menu */}
        {isOpen && !disabled && (
          <div className="absolute right-0 top-full mt-1 w-24 bg-white border border-border rounded-md shadow-lg z-50">
            {formats.map((format) => (
              <button
                key={format.value}
                onClick={() => handleFormatChange(format.value)}
                className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-50 first:rounded-t-md last:rounded-b-md ${
                  exportFormat === format.value ? 'bg-primary/10 text-primary' : 'text-gray-700'
                }`}
              >
                {format.label}
              </button>
            ))}
          </div>
        )}
      </div>
      
      {/* Click outside to close */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}