import Link from 'next/link'
import { ArrowLeft, Home } from 'lucide-react'

interface TutorialHeaderProps {
  title: string
  description?: string
  showBackButton?: boolean
  backUrl?: string
  showBreadcrumb?: boolean
  breadcrumbItems?: Array<{ label: string; href: string }>
}

export default function TutorialHeader({
  title,
  description,
  showBackButton = false,
  backUrl = '/tutorials',
  showBreadcrumb = false,
  breadcrumbItems = []
}: TutorialHeaderProps) {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        {showBreadcrumb && breadcrumbItems.length > 0 && (
          <nav className="mb-6">
            <ol className="flex items-center space-x-2 text-sm text-gray-600">
              <li>
                <Link href="/" className="flex items-center hover:text-blue-600 transition-colors">
                  <Home className="w-4 h-4 mr-1" />
                  Home
                </Link>
              </li>
              {breadcrumbItems.map((item, index) => (
                <li key={index} className="flex items-center">
                  <span className="mx-2">/</span>
                  <Link 
                    href={item.href} 
                    className="hover:text-blue-600 transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li className="flex items-center">
                <span className="mx-2">/</span>
                <span className="text-gray-900 font-medium">{title}</span>
              </li>
            </ol>
          </nav>
        )}

        {/* Back Button */}
        {showBackButton && (
          <div className="mb-6">
            <Link 
              href={backUrl}
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Tutorials
            </Link>
          </div>
        )}

        {/* Header Content */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {title}
          </h1>
          {description && (
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {description}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}