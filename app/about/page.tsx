import React from 'react';
import Link from 'next/link';
import { Zap, Shield, Smartphone } from 'lucide-react';
import { PageCard, PageShell } from '@/components/PageShell';

export const metadata = {
  alternates: { canonical: '/about/' },
  title: 'CSV File Processor & Big Data Analysis Tool | About CSVFilters',
  description: 'Discover our powerful CSV file processor designed for big CSV file analysis, data filtering, and large file processing. Professional online CSV analysis tool.',
  keywords: 'csv file processor, big csv file analysis, large csv files, csv data processing, csv analysis tool, online csv processor, csv big data',
};

export default function AboutPage() {
  return (
    <PageShell
      title="About CSVFilters"
      description="Professional CSV file processor and big data analysis tool designed for handling large CSV files with ease."
    >
      <PageCard className="space-y-4">
        <h2 className="text-2xl font-semibold">A browser workspace for CSV tasks</h2>
        <p className="text-gray-700 leading-7">CSVFilters brings CSV previewing, filtering, splitting, merging, validation, and format conversion into a browser workspace. It is maintained by the GitHub account beyondxuchao. The website source and issue tracker are public.</p>
        <p className="text-gray-700 leading-7">The standard tools process your selected files on your device. Practical file-size limits depend on browser memory, file structure, and the operation. Keep your original files and verify exported values before using them in production. The optional AI assistant requires a local helper and is not a hosted chat service.</p>
        <p className="text-gray-700 leading-7">The website also uses third-party analytics and includes advertising code. Read the privacy policy for details about website usage data.</p>
        <div className="flex flex-wrap gap-5 text-blue-700 underline">
          <a href="https://github.com/beyondxuchao/bigcsv.github.io">Source code</a>
          <Link href="/contact/">Contact the maintainer</Link>
          <Link href="/privacy/">Privacy Policy</Link>
        </div>
      </PageCard>
      <PageCard>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-3">
              <Shield className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Privacy First</h3>
            <p className="text-sm text-gray-600">
              Standard file tools process files in your browser. See our privacy policy for analytics and optional AI data flows.
            </p>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mb-3">
              <Zap className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Big Data Processing</h3>
            <p className="text-sm text-gray-600">
              Optimized for <strong>large CSV file</strong> processing with intelligent data handling
              and real-time <strong>big CSV file analysis</strong>.
            </p>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-100 rounded-full mb-3">
              <Smartphone className="h-6 w-6 text-orange-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Responsive Design</h3>
            <p className="text-sm text-gray-600">
              Works seamlessly across all devices and screen sizes for optimal user experience.
            </p>
          </div>
        </div>
      </PageCard>
    </PageShell>
  );
}
