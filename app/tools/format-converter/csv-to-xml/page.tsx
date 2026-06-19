import { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'CSV to XML Converter Redirect | CSVFilters',
  robots: {
    index: false,
    follow: true,
  },
};

export default function CsvToXmlRedirectPage() {
  redirect('/tools/format-converter/csv-xml-converter/');
}
