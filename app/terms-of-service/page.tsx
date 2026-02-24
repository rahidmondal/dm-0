import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | DM-0',
  description: 'Terms of Service for DM-0 real-time messaging platform.',
};

export default function TermsPage() {
  return (
    <div className="relative min-h-screen">
      {/* Background — light */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-white [background:radial-gradient(125%_125%_at_50%_10%,#fff_40%,#63e_100%)] dark:hidden" />
      {/* Background — dark */}
      <div className="absolute inset-0 -z-10 hidden h-full w-full [background:radial-gradient(125%_125%_at_50%_10%,#020617_40%,#63e_100%)] dark:block" />

      {/* Header */}
      <header className="sticky top-0 z-20 flex w-full items-center px-6 py-4 backdrop-blur-md">
        <Link href="/" className="flex items-center gap-2.5 transition-opacity hover:opacity-80">
          <Image src="/logo.svg" alt="DM-0 Logo" width={28} height={28} className="rounded-lg" />
          <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">DM-0</span>
        </Link>
      </header>

      {/* Content */}
      <main className="mx-auto w-full max-w-2xl px-6 pb-16 pt-4">
        <div className="rounded-2xl border border-slate-200 bg-white/80 p-8 shadow-lg backdrop-blur-sm sm:p-10 dark:border-slate-800 dark:bg-slate-900/80">
          <h1 className="mb-2 text-3xl font-bold text-slate-900 dark:text-white">Terms of Service</h1>
          <p className="mb-8 text-sm text-slate-400">Last Updated: February 25, 2026 · Contact: admin@dm0.social</p>

          <div className="space-y-8 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            <section>
              <h2 className="mb-2 text-lg font-semibold text-slate-900 dark:text-white">1. Acceptance of Terms</h2>
              <p>
                By accessing or using DM-0 (&quot;the Service&quot;), you agree to be bound by these Terms of Service.
                If you do not agree, you must not use the Service.
              </p>
            </section>

            <section>
              <h2 className="mb-2 text-lg font-semibold text-slate-900 dark:text-white">2. Description of Service</h2>
              <p>
                DM-0 is a real-time messaging platform provided strictly for demonstration and portfolio purposes.
              </p>
              <p className="mt-2">
                The Service is provided on an &quot;as is&quot; and &quot;as available&quot; basis.
              </p>
              <p className="mt-2">
                We reserve the right to modify, suspend, restrict, or discontinue the Service at any time without notice.
              </p>
            </section>

            <section>
              <h2 className="mb-2 text-lg font-semibold text-slate-900 dark:text-white">3. Eligibility</h2>
              <p>You must be at least 13 years old to use the Service.</p>
              <p className="mt-2">By using DM-0, you represent that you meet this requirement.</p>
            </section>

            <section>
              <h2 className="mb-2 text-lg font-semibold text-slate-900 dark:text-white">4. User Responsibilities</h2>
              <p>You agree that you will:</p>
              <ul className="ml-4 mt-2 list-disc space-y-1">
                <li>Maintain the security of your account.</li>
                <li>Use the Service only for lawful purposes.</li>
                <li>Not upload or transmit harmful, abusive, defamatory, obscene, or illegal content.</li>
                <li>Not attempt to disrupt, exploit, or reverse engineer the Service.</li>
                <li>Not use the Service to store sensitive personal or confidential information.</li>
              </ul>
              <p className="mt-2">You are solely responsible for the content you send or store through DM-0.</p>
            </section>

            <section>
              <h2 className="mb-2 text-lg font-semibold text-slate-900 dark:text-white">5. Account Termination</h2>
              <p>We reserve the right to suspend or terminate your access at our sole discretion, without notice, if:</p>
              <ul className="ml-4 mt-2 list-disc space-y-1">
                <li>You violate these Terms.</li>
                <li>Your conduct harms other users.</li>
                <li>Your conduct creates legal or technical risk.</li>
              </ul>
            </section>

            <section>
              <h2 className="mb-2 text-lg font-semibold text-slate-900 dark:text-white">6. Intellectual Property</h2>
              <p>
                All software, branding, and design elements of DM-0 are the property of its creator unless otherwise stated.
              </p>
              <p className="mt-2">
                You retain ownership of the content you send, but you grant DM-0 a limited, non-exclusive license to
                process and display that content solely for operating the Service.
              </p>
            </section>

            <section>
              <h2 className="mb-2 text-lg font-semibold text-slate-900 dark:text-white">7. No Warranty</h2>
              <p>The Service is provided without warranties of any kind, whether express or implied.</p>
              <p className="mt-2">We make no guarantees regarding:</p>
              <ul className="ml-4 mt-2 list-disc space-y-1">
                <li>Uptime</li>
                <li>Reliability</li>
                <li>Data persistence</li>
                <li>Accuracy</li>
                <li>Security</li>
                <li>Fitness for any particular purpose</li>
              </ul>
            </section>

            <section>
              <h2 className="mb-2 text-lg font-semibold text-slate-900 dark:text-white">8. Limitation of Liability</h2>
              <p>
                To the maximum extent permitted by applicable law, DM-0 and its creator shall not be liable for:
              </p>
              <ul className="ml-4 mt-2 list-disc space-y-1">
                <li>Loss of data</li>
                <li>Loss of profits</li>
                <li>Indirect or consequential damages</li>
                <li>Service interruptions</li>
                <li>Security breaches</li>
                <li>Any damages arising from use or inability to use the Service</li>
              </ul>
              <p className="mt-2 font-medium">Use of DM-0 is at your own risk.</p>
            </section>

            <section>
              <h2 className="mb-2 text-lg font-semibold text-slate-900 dark:text-white">9. Changes to Terms</h2>
              <p>
                We may update these Terms at any time. Continued use of the Service after changes constitutes
                acceptance of the revised Terms.
              </p>
            </section>

            <section>
              <h2 className="mb-2 text-lg font-semibold text-slate-900 dark:text-white">10. Governing Law</h2>
              <p>
                These Terms shall be governed by and interpreted in accordance with the laws of the applicable
                jurisdiction of the Service operator, without regard to conflict of law principles.
              </p>
            </section>

            <section>
              <h2 className="mb-2 text-lg font-semibold text-slate-900 dark:text-white">11. Contact</h2>
              <p>For questions regarding these Terms:</p>
              <p className="mt-1 font-medium">admin@dm0.social</p>
            </section>
          </div>
        </div>

        {/* Footer links */}
        <div className="mt-8 flex items-center justify-center gap-3 text-xs text-slate-600 dark:text-slate-500">
          <Link href="/privacy-policy" className="transition-colors hover:text-slate-600 dark:hover:text-slate-300">
            Privacy Policy
          </Link>
          <span>·</span>
          <Link href="/" className="transition-colors hover:text-slate-600 dark:hover:text-slate-300">
            Back to DM-0
          </Link>
        </div>
      </main>
    </div>
  );
}
