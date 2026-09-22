import Link from 'next/link'
import { Clock, User, ArrowRight, CheckCircle, AlertTriangle, Lightbulb, Search } from 'lucide-react'
import TutorialHeader from '@/components/TutorialHeader'

export interface SeoArticleSection {
  title: string
  body: string[]
  bullets?: string[]
  tone?: string
}

export interface SeoArticleFaq {
  question: string
  answer: string
}

interface SeoTutorialArticleProps {
  title: string
  category: string
  readTime: string
  publishDate: string
  intro: string
  primaryKeyword: string
  secondaryKeywords: string[]
  searchIntent: string
  sections: SeoArticleSection[]
  faqs: SeoArticleFaq[]
  cta: {
    title: string
    description: string
    href: string
    label: string
  }
  related: Array<{
    title: string
    description: string
    href: string
  }>
}

const toneClasses = {
  blue: 'bg-blue-50 border-blue-200 text-blue-800',
  green: 'bg-green-50 border-green-200 text-green-800',
  yellow: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  red: 'bg-red-50 border-red-200 text-red-800',
  purple: 'bg-purple-50 border-purple-200 text-purple-800',
}

export default function SeoTutorialArticle({
  title,
  category,
  readTime,
  publishDate,
  intro,
  primaryKeyword,
  secondaryKeywords,
  searchIntent,
  sections,
  faqs,
  cta,
  related,
}: SeoTutorialArticleProps) {
  const breadcrumbItems = [{ label: 'Tutorials', href: '/tutorials' }]

  return (
    <div className="min-h-screen bg-gray-50">
      <TutorialHeader
        title={title}
        showBackButton={true}
        showBreadcrumb={true}
        breadcrumbItems={breadcrumbItems}
      />

      <main className="container mx-auto px-4 py-8">
        <article>
          <header className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                {category}
              </span>
              <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                SEO guide
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 mb-6">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{readTime}</span>
              </div>
              <div className="flex items-center gap-1">
                <User className="w-4 h-4" />
                <span>Author: CSVFilters Team</span>
              </div>
              <span>Published: {publishDate}</span>
            </div>

            <p className="text-xl text-gray-700 leading-relaxed mb-6">{intro}</p>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="border border-blue-200 bg-blue-50 rounded-lg p-4">
                <div className="flex items-center gap-2 text-blue-900 font-semibold mb-2">
                  <Search className="w-4 h-4" />
                  Main keyword
                </div>
                <p className="text-blue-800">{primaryKeyword}</p>
              </div>
              <div className="border border-gray-200 bg-gray-50 rounded-lg p-4">
                <div className="text-gray-900 font-semibold mb-2">Search intent</div>
                <p className="text-gray-700">{searchIntent}</p>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {secondaryKeywords.map((keyword) => (
                <span key={keyword} className="px-3 py-1 bg-white border border-gray-200 text-gray-700 text-sm rounded-full">
                  {keyword}
                </span>
              ))}
            </div>
          </header>

          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="prose prose-lg max-w-none">
              {sections.map((section, index) => {
                const tone = section.tone && section.tone in toneClasses ? (section.tone as keyof typeof toneClasses) : 'blue'
                return (
                  <section key={section.title} className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">{section.title}</h2>
                    {section.body.map((paragraph) => (
                      <p key={paragraph} className="text-gray-700 mb-4">{paragraph}</p>
                    ))}
                    {section.bullets ? (
                      <div className={`border rounded-lg p-5 ${toneClasses[tone]}`}>
                        <div className="flex items-start gap-3">
                          {tone === 'red' ? (
                            <AlertTriangle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                          ) : tone === 'yellow' ? (
                            <Lightbulb className="w-5 h-5 mt-0.5 flex-shrink-0" />
                          ) : (
                            <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                          )}
                          <ul className="space-y-2 text-sm">
                            {section.bullets.map((bullet) => (
                              <li key={bullet}>{bullet}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ) : null}
                    {index === 1 ? (
                      <div className="my-8 rounded-xl border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Use CSVFilters for this workflow</h3>
                        <p className="text-gray-700 mb-4">
                          CSVFilters keeps common CSV tasks in one place: open large files, filter rows, convert formats, validate data, and export clean results without manually stitching tools together.
                        </p>
                        <Link href={cta.href} className="inline-flex items-center gap-2 text-blue-700 font-semibold hover:text-blue-800">
                          {cta.label}
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    ) : null}
                  </section>
                )
              })}

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
                <div className="space-y-4">
                  {faqs.map((faq) => (
                    <div key={faq.question} className="border border-gray-200 rounded-lg p-5">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{faq.question}</h3>
                      <p className="text-gray-700">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </section>

              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-6 text-center">
                <h2 className="text-white text-2xl font-bold mb-2">{cta.title}</h2>
                <p className="text-blue-100 mb-4">{cta.description}</p>
                <Link href={cta.href} className="inline-flex items-center gap-2 bg-white text-blue-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                  {cta.label}
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </article>

        <section className="mt-8 bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Related CSV tutorials</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {related.map((item) => (
              <Link key={item.href} href={item.href} className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all">
                <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.description}</p>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
