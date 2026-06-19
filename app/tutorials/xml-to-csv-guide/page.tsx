import { Metadata } from 'next';
import Link from 'next/link';
import { Clock, User, ArrowRight, CheckCircle, FileText } from 'lucide-react';
import TutorialHeader from '@/components/TutorialHeader';

export const metadata: Metadata = {
  title: 'How to Convert XML to CSV - XML to CSV Guide | CSVFilters',
  description:
    'Learn how to convert XML to CSV, how XML record nodes map to rows, how nested fields flatten into columns, and how to avoid common XML parsing issues.',
  keywords:
    'xml to csv, convert xml to csv, xml csv guide, xml record nodes, flatten xml to csv, xml spreadsheet conversion',
  openGraph: {
    title: 'How to Convert XML to CSV',
    description: 'A practical XML to CSV guide with examples and common troubleshooting tips',
    type: 'article',
  },
};

export default function XmlToCsvGuidePage() {
  const breadcrumbItems = [{ label: 'Tutorials', href: '/tutorials' }];

  return (
    <div className="min-h-screen bg-gray-50">
      <TutorialHeader
        title="How to Convert XML to CSV"
        showBackButton={true}
        showBreadcrumb={true}
        breadcrumbItems={breadcrumbItems}
      />

      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
              Data Conversion
            </span>
          </div>

          <div className="flex items-center gap-6 text-sm text-gray-600 mb-6">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>Reading time: 7 minutes</span>
            </div>
            <div className="flex items-center gap-1">
              <User className="w-4 h-4" />
              <span>Author: CSVFilters Team</span>
            </div>
            <span>Published: 2026-05-14</span>
          </div>

          <p className="text-lg text-gray-700 leading-relaxed">
            XML to CSV conversion works best when your XML contains repeating record-like nodes. Each repeated
            node becomes one CSV row, and its child values become columns. The main challenge is choosing the
            right record node and flattening nested values cleanly.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Quick Outline
          </h2>
          <nav className="space-y-2">
            <a href="#when-it-works-best" className="block text-blue-600 hover:text-blue-800">
              1. When XML to CSV works best
            </a>
            <a href="#record-nodes" className="block text-blue-600 hover:text-blue-800">
              2. How record nodes become rows
            </a>
            <a href="#nested-values" className="block text-blue-600 hover:text-blue-800">
              3. What happens to nested values
            </a>
            <a href="#workflow" className="block text-blue-600 hover:text-blue-800">
              4. Recommended conversion workflow
            </a>
            <a href="#issues" className="block text-blue-600 hover:text-blue-800">
              5. Common issues
            </a>
          </nav>
        </div>

        <div className="space-y-8">
          <section id="when-it-works-best" className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. When XML to CSV Works Best</h2>
            <p className="text-gray-600 mb-4">
              XML converts neatly to CSV when there is a repeated pattern such as `row`, `item`, `record`, or
              `entry`. If every repeated node has similar child tags, the CSV output will usually be clean and
              spreadsheet-friendly.
            </p>
            <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700">
              Good fit examples: vocabulary lists, product feeds, simple export files, repeated records from
              business systems.
            </div>
          </section>

          <section id="record-nodes" className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. How Record Nodes Become Rows</h2>
            <p className="text-gray-600 mb-4">
              The converter looks for repeating sibling nodes and scores them as possible record candidates.
              Once the right candidate is selected, each repeated element becomes one output row.
            </p>
            <div className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto">
              <pre className="text-sm">{`<words>
  <row><word>Tell</word><meaning>告诉</meaning></row>
  <row><word>These</word><meaning>这些</meaning></row>
</words>`}</pre>
            </div>
            <p className="text-gray-600 mt-4">
              In this case, `row` is the record node. The output CSV would usually have columns like `word`
              and `meaning`.
            </p>
          </section>

          <section id="nested-values" className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. What Happens to Nested Values</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="border border-gray-200 rounded-lg p-5">
                <h3 className="font-semibold text-gray-900 mb-2">Simple Child Tags</h3>
                <p className="text-sm text-gray-600">
                  Direct child elements normally become plain CSV columns.
                </p>
              </div>
              <div className="border border-gray-200 rounded-lg p-5">
                <h3 className="font-semibold text-gray-900 mb-2">Nested Objects</h3>
                <p className="text-sm text-gray-600">
                  Deeply nested nodes are flattened into column paths so they can fit into a table.
                </p>
              </div>
              <div className="border border-gray-200 rounded-lg p-5">
                <h3 className="font-semibold text-gray-900 mb-2">Attributes</h3>
                <p className="text-sm text-gray-600">
                  XML attributes can be preserved as extra columns during flattening.
                </p>
              </div>
              <div className="border border-gray-200 rounded-lg p-5">
                <h3 className="font-semibold text-gray-900 mb-2">Repeated Leaf Nodes</h3>
                <p className="text-sm text-gray-600">
                  Repeated simple values may become numbered columns when needed.
                </p>
              </div>
            </div>
          </section>

          <section id="workflow" className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Recommended Conversion Workflow</h2>
            <div className="space-y-4 text-gray-700">
              <div className="flex gap-4">
                <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-semibold text-sm">1</span>
                <p>Upload the XML file into the combined CSV XML converter.</p>
              </div>
              <div className="flex gap-4">
                <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-semibold text-sm">2</span>
                <p>Select the detected record node that best matches one logical row of data.</p>
              </div>
              <div className="flex gap-4">
                <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-semibold text-sm">3</span>
                <p>Choose CSV as the output format and download the generated file.</p>
              </div>
              <div className="flex gap-4">
                <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-semibold text-sm">4</span>
                <p>Open the CSV in Excel or Sheets to confirm the columns match the intended structure.</p>
              </div>
            </div>
          </section>

          <section id="issues" className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Common Issues</h2>
            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Everything lands in one column</h3>
                <p className="text-sm text-gray-600">
                  This usually means the XML content was treated as plain text instead of being parsed by record
                  nodes, or the wrong node was selected as the row source.
                </p>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Unexpected extra columns</h3>
                <p className="text-sm text-gray-600">
                  Repeated values or inconsistent child tags across records can create additional flattened columns.
                </p>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Different XML files behave differently</h3>
                <p className="text-sm text-gray-600">
                  XML is flexible, so two files can have very different shapes. Record detection helps, but
                  more nested or irregular XML may still flatten differently than simple list-style XML.
                </p>
              </div>
            </div>
          </section>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8 mt-12">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Try the Combined CSV XML Converter</h2>
            <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
              Convert XML to CSV or CSV to XML in one place, with browser-based processing and no file upload to a server.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/tools/format-converter/csv-xml-converter"
                className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <ArrowRight className="w-5 h-5" />
                Open Converter
              </Link>
              <Link
                href="/tutorials/what-is-xml-format"
                className="inline-flex items-center justify-center gap-2 border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Learn XML Basics
              </Link>
            </div>
            <div className="mt-6 flex items-center justify-center gap-2 text-sm text-green-700">
              <CheckCircle className="w-4 h-4" />
              <span>Works well for repeated record-style XML files</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
