import React from 'react';
import { FormatConverter } from '@/components/FormatConverter';

export const metadata = {
  title: 'JSON to CSV Converter | Free Online Format Converter Tool',
  description: 'Convert JSON files to CSV format instantly with our free online converter. Support for nested JSON, arrays, and complex data structures. Fast, secure, and browser-based processing.',
  keywords: 'json to csv converter, json csv conversion, format converter, data conversion tool, json parser, csv generator, online converter',
};

export default function JsonToCsvPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="py-8">
        <FormatConverter />
      </div>
    </div>
  );
}