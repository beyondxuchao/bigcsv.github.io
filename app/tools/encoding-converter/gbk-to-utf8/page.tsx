import React from 'react';
import { EncodingConverter } from '@/app/components/EncodingConverter';

export const metadata = {
  title: 'GBK to UTF-8 Converter | Convert GBK Files to UTF-8 Encoding Online Free',
  description: 'Free online GBK to UTF-8 encoding converter. Convert GBK (Chinese Simplified) encoded files to UTF-8 encoding with automatic detection and secure browser-based processing.',
  keywords: 'gbk to utf-8 converter, gbk utf8 converter, chinese encoding converter, gbk utf-8 conversion, file encoding converter, charset converter',
};

export default function GBKToUTF8Page() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              GBK to UTF-8 Converter
            </h1>
            <p className="text-gray-600">
              Convert GBK (Chinese Simplified) encoded files to UTF-8 encoding format
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-8">
        <EncodingConverter defaultFromEncoding="gbk" defaultToEncoding="utf-8" />
      </div>
    </div>
  );
}
