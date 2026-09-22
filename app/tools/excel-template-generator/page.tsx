import React from 'react';
import { Metadata } from 'next';
import dynamic from 'next/dynamic';

const ExcelTemplateGenerator = dynamic(() => import('@/components/ExcelTemplateGenerator'), {
  loading: () => <div className="max-w-7xl mx-auto text-sm text-gray-500">Loading generator...</div>,
});

export const metadata: Metadata = {
  alternates: { canonical: '/tools/excel-template-generator/' },
  title: 'Excel Template Generator | Generate Multiple Files from Template and Data',
  description: 'Free online Excel template generator tool to create multiple Excel files by merging template with data rows. Upload template and data files to generate customized documents automatically.',
  keywords: 'excel template generator, excel automation, template merge, data to excel, excel file generator, batch excel creation, excel template tool',
  openGraph: {
    title: 'Excel Template Generator - Create Multiple Files from Template',
    description: 'Free online tool to generate multiple Excel files by merging template with data rows',
    type: 'website',
  },
};

export default function ExcelTemplateGeneratorPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <ExcelTemplateGenerator />
      </div>
    </div>
  );
}
