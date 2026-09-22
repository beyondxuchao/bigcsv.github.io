import { Metadata } from 'next';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { ToolPageShell } from '@/components/ToolPageShell';

const FormatConverter = dynamic(
  () => import('@/components/FormatConverter').then((mod) => mod.FormatConverter),
  {
    loading: () => (
      <div className="max-w-4xl mx-auto px-4 text-sm text-gray-500">Loading converter...</div>
    ),
  }
);

export const metadata: Metadata = {
  title: 'CSV XML Converter | Convert CSV to XML and XML to CSV Online',
  description:
    'Free online CSV XML converter for turning CSV into XML or XML into CSV. Clean browser-based conversion with XML record node detection, custom root tags, and instant downloads.',
  keywords:
    'csv xml converter, csv to xml, xml to csv, convert csv to xml online, convert xml to csv online, xml csv converter, browser xml converter',
  openGraph: {
    title: 'CSV XML Converter | Convert CSV and XML Online',
    description:
      'Convert CSV to XML or XML to CSV directly in your browser with automatic record detection and clean export output.',
    type: 'website',
  },
  alternates: {
    canonical: '/tools/format-converter/csv-xml-converter/',
  },
};

export default function CsvXmlConverterPage() {
  return (
    <ToolPageShell
      title="CSV XML Converter"
      description="Convert CSV to XML or XML to CSV in one place with clean browser-based processing and flexible XML options"
      quickLinks={
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Link
            href="/tutorials/what-is-xml-format"
            className="bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg p-4 transition-colors"
          >
            <div className="font-medium text-blue-900">What Is XML?</div>
            <div className="text-sm text-blue-700 mt-1">
              Learn the structure, use cases, and common XML patterns
            </div>
          </Link>
          <Link
            href="/tutorials/xml-to-csv-guide"
            className="bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg p-4 transition-colors"
          >
            <div className="font-medium text-emerald-900">How to Convert XML to CSV</div>
            <div className="text-sm text-emerald-700 mt-1">
              See record-node selection tips and flattening guidance
            </div>
          </Link>
          <Link
            href="/updates"
            className="bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg p-4 transition-colors"
          >
            <div className="font-medium text-amber-900">Today&apos;s Updates</div>
            <div className="text-sm text-amber-700 mt-1">
              Review the latest XML/CSV converter fixes and content updates
            </div>
          </Link>
        </div>
      }
    >
      <FormatConverter allowedFormats={['csv', 'xml']} />

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 space-y-6">
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Why Use a Combined CSV XML Converter?</h2>
          <p className="text-gray-600 leading-7">
            CSV and XML are often part of the same workflow. CSV is great for spreadsheets and batch editing,
            while XML is better for integrations, structured imports, and system-to-system exchange. Keeping both
            directions in one tool makes it easier to switch between tabular and hierarchical data without hunting
            for separate pages.
          </p>
        </section>

        <section>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">What This Tool Handles Well</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div className="rounded-lg border border-gray-200 p-4">
              <div className="font-semibold text-gray-900 mb-2">CSV to XML</div>
              <ul className="list-disc list-inside space-y-1">
                <li>Use CSV headers as XML field tags</li>
                <li>Customize root and row node names</li>
                <li>Skip empty fields when needed</li>
              </ul>
            </div>
            <div className="rounded-lg border border-gray-200 p-4">
              <div className="font-semibold text-gray-900 mb-2">XML to CSV</div>
              <ul className="list-disc list-inside space-y-1">
                <li>Detect repeating record-style nodes</li>
                <li>Flatten nested elements into columns</li>
                <li>Keep attributes available in CSV output</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">Check the converted result</h3>
          <p className="text-gray-600 leading-7">
            Try a small sample first. When converting XML, select the repeating record node and compare
            the resulting row count with your source. Nested elements and attributes can become columns;
            review their names before importing the CSV into another system. Keep a copy of the original
            because a flat CSV cannot preserve every feature of a hierarchical XML document.
          </p>
        </section>
      </div>
    </ToolPageShell>
  );
}
