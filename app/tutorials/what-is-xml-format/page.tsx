import { Metadata } from 'next';
import Link from 'next/link';
import { Clock, User } from 'lucide-react';
import TutorialHeader from '@/components/TutorialHeader';

export const metadata: Metadata = {
  alternates: { canonical: '/tutorials/what-is-xml-format/' },
  title: 'What is XML? Complete Guide to XML Format - CSVFilters',
  description:
    'Learn what XML is, how XML tags and attributes work, common XML structures, where XML is used, and how XML compares with CSV and JSON.',
  keywords:
    'what is xml, xml format, xml file, xml tags, xml attributes, xml vs csv, xml vs json',
  openGraph: {
    title: 'What is XML? Complete Guide to XML Format',
    description: 'A practical guide to understanding XML structure, use cases, and conversion workflows',
    type: 'article',
  },
};

export default function WhatIsXmlFormatPage() {
  const breadcrumbItems = [{ label: 'Tutorials', href: '/tutorials' }];

  return (
    <div className="min-h-screen bg-gray-50">
      <TutorialHeader
        title="What is XML? Complete Guide to XML Format"
        showBackButton={true}
        showBreadcrumb={true}
        breadcrumbItems={breadcrumbItems}
      />

      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
              File Format Guide
            </span>
          </div>

          <div className="flex items-center gap-6 text-sm text-gray-600 mb-6">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>Reading time: 8 minutes</span>
            </div>
            <div className="flex items-center gap-1">
              <User className="w-4 h-4" />
              <span>Author: CSVFilters Team</span>
            </div>
            <span>Published: 2026-05-14</span>
          </div>

          <p className="text-lg text-gray-700 leading-relaxed">
            XML stands for Extensible Markup Language. It is a structured text format used to describe
            data with nested tags, attributes, and repeating elements. XML is older than JSON, but it is
            still widely used in feeds, enterprise systems, document workflows, and data exchange pipelines.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">How XML Works</h2>
            <p className="text-gray-600 mb-4">
              XML organizes data into elements. Each element has a start tag and end tag, and elements can
              contain text, attributes, or other elements. That makes XML well suited for hierarchical data.
            </p>
            <div className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto">
              <pre className="text-sm">{`<words>
  <row>
    <word>Tell</word>
    <example>Tell me what these are.</example>
    <meaning>告诉</meaning>
  </row>
  <row>
    <word>These</word>
    <example>These are cars.</example>
    <meaning>这些</meaning>
  </row>
</words>`}</pre>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Main Parts of XML</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-blue-50 rounded-lg p-5">
                <h3 className="font-semibold text-blue-900 mb-2">Elements</h3>
                <p className="text-sm text-blue-800">
                  Tags like `&lt;row&gt;` and `&lt;word&gt;` define the structure and meaning of the data.
                </p>
              </div>
              <div className="bg-emerald-50 rounded-lg p-5">
                <h3 className="font-semibold text-emerald-900 mb-2">Attributes</h3>
                <p className="text-sm text-emerald-800">
                  Extra metadata can be stored on tags, for example `&lt;row id=&quot;1&quot;&gt;`.
                </p>
              </div>
              <div className="bg-amber-50 rounded-lg p-5">
                <h3 className="font-semibold text-amber-900 mb-2">Nested Structure</h3>
                <p className="text-sm text-amber-800">
                  Elements can contain child elements, which is why XML can represent more than flat tables.
                </p>
              </div>
              <div className="bg-purple-50 rounded-lg p-5">
                <h3 className="font-semibold text-purple-900 mb-2">Repeating Nodes</h3>
                <p className="text-sm text-purple-800">
                  Repeating tags like multiple `&lt;row&gt;` entries often become rows during XML to CSV conversion.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Where XML Is Still Used</h2>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Content feeds and document publishing pipelines</li>
              <li>Enterprise integrations and older business systems</li>
              <li>Configuration files and import/export workflows</li>
              <li>Structured records shared between tools that require explicit tagging</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">XML vs CSV</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left border-b">Feature</th>
                    <th className="px-4 py-3 text-left border-b">XML</th>
                    <th className="px-4 py-3 text-left border-b">CSV</th>
                  </tr>
                </thead>
                <tbody className="text-sm text-gray-600">
                  <tr>
                    <td className="px-4 py-3 border-b font-medium">Structure</td>
                    <td className="px-4 py-3 border-b">Hierarchical</td>
                    <td className="px-4 py-3 border-b">Flat table</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 border-b font-medium">Readability</td>
                    <td className="px-4 py-3 border-b">Verbose but explicit</td>
                    <td className="px-4 py-3 border-b">Compact and spreadsheet-friendly</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 border-b font-medium">Best For</td>
                    <td className="px-4 py-3 border-b">Tagged data exchange</td>
                    <td className="px-4 py-3 border-b">Tabular editing and analysis</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Related Tools</h2>
            <div className="flex flex-wrap gap-3">
              <Link href="/tools/format-converter/csv-xml-converter" className="text-blue-600 hover:underline">
                CSV XML Converter
              </Link>
              <Link href="/tutorials/xml-to-csv-guide" className="text-blue-600 hover:underline">
                XML to CSV Guide
              </Link>
              <Link href="/tools/format-converter/csv-to-json" className="text-blue-600 hover:underline">
                CSV to JSON
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
