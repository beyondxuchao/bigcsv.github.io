import React from 'react';
import { EncodingConverter } from '@/app/components/EncodingConverter';

export const metadata = {
  title: 'UTF-8 to GB2312 Converter | Convert UTF-8 Files to GB2312 Encoding Online Free',
  description: 'Free online UTF-8 to GB2312 encoding converter. Convert UTF-8 encoded files to GB2312 (Chinese Simplified Legacy) encoding with automatic detection and secure browser-based processing.',
  keywords: 'utf-8 to gb2312 converter, utf8 gb2312 converter, chinese encoding converter, utf-8 gb2312 conversion, file encoding converter, charset converter',
};

export default function UTF8ToGB2312Page() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              UTF-8 to GB2312 Converter
            </h1>
            <p className="text-gray-600">
              Convert UTF-8 encoded files to GB2312 (Chinese Simplified Legacy) encoding format
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-8">
        <EncodingConverter defaultFromEncoding="utf-8" defaultToEncoding="gb2312" />
      </div>
    </div>
  );
}
