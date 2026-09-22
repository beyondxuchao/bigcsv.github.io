import Link from 'next/link';
import { PageCard, PageShell } from '@/components/PageShell';
export const metadata = {
  alternates: { canonical: '/privacy/' }, title: 'Privacy Policy | CSVFilters', description: 'How CSVFilters handles files, site usage data, advertising, and privacy choices.' };
export default function Page() {
  return <PageShell title="Privacy Policy" description="How CSVFilters handles files, site usage data, advertising, and privacy choices.">
    <PageCard className="max-w-4xl space-y-8">
        <section><h2 className="text-xl font-semibold mb-3">Files you choose to process</h2><p className="text-gray-700 leading-7">The standard CSV viewing, filtering, validation, and conversion tools process selected files in your browser. Those tools do not upload file contents to a CSVFilters application server. Downloads are saved through your browser. Avoid entering confidential information into feedback reports or other external services.</p></section>
        <section><h2 className="text-xl font-semibold mb-3">Hosting and access data</h2><p className="text-gray-700 leading-7">Cloudflare serves this website and may process IP addresses, request URLs, browser information, and security or diagnostic data to deliver and protect the site. Hosting and third-party providers control their own data retention under their policies.</p></section>
        <section><h2 className="text-xl font-semibold mb-3">Usage analytics: Microsoft Clarity</h2><p className="text-gray-700 leading-7">This website loads Microsoft Clarity to understand how visitors use the interface, including interaction and session-replay data. Clarity may use cookies and process device, browser, and usage information. File processing in the browser does not mean that all page interactions are private. Do not assume that sensitive values displayed on screen are excluded from analytics.</p></section>
        <section><h2 className="text-xl font-semibold mb-3">Advertising: Google AdSense</h2><p className="text-gray-700 leading-7">This website includes Google AdSense code. Google and its partners may use cookies or similar technologies, IP addresses, and device and browsing information to deliver, measure, and personalize ads, where permitted and subject to applicable consent requirements. Including the code does not mean ads are currently approved or shown.</p></section>
        <section><h2 className="text-xl font-semibold mb-3">Local AI assistant</h2><p className="text-gray-700 leading-7">The optional AI CSV Assistant requires a separately running local helper. When you use its chat feature, prompts, a CSV summary, and sample rows are sent to the configured helper. Model and runtime downloads contact external providers. Review the helper configuration before using sensitive data; it is not a hosted AI service provided by this website.</p></section>
        <section><h2 className="text-xl font-semibold mb-3">Your choices</h2><p className="text-gray-700 leading-7">You can manage or delete cookies and site storage through your browser and adjust personalized advertising in Google My Ad Center. Browser privacy controls may affect functionality. Where a consent dialog is provided, use it to review or change your choices. This policy itself is not a consent mechanism.</p></section>
        <section><h2 className="text-xl font-semibold mb-3">Contact and updates</h2><p className="text-gray-700 leading-7">For questions about this policy, use the contact page. GitHub reports are public: do not include personal data, private files, or credentials. We update this policy when website behavior changes. Last updated: September 22, 2026.</p></section>
<ul className="list-disc pl-6 space-y-2">
<li><a className="text-blue-700 underline" href="https://policies.google.com/technologies/partner-sites">How Google uses information from partner sites</a></li>
<li><a className="text-blue-700 underline" href="https://myadcenter.google.com/">Google My Ad Center</a></li>
<li><a className="text-blue-700 underline" href="https://privacy.microsoft.com/privacystatement">Microsoft privacy statement</a></li>
<li><a className="text-blue-700 underline" href="https://www.cloudflare.com/privacypolicy/">Cloudflare privacy policy</a></li>
<li><Link className="text-blue-700 underline" href="/contact/">Contact CSVFilters</Link></li></ul>
    </PageCard>
  </PageShell>;
}
