import { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'XML to CSV Converter Redirect | CSVFilters',
  robots: {
    index: false,
    follow: true,
  },
};

export default function XmlToCsvRedirectPage() {
  redirect('/tools/format-converter/csv-xml-converter/');
}
