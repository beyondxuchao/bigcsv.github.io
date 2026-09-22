import React from 'react';
import { Metadata } from 'next';
import dynamic from 'next/dynamic';

const CsvValidator = dynamic(() => import('@/components/CsvValidator'), {
  loading: () => <div className="max-w-7xl mx-auto text-sm text-gray-500">Loading validator...</div>,
});

export const metadata: Metadata = {
  alternates: { canonical: '/tools/csv-validator/' },
  title: 'CSV Validator | Check CSV Headers, Rows, and Column Consistency',
  description:
    'Free online CSV validator to detect duplicate headers, blank columns, inconsistent row lengths, empty rows, and other structural CSV issues before import or conversion.',
  keywords:
    'csv validator, validate csv, csv checker, csv header validation, csv row validation, csv file validator, online csv validator',
  openGraph: {
    title: 'CSV Validator Tool',
    description: 'Validate CSV structure online before import, analysis, or conversion',
    type: 'website',
  },
};

export default function CsvValidatorPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <CsvValidator />
      </div>
    </div>
  );
}
