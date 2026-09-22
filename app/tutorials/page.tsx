import { Metadata } from 'next';
import Link from 'next/link';
import { Clock, User, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageCard, PageShell } from '@/components/PageShell';

export const metadata: Metadata = {
  alternates: { canonical: '/tutorials/' },
  title: 'CSV and XML Tutorials - CSVFilters Online Tool Guide',
  description:
    'Learn how to work with CSV, XML, JSON, TSV, and spreadsheet conversion tools. Explore format guides, converter walkthroughs, and practical data processing tutorials.',
  keywords:
    'CSV tutorials, XML tutorials, csv to xml, xml to csv, data conversion guides, online CSV tools, XML format guide',
  openGraph: {
    title: 'CSV and XML Tutorials - CSVFilters',
    description: 'Practical tutorials for CSV processing, XML conversion, and data workflow improvements',
    type: 'website',
  },
};

interface Tutorial {
  id: string;
  title: string;
  description: string;
  readTime: string;
  author: string;
  publishDate: string;
  category: string;
  slug: string;
}

const tutorials: Tutorial[] = [
  {
    id: '1',
    title: 'How to Open and Process Large CSV Files',
    description:
      'Learn how to efficiently open and process CSV files larger than 100MB, avoiding memory overflow and performance issues.',
    readTime: '8 min read',
    author: 'CSVFilters Team',
    publishDate: '2025-08-25',
    category: 'Basic Tutorial',
    slug: 'large-csv-files',
  },
  {
    id: '2',
    title: 'CSV File Filtering and Screening Techniques',
    description:
      'Master advanced filtering techniques to quickly screen the information you need from large amounts of data and improve data analysis efficiency.',
    readTime: '6 min read',
    author: 'CSVFilters Team',
    publishDate: '2025-08-24',
    category: 'Advanced Tips',
    slug: 'csv-filtering-tips',
  },
  {
    id: '3',
    title: 'CSV Data Analysis Beginner Guide',
    description:
      'Learn CSV data analysis from scratch, including data cleaning, statistical analysis, and visualization fundamentals.',
    readTime: '10 min read',
    author: 'CSVFilters Team',
    publishDate: '2025-08-23',
    category: 'Data Analysis',
    slug: 'csv-analysis-guide',
  },
  {
    id: '4',
    title: 'Complete JSON to CSV Conversion Guide',
    description:
      'Learn how to convert JSON data to CSV format in detail, including manual conversion, online tool usage, programming implementation and best practices.',
    readTime: '10 min read',
    author: 'CSVFilters Team',
    publishDate: '2025-08-22',
    category: 'Data Conversion',
    slug: 'json-to-csv-guide',
  },
  {
    id: '5',
    title: 'CSV Splitter Complete Guide',
    description:
      'Learn how to split CSV files using column-based splitting and row-based splitting. Master both one-to-many and large-to-small splitting techniques.',
    readTime: '6 min read',
    author: 'CSVFilters Team',
    publishDate: '2025-08-26',
    category: 'Tool Guide',
    slug: 'csv-splitter-guide',
  },
  {
    id: '6',
    title: 'CSV Merger Complete Guide',
    description:
      'Learn how to merge multiple CSV files with identical structures. Master template validation, header preservation, and efficient data combination techniques.',
    readTime: '5 min read',
    author: 'CSVFilters Team',
    publishDate: '2025-08-27',
    category: 'Tool Guide',
    slug: 'csv-merger-guide',
  },
  {
    id: '7',
    title: 'What is TSV Format? Complete Guide to Tab-Separated Values Files',
    description:
      'Learn everything about TSV format: what it is, how it differs from CSV, how to open TSV files, and best practices for tab-delimited data.',
    readTime: '6 min read',
    author: 'CSVFilters Team',
    publishDate: '2025-01-20',
    category: 'File Format Guide',
    slug: 'what-is-tsv-format',
  },
  {
    id: '8',
    title: 'Free Online TSV to CSV Converter Guide',
    description:
      'Convert TSV files to CSV format instantly with our free online converter. Learn step-by-step conversion, troubleshooting tips, and best practices.',
    readTime: '5 min read',
    author: 'CSVFilters Team',
    publishDate: '2025-01-20',
    category: 'Data Conversion',
    slug: 'tsv-to-csv-converter',
  },
  {
    id: '9',
    title: 'What is JSON Format? Complete JSON Guide',
    description:
      'Deep dive into JSON file format: definition, syntax, features, use cases and best practices for data exchange and storage.',
    readTime: '8 min read',
    author: 'CSVFilters Team',
    publishDate: '2025-01-20',
    category: 'File Format Guide',
    slug: 'what-is-json-format',
  },
  {
    id: '10',
    title: 'What is CSV Format? Complete CSV Guide',
    description:
      'Deep dive into CSV file format: definition, structure, features, use cases and best practices for creating, editing and using CSV files.',
    readTime: '10 min read',
    author: 'CSVFilters Team',
    publishDate: '2025-01-20',
    category: 'File Format Guide',
    slug: 'what-is-csv-format',
  },
  {
    id: '11',
    title: 'What is XML? Complete Guide to XML Format',
    description:
      'Learn what XML is, how tags and attributes work, where XML is still used today, and how it differs from CSV and JSON in practical workflows.',
    readTime: '8 min read',
    author: 'CSVFilters Team',
    publishDate: '2026-05-14',
    category: 'File Format Guide',
    slug: 'what-is-xml-format',
  },
  {
    id: '12',
    title: 'How to Convert XML to CSV',
    description:
      'Understand how XML record nodes become rows, how nested values flatten into columns, and how to get spreadsheet-ready CSV from XML files.',
    readTime: '7 min read',
    author: 'CSVFilters Team',
    publishDate: '2026-05-14',
    category: 'Data Conversion',
    slug: 'xml-to-csv-guide',
  },

  {
    id: '13',
    title: 'How to Open a Large CSV File Without Excel Crashing',
    description:
      'Learn what to do when Excel freezes, crashes, or cannot open a large CSV file, and how to preview and filter large datasets safely.',
    readTime: '7 min read',
    author: 'CSVFilters Team',
    publishDate: '2026-06-20',
    category: 'Large CSV Guide',
    slug: 'open-large-csv-without-excel',
  },
  {
    id: '14',
    title: 'CSV to Excel Conversion Guide',
    description:
      'Convert CSV to XLSX safely while avoiding broken dates, lost leading zeros, scientific notation, and encoding problems.',
    readTime: '8 min read',
    author: 'CSVFilters Team',
    publishDate: '2026-06-20',
    category: 'Data Conversion',
    slug: 'csv-to-excel-conversion-guide',
  },
  {
    id: '15',
    title: 'How to Combine Multiple CSV Files Into One',
    description:
      'Learn how to combine multiple CSV files, validate headers, avoid duplicate header rows, and keep merged data clean.',
    readTime: '7 min read',
    author: 'CSVFilters Team',
    publishDate: '2026-06-20',
    category: 'Workflow Guide',
    slug: 'combine-multiple-csv-files',
  },
  {
    id: '16',
    title: 'CSV File Repair Guide',
    description:
      'Validate and fix broken CSV files with malformed rows, broken quotes, delimiter issues, and encoding problems.',
    readTime: '8 min read',
    author: 'CSVFilters Team',
    publishDate: '2026-06-20',
    category: 'Data Quality Guide',
    slug: 'csv-file-repair-and-validation',
  },
  {
    id: '17',
    title: 'CSV to JSON Guide for API and Web App Workflows',
    description:
      'Convert CSV to JSON for APIs, imports, automation, and web apps while choosing the right JSON output shape.',
    readTime: '7 min read',
    author: 'CSVFilters Team',
    publishDate: '2026-06-20',
    category: 'Developer Guide',
    slug: 'csv-to-json-api-guide',
  },
];

const categories = [
  'All',
  'Basic Tutorial',
  'Advanced Tips',
  'Data Analysis',
  'Data Conversion',
  'Tool Guide',
  'File Format Guide',
  'Large CSV Guide',
  'Workflow Guide',
  'Data Quality Guide',
  'Developer Guide',
];

export default function TutorialsPage() {
  return (
    <PageShell
      title="CSV and XML Tutorials"
      description="Learn how to process CSV and XML files, master data conversion workflows, and improve your day-to-day file handling"
    >
      <div className="flex flex-wrap justify-center gap-4">
        {categories.map((category) => (
          <button
            key={category}
            className={`px-6 py-2 rounded-full transition-colors ${
              category === 'All'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-blue-50'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tutorials.map((tutorial) => (
          <Link
            key={tutorial.id}
            href={`/tutorials/${tutorial.slug}`}
            className="group"
          >
            <PageCard className="p-6 h-full hover:shadow-lg transition-all duration-300">
              <div className="flex items-center gap-2 mb-3">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                  {tutorial.category}
                </span>
              </div>

              <h2 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                {tutorial.title}
              </h2>

              <p className="text-gray-600 mb-4 line-clamp-3">
                {tutorial.description}
              </p>

              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{tutorial.readTime}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    <span>{tutorial.author}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">{tutorial.publishDate}</span>
                <ArrowRight className="w-5 h-5 text-blue-600 group-hover:translate-x-1 transition-transform" />
              </div>
            </PageCard>
          </Link>
        ))}
      </div>

      <PageCard className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Start Using CSVFilters
        </h2>
        <p className="text-gray-600 mb-6">
          Explore the format conversion tools directly in your browser with no installation required
        </p>
        <Link href="/tools">
          <Button className="inline-flex items-center gap-2">
            Get Started
            <ArrowRight className="w-5 h-5" />
          </Button>
        </Link>
      </PageCard>
    </PageShell>
  );
}
