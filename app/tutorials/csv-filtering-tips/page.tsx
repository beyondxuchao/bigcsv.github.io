import { Metadata } from 'next'
import { Clock, User } from 'lucide-react'
import TutorialHeader from '@/components/TutorialHeader'

export const metadata: Metadata = {
  alternates: { canonical: '/tutorials/csv-filtering-tips/' },
  title: 'CSV File Filtering and Screening Tips - CSVFilters Advanced Tutorial',
  description: 'Master advanced CSV file filtering techniques, learn how to quickly screen data, set complex conditions, and improve data analysis efficiency. Suitable for data analysts and business professionals.',
  keywords: 'CSV filtering, data screening, CSV query, data filter, CSV search, conditional filtering, data analysis techniques',
  openGraph: {
    title: 'CSV File Filtering and Screening Tips - CSVFilters',
    description: 'Professional guide: Master advanced CSV file filtering and screening techniques',
    type: 'article',
  },
}

export default function CSVFilteringTipsPage() {
  const breadcrumbItems = [
    { label: 'Tutorials', href: '/tutorials' }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <TutorialHeader 
        title="CSV File Filtering and Screening Tips"
        showBackButton={true}
        showBreadcrumb={true}
        breadcrumbItems={breadcrumbItems}
      />
      
      <div className="container mx-auto px-4 py-8">
        {/* Article Header */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
              Basic Tutorial
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
            <span>Published: 2025-08-24</span>
          </div>
          
          <p className="text-xl text-gray-700 leading-relaxed">
            Master advanced CSV file filtering techniques to quickly screen data, set complex conditions, and improve data analysis efficiency. Perfect for data analysts and business professionals.
          </p>
        </div>

        {/* Article Content */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="prose prose-lg max-w-none">
            <p>Content will be restored shortly...</p>
          </div>
        </div>
      </div>
    </div>
  )
}