import React from 'react';
import { EncodingConverter } from '@/app/components/EncodingConverter';

export const metadata = {
  alternates: { canonical: '/tools/encoding-converter/utf8-to-big5/' },
  title: 'UTF-8 to Big5 Converter | Convert UTF-8 Files to Big5 Encoding Online Free',
  description: 'Free online UTF-8 to Big5 encoding converter. Convert UTF-8 encoded files to Big5 (Chinese Traditional) encoding with automatic detection and secure browser-based processing.',
  keywords: 'utf-8 to big5 converter, utf8 big5 converter, chinese traditional encoding converter, utf-8 big5 conversion, file encoding converter, charset converter',
};

export default function UTF8ToBig5Page() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              UTF-8 to Big5 Converter
            </h1>
            <p className="text-gray-600">
              Convert UTF-8 encoded files to Big5 (Chinese Traditional) encoding format
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-8">
        <EncodingConverter defaultFromEncoding="utf-8" defaultToEncoding="big5" />
      </div>
    </div>
  );
}
