export const metadata = { alternates: { canonical: '/tools/' } };
import React from 'react';
import { ArrowRight, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PageCard, PageShell } from '@/components/PageShell';

export default function ToolsPage() {
  const tools = [
    {
      id: 'ai-csv-assistant',
      title: 'AI CSV Assistant',
      description:
        'Chat with CSV files through a local-first helper that can download a GGUF model and route prompts into llama.cpp',
      icon: 'AI',
      href: '/tools/ai-csv-assistant',
      status: 'available',
    },
    {
      id: 'format-converter',
      title: 'Format Converter',
      description:
        'Convert between JSON, CSV, TSV, XML, and XLSX formats with specialized converters for each format combination',
      icon: 'Convert',
      href: '/tools/format-converter',
      status: 'available',
    },
    {
      id: 'csv-xml-converter',
      title: 'CSV XML Converter',
      description:
        'Convert CSV to XML or XML to CSV in one place with record-node detection, custom XML tags, and spreadsheet-ready output',
      icon: 'CSV↔XML',
      href: '/tools/format-converter/csv-xml-converter',
      status: 'available',
    },
    {
      id: 'excel-template-generator',
      title: 'Excel Template Generator',
      description:
        'Generate multiple Excel files by merging template with data rows. Perfect for creating personalized documents, certificates, or reports',
      icon: 'Excel',
      href: '/tools/excel-template-generator',
      status: 'available',
    },
    {
      id: 'csv-splitter',
      title: 'CSV Splitter',
      description: 'Split large CSV files by column values into multiple files',
      icon: 'Split',
      href: '/tools/csv-splitter',
      status: 'available',
    },
    {
      id: 'csv-merger',
      title: 'CSV Merger',
      description: 'Merge multiple CSV files with the same structure into a single file',
      icon: 'Merge',
      href: '/tools/csv-merger',
      status: 'available',
    },
    {
      id: 'encoding-converter',
      title: 'Encoding Converter',
      description:
        'Convert between UTF-8, GBK, GB2312, Big5, and other encodings with specialized converters and automatic detection',
      icon: 'Encoding',
      href: '/tools/encoding-converter',
      status: 'available',
    },
    {
      id: 'csv-validator',
      title: 'CSV Validator',
      description:
        'Validate CSV headers, row lengths, empty rows, duplicate columns, and other structural issues before import or conversion',
      icon: 'Validate',
      href: '/tools/csv-validator',
      status: 'available',
    },
  ];

  return (
    <PageShell
      title="Tools"
      description="Additional data processing tools to enhance your workflow"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool) => (
          <PageCard
            key={tool.id}
            className="p-6 hover:shadow-lg transition-shadow duration-300"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="text-lg font-semibold text-gray-500">{tool.icon}</div>
              {tool.status === 'available' && (
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                  Available
                </span>
              )}
            </div>

            <h3 className="text-xl font-semibold text-gray-900 mb-2">{tool.title}</h3>

            <p className="text-gray-600 mb-4 text-sm leading-relaxed">{tool.description}</p>

            <div className="flex justify-end">

                <Link href={tool.href}>
                  <Button className="flex items-center gap-2">
                    Use Tool
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>

            </div>
          </PageCard>
        ))}
      </div>

      <PageCard className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Need Guidance?</h2>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          Explore the built-in guides to learn practical CSV workflows and get more from the tools
          already available on this site.
        </p>
        <Link href="/tutorials">
          <Button variant="outline" className="flex items-center gap-2 mx-auto">
            <BookOpen className="h-4 w-4" />
            Browse Tutorials
          </Button>
        </Link>
      </PageCard>
    </PageShell>
  );
}
