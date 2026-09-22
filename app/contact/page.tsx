import { PageCard, PageShell } from '@/components/PageShell';
export const metadata = {
  alternates: { canonical: '/contact/' }, title: 'Contact CSVFilters | CSVFilters', description: 'Report a problem, suggest a feature, or ask about the website.' };
export default function Page() {
  return <PageShell title="Contact CSVFilters" description="Report a problem, suggest a feature, or ask about the website.">
    <PageCard className="max-w-4xl space-y-8">
        <section><h2 className="text-xl font-semibold mb-3">Reach the maintainer</h2><p className="text-gray-700 leading-7">Use the GitHub issue tracker linked below to contact the project maintainer. A GitHub account is required to submit an issue. Reports and replies are public; no response time is guaranteed.</p></section>
        <section><h2 className="text-xl font-semibold mb-3">Report a reproducible problem</h2><p className="text-gray-700 leading-7">Include the page URL, browser and operating system, steps to reproduce, and what you expected to happen. If an example is needed, create a small synthetic CSV with the same structure. Never attach customer records, passwords, access tokens, or other private data.</p></section>
        <section><h2 className="text-xl font-semibold mb-3">Privacy questions</h2><p className="text-gray-700 leading-7">You can use the same issue tracker for general privacy questions, without including identifying or sensitive information. There is currently no private contact form on this website.</p></section>
<p><a className="text-blue-700 underline" href="https://github.com/beyondxuchao/bigcsv.github.io/issues">Contact the maintainer on GitHub Issues</a></p>
    </PageCard>
  </PageShell>;
}
