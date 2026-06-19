import { Metadata } from 'next';
import Link from 'next/link';
import { CalendarDays, Wrench, BookOpen, ArrowRight, Sparkles } from 'lucide-react';
import { PageCard, PageShell } from '@/components/PageShell';

export const metadata: Metadata = {
  title: 'Product Updates - CSVFilters',
  description:
    'See the latest CSVFilters updates, including new tools, validation improvements, editing features, tutorial additions, and SEO improvements.',
  keywords:
    'csvfilters updates, product updates, csv validator updates, csv editor updates, xml csv converter updates, feature updates',
  openGraph: {
    title: 'Product Updates - CSVFilters',
    description: 'Latest improvements, releases, and content updates across CSVFilters',
    type: 'website',
  },
};

const today = '2026-05-15';

export default function UpdatesPage() {
  return (
    <PageShell
      title="Product Updates"
      description="Recent feature work, validation improvements, editor enhancements, and content updates across CSVFilters"
    >
      <PageCard className="space-y-6">
        <div className="flex items-center gap-3">
          <CalendarDays className="w-5 h-5 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">Update for {today}</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="rounded-lg border border-gray-200 p-5">
            <div className="flex items-center gap-2 mb-3">
              <Wrench className="w-5 h-5 text-emerald-600" />
              <h3 className="font-semibold text-gray-900">New Tool and Validation Work</h3>
            </div>
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-2">
              <li>Added a new `CSV Validator` tool with structural checks for headers, row lengths, empty rows, and trailing empty columns.</li>
              <li>Added custom cleaning options so users can repair common CSV issues before downloading a cleaned file.</li>
              <li>Added a sample problem CSV file for validator testing and debugging.</li>
            </ul>
          </div>

          <div className="rounded-lg border border-gray-200 p-5">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-amber-600" />
              <h3 className="font-semibold text-gray-900">Viewer and Editor Improvements</h3>
            </div>
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-2">
              <li>Added first-version inline editing to the homepage CSV preview table.</li>
              <li>Users can now rename headers, edit cell values, add rows, and delete rows directly in the preview.</li>
              <li>Improved empty-cell editing so newly added rows can be edited immediately.</li>
            </ul>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="rounded-lg border border-gray-200 p-5">
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-gray-900">Previous XML and Tutorial Work</h3>
            </div>
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-2">
              <li>Merged `CSV to XML` and `XML to CSV` into one combined converter page.</li>
              <li>Added new XML tutorials and updated tutorial discovery paths.</li>
              <li>Kept older XML converter routes as redirect pages for continuity and SEO cleanup.</li>
            </ul>
          </div>

          <div className="rounded-lg bg-blue-50 border border-blue-200 p-5">
            <h3 className="font-semibold text-blue-900 mb-2">Navigation and Discovery</h3>
            <p className="text-sm text-blue-800 leading-6">
              Surfaced `CSV Validator`, the XML/CSV combined converter, and the new updates page more clearly through
              the site navigation and tools index so users can discover new workflows faster.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/tools/csv-validator"
            className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowRight className="w-4 h-4" />
            Open CSV Validator
          </Link>
          <Link
            href="/tools/format-converter/csv-xml-converter"
            className="inline-flex items-center justify-center gap-2 border border-gray-300 text-gray-700 px-5 py-3 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Open CSV XML Converter
          </Link>
        </div>
      </PageCard>
    </PageShell>
  );
}
