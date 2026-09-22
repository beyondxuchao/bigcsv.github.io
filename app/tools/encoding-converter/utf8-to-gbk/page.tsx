import React from 'react';
import dynamic from 'next/dynamic';

const EncodingConverter = dynamic(
  () => import('@/app/components/EncodingConverter').then((mod) => mod.EncodingConverter),
  {
    loading: () => <div className="max-w-4xl mx-auto px-4 text-sm text-gray-500">Loading converter...</div>,
  }
);

export const metadata = {
  alternates: { canonical: '/tools/encoding-converter/utf8-to-gbk/' },
  title: 'UTF-8 to GBK Converter | Convert UTF-8 Files to GBK Encoding Online Free',
  description: 'Free online UTF-8 to GBK encoding converter. Convert UTF-8 encoded files to GBK (Chinese Simplified) encoding with automatic detection and secure browser-based processing.',
  keywords: 'utf-8 to gbk converter, utf8 gbk converter, chinese encoding converter, utf-8 gbk conversion, file encoding converter, charset converter',
};

export default function UTF8ToGBKPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              UTF-8 to GBK Converter
            </h1>
            <p className="text-gray-600">
              Convert UTF-8 encoded files to GBK (Chinese Simplified) encoding format
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-8">
        <EncodingConverter defaultFromEncoding="utf-8" defaultToEncoding="gbk" />
      </div>
    </div>
  );
}
