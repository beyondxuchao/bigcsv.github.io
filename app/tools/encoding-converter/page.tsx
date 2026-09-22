import React from 'react';
import dynamic from 'next/dynamic';
import { ToolPageShell } from '@/components/ToolPageShell';

const EncodingConverter = dynamic(
  () => import('@/app/components/EncodingConverter').then((mod) => mod.EncodingConverter),
  {
    loading: () => (
      <div className="max-w-4xl mx-auto px-4 text-sm text-gray-500">Loading converter...</div>
    ),
  }
);

export const metadata = {
  alternates: { canonical: '/tools/encoding-converter/' },
  title: 'File Encoding Converter | Convert UTF-8, GBK, GB2312, Big5 Online Free',
  description:
    'Free online file encoding converter tool. Convert between UTF-8, GBK, GB2312, Big5, and other character encodings. Automatic encoding detection, secure browser-based processing.',
  keywords:
    'encoding converter, file encoding, utf-8 converter, gbk converter, gb2312 converter, big5 converter, character encoding, text encoding converter, file charset converter',
};

export default function EncodingConverterPage() {
  return (
    <ToolPageShell
      title="File Encoding Converter"
      description="Convert between different character encodings with automatic detection"
      quickLinks={
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          <a
            href="/tools/encoding-converter/utf8-to-gbk"
            className="bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg p-3 text-center transition-colors"
          >
            <div className="font-medium text-blue-900 text-sm">UTF-8 to GBK</div>
            <div className="text-xs text-blue-600 mt-1">Chinese Simplified</div>
          </a>
          <a
            href="/tools/encoding-converter/gbk-to-utf8"
            className="bg-green-50 hover:bg-green-100 border border-green-200 rounded-lg p-3 text-center transition-colors"
          >
            <div className="font-medium text-green-900 text-sm">GBK to UTF-8</div>
            <div className="text-xs text-green-600 mt-1">Universal</div>
          </a>
          <a
            href="/tools/encoding-converter/utf8-to-gb2312"
            className="bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg p-3 text-center transition-colors"
          >
            <div className="font-medium text-purple-900 text-sm">UTF-8 to GB2312</div>
            <div className="text-xs text-purple-600 mt-1">Legacy Chinese</div>
          </a>
          <a
            href="/tools/encoding-converter/utf8-to-big5"
            className="bg-orange-50 hover:bg-orange-100 border border-orange-200 rounded-lg p-3 text-center transition-colors"
          >
            <div className="font-medium text-orange-900 text-sm">UTF-8 to Big5</div>
            <div className="text-xs text-orange-600 mt-1">Traditional Chinese</div>
          </a>
          <a
            href="/tools/encoding-converter/big5-to-utf8"
            className="bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-lg p-3 text-center transition-colors"
          >
            <div className="font-medium text-teal-900 text-sm">Big5 to UTF-8</div>
            <div className="text-xs text-teal-600 mt-1">Universal</div>
          </a>
        </div>
      }
    >
      <EncodingConverter />
    </ToolPageShell>
  );
}
