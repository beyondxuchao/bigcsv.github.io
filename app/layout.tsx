import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://csvfilters.com'),
  title: 'CSVFilters - Online CSV Analysis & Filter Tool',
  description: 'Free online CSV analysis tool for filtering, processing and viewing large CSV files. Advanced CSV editor with real-time filtering, data export, and big file support.',
  keywords: 'csv analysis, csv filter, csv online tool, csv file viewer, csv large file, csv file processor, csv split and merge, csv editor online, big csv file analysis',
  authors: [{ name: 'CSVFilters Team' }],
  creator: 'CSVFilters',
  publisher: 'CSVFilters',
  robots: 'index, follow',
  openGraph: {
    title: 'CSVFilters - Online CSV Analysis Tool',
    description: 'Professional CSV analysis and filtering tool. Process large CSV files online with advanced filtering, data export, and real-time preview.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CSVFilters - Online CSV Analysis Tool',
    description: 'Free online CSV file processor with advanced filtering and analysis capabilities.',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#3b82f6',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7086500449333882"
          crossOrigin="anonymous"
        />
        <script
          type="text/javascript"
          dangerouslySetInnerHTML={{
            __html: `
              (function(c,l,a,r,i,t,y){ 
                  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)}; 
                  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i; 
                  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y); 
              })(window, document, "clarity", "script", "t0svc3x5m1"); 
            `,
          }}
        />
      </head>
      <body
        className={`${poppins.variable} antialiased w-full min-h-screen bg-gradient-to-r from-slate-50 to-green-50 background-animate flex flex-col`}
      >

        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
