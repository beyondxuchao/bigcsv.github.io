import { Metadata } from 'next'
import Link from 'next/link'
import { Clock, User, BarChart3, TrendingUp, PieChart, Calculator } from 'lucide-react'
import TutorialHeader from '@/components/TutorialHeader'

export const metadata: Metadata = {
  alternates: { canonical: '/tutorials/csv-analysis-guide/' },
  title: 'CSV Data Analysis Beginner\'s Guide - CSVFilters Data Analysis Tutorial',
  description: 'Learn CSV data analysis from scratch, including data cleaning, statistical analysis, trend identification, and visualization basics. Complete guide for beginners and business analysts.',
  keywords: 'CSV data analysis, data statistics, data cleaning, trend analysis, CSV visualization, data mining, business analysis',
  openGraph: {
    title: 'CSV Data Analysis Beginner\'s Guide - CSVFilters',
    description: 'Complete CSV data analysis tutorial from basics to advanced',
    type: 'article',
  },
}

export default function CSVAnalysisGuidePage() {
  const breadcrumbItems = [
    { label: 'Tutorials', href: '/tutorials' }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <TutorialHeader 
        title="CSV Data Analysis Beginner's Guide"
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
            <span>Published: 2025-08-23</span>
          </div>
          
          <p className="text-xl text-gray-700 leading-relaxed">
            Data analysis is at the core of modern business decision-making. This guide will take you from zero to learning CSV data analysis,
            mastering the basic skills of data cleaning, statistical analysis, and trend identification.
          </p>
        </div>

        {/* Article Content */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="prose prose-lg max-w-none">
            {/* Data Analysis Fundamentals */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <BarChart3 className="w-6 h-6 text-blue-600" />
                Data Analysis Fundamentals
              </h2>
              <p className="text-gray-700 mb-4">
                Before starting to analyze CSV data, let&apos;s understand some basic concepts:
              </p>
              
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-blue-900 mb-3">Descriptive Statistics</h3>
                  <ul className="text-blue-800 space-y-2 text-sm">
                    <li>• <strong>Mean</strong>: Average value of the data</li>
                    <li>• <strong>Median</strong>: Middle value when sorted</li>
                    <li>• <strong>Mode</strong>: Most frequently occurring value</li>
                    <li>• <strong>Standard Deviation</strong>: Measure of data dispersion</li>
                  </ul>
                </div>
                
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-green-900 mb-3">Data Types</h3>
                  <ul className="text-green-800 space-y-2 text-sm">
                    <li>• <strong>Numerical</strong>: Can perform mathematical operations</li>
                    <li>• <strong>Categorical</strong>: Represents categories or labels</li>
                    <li>• <strong>Temporal</strong>: Date and time data</li>
                    <li>• <strong>Text</strong>: Strings and descriptive information</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Data Cleaning */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Step 1: Data Cleaning</h2>
              <p className="text-gray-700 mb-4">
                Data cleaning is the first step in analysis. Ensuring data quality is key to obtaining accurate results:
              </p>
              
              <div className="space-y-6">
                <div className="border-l-4 border-red-400 pl-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">1. Identify and Handle Missing Values</h3>
                  <p className="text-gray-700 mb-3">Missing values can affect analysis results and need to be handled properly:</p>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold mb-2">Handling Strategies:</h4>
                    <ul className="text-sm space-y-1">
                      <li>• <strong>Delete</strong>: If missing values are few and randomly distributed</li>
                      <li>• <strong>Fill</strong>: Fill with mean, median, or mode</li>
                      <li>• <strong>Interpolate</strong>: Estimate missing values based on adjacent data</li>
                      <li>• <strong>Mark</strong>: Treat missing values as a special category</li>
                    </ul>
                  </div>
                </div>
                
                <div className="border-l-4 border-orange-400 pl-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">2. Detect and Handle Outliers</h3>
                  <p className="text-gray-700 mb-3">Outliers may be erroneous data or important discoveries:</p>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold mb-2">Detection Methods:</h4>
                    <ul className="text-sm space-y-1">
                      <li>• <strong>Box Plot Method</strong>: Identify values beyond 1.5 times the interquartile range</li>
                      <li>• <strong>Z-score Method</strong>: Values with absolute value greater than 3 after standardization</li>
                      <li>• <strong>Business Rules</strong>: Judgment based on domain knowledge</li>
                    </ul>
                  </div>
                </div>
                
                <div className="border-l-4 border-green-400 pl-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">3. Data Format Standardization</h3>
                  <p className="text-gray-700 mb-3">Unify data formats for easier subsequent analysis:</p>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold mb-2">Common Operations:</h4>
                    <ul className="text-sm space-y-1">
                      <li>• <strong>Date Format</strong>: Standardize to YYYY-MM-DD format</li>
                      <li>• <strong>Text Cleaning</strong>: Remove extra spaces, standardize case</li>
                      <li>• <strong>Number Format</strong>: Remove currency symbols and thousand separators</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Exploratory Data Analysis */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-green-600" />
                Step 2: Exploratory Data Analysis
              </h2>
              
              <p className="text-gray-700 mb-6">
                Understand the basic characteristics and distribution patterns of data through exploratory analysis:
              </p>
              
              <div className="grid md:grid-cols-3 gap-6 mb-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center gap-2">
                    <Calculator className="w-5 h-5" />
                    Basic Statistics
                  </h3>
                  <ul className="text-blue-800 space-y-2 text-sm">
                    <li>• Calculate mean and median</li>
                    <li>• View maximum and minimum values</li>
                    <li>• Analyze data distribution</li>
                    <li>• Calculate correlation coefficients</li>
                  </ul>
                </div>
                
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-green-900 mb-3 flex items-center gap-2">
                    <PieChart className="w-5 h-5" />
                    Group Analysis
                  </h3>
                  <ul className="text-green-800 space-y-2 text-sm">
                    <li>• Group statistics by category</li>
                    <li>• Calculate proportions of each group</li>
                    <li>• Compare differences between groups</li>
                    <li>• Identify important patterns</li>
                  </ul>
                </div>
                
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-purple-900 mb-3 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Trend Analysis
                  </h3>
                  <ul className="text-purple-800 space-y-2 text-sm">
                    <li>• Time series analysis</li>
                    <li>• Seasonal patterns</li>
                    <li>• Growth rate calculation</li>
                    <li>• Trend forecasting</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Practical Analysis Techniques */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Practical Analysis Techniques</h2>
              
              <div className="space-y-6">
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6">
                  <h3 className="text-yellow-800 font-semibold mb-3">💡 Sales Data Analysis Example</h3>
                  <div className="text-yellow-700 space-y-2 text-sm">
                    <p><strong>Objective:</strong> Analyze monthly sales performance</p>
                    <p><strong>Steps:</strong></p>
                    <ol className="list-decimal list-inside space-y-1 ml-4">
                      <li>Group by month and calculate total sales</li>
                      <li>Calculate monthly growth rate</li>
                      <li>Identify sales peaks and valleys</li>
                      <li>Analyze product category contributions</li>
                      <li>Find top customers and products</li>
                    </ol>
                  </div>
                </div>
                
                <div className="bg-blue-50 border-l-4 border-blue-400 p-6">
                  <h3 className="text-blue-800 font-semibold mb-3">📊 User Behavior Analysis Example</h3>
                  <div className="text-blue-700 space-y-2 text-sm">
                    <p><strong>Objective:</strong> Understand user activity levels</p>
                    <p><strong>Steps:</strong></p>
                    <ol className="list-decimal list-inside space-y-1 ml-4">
                      <li>Calculate daily active users (DAU)</li>
                      <li>Analyze user retention rate</li>
                      <li>Identify user behavior patterns</li>
                      <li>Analyze churned user characteristics</li>
                      <li>Develop user segmentation strategy</li>
                    </ol>
                  </div>
                </div>
              </div>
            </section>

            {/* Analysis Functions */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Analysis Features in CSVFilters</h2>
              
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 px-4 py-2 text-left">Feature</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Description</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Use Cases</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 font-semibold">Sum Statistics</td>
                      <td className="border border-gray-300 px-4 py-2">Calculate the sum of numeric columns</td>
                      <td className="border border-gray-300 px-4 py-2">Sales totals, cost statistics</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 font-semibold">Average</td>
                      <td className="border border-gray-300 px-4 py-2">Calculate the average of numeric columns</td>
                      <td className="border border-gray-300 px-4 py-2">Average order value, average rating</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 font-semibold">Count Statistics</td>
                      <td className="border border-gray-300 px-4 py-2">Count the number of records</td>
                      <td className="border border-gray-300 px-4 py-2">Customer count, order quantity</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 font-semibold">Group Statistics</td>
                      <td className="border border-gray-300 px-4 py-2">Calculate by category grouping</td>
                      <td className="border border-gray-300 px-4 py-2">Statistics by region, by product category</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 font-semibold">Sort Analysis</td>
                      <td className="border border-gray-300 px-4 py-2">Sort by specified columns</td>
                      <td className="border border-gray-300 px-4 py-2">Top N analysis, ranking statistics</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* Writing Analysis Reports */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Step 3: Writing Analysis Reports</h2>
              
              <p className="text-gray-700 mb-4">
                A good analysis report should clearly communicate findings and recommendations:
              </p>
              
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-lg p-6">
                <h3 className="text-indigo-900 font-semibold mb-4">Report Structure Recommendations</h3>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <div className="bg-indigo-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">
                      1
                    </div>
                    <div>
                      <h4 className="font-semibold text-indigo-900">Executive Summary</h4>
                      <p className="text-indigo-700 text-sm">Brief overview of key findings and recommendations</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-indigo-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">
                      2
                    </div>
                    <div>
                      <h4 className="font-semibold text-indigo-900">Data Overview</h4>
                      <p className="text-indigo-700 text-sm">Describe data sources, time range, and quality</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-indigo-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">
                      3
                    </div>
                    <div>
                      <h4 className="font-semibold text-indigo-900">Key Findings</h4>
                      <p className="text-indigo-700 text-sm">Main insights supported by charts and data</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-indigo-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">
                      4
                    </div>
                    <div>
                      <h4 className="font-semibold text-indigo-900">Action Recommendations</h4>
                      <p className="text-indigo-700 text-sm">Specific recommendations based on analysis results</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Advanced Learning Path */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Advanced Learning Path</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <h3 className="text-green-900 font-semibold mb-3">📈 Advanced Statistical Analysis</h3>
                  <ul className="text-green-800 space-y-2 text-sm">
                    <li>• Regression analysis and predictive modeling</li>
                    <li>• Hypothesis testing and significance analysis</li>
                    <li>• Cluster analysis and classification algorithms</li>
                    <li>• Time series analysis</li>
                  </ul>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h3 className="text-blue-900 font-semibold mb-3">🎨 Data Visualization</h3>
                  <ul className="text-blue-800 space-y-2 text-sm">
                    <li>• Choosing appropriate chart types</li>
                    <li>• Designing effective dashboards</li>
                    <li>• Interactive visualization</li>
                    <li>• Data storytelling</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Summary */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Summary</h2>
              <p className="text-gray-700 mb-4">
                CSV data analysis is a systematic process, from data cleaning to exploratory analysis to report writing,
                every step is important. CSVFilters provides a complete toolchain to help you efficiently complete the entire analysis workflow.
              </p>
              <p className="text-gray-700">
                Remember: The goal of data analysis is not to showcase complex techniques, but to discover valuable insights
                that support business decisions. Practice more, think more, and you&apos;ll become a data analysis expert!
              </p>
            </section>

            {/* CTA */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg p-6 text-center">
              <h3 className="text-white text-xl font-bold mb-2">Start Your Data Analysis Journey</h3>
              <p className="text-purple-100 mb-4">Upload your CSV file and experience professional data analysis features</p>
              <Link
                href="/"
                className="inline-block bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Start Analysis
              </Link>
            </div>
          </div>
        </div>

        {/* Related Articles */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Tutorials</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Link
              href="/tutorials/large-csv-files"
              className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all"
            >
              <h3 className="font-semibold text-gray-900 mb-2">How to Open and Process Large CSV Files</h3>
              <p className="text-gray-600 text-sm">Learn techniques and best practices for handling large CSV files</p>
            </Link>
            <Link
              href="/tutorials/csv-filtering-tips"
              className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all"
            >
              <h3 className="font-semibold text-gray-900 mb-2">CSV File Filtering and Screening Tips</h3>
              <p className="text-gray-600 text-sm">Master advanced filtering techniques to quickly screen data</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}