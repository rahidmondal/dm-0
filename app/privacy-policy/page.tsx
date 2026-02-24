import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | DM-0',
  description: 'Privacy Policy for DM-0 real-time messaging platform.',
};

export default function PrivacyPage() {
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
          <h1 className="mb-2 text-3xl font-bold text-slate-900 dark:text-white">Privacy Policy</h1>
          <p className="mb-8 text-sm text-slate-400">Last Updated: February 25, 2026 · Contact: admin@dm0.social</p>

          <div className="space-y-8 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            <section>
              <h2 className="mb-2 text-lg font-semibold text-slate-900 dark:text-white">1. Project Nature</h2>
              <p>
                DM-0 is a portfolio and demonstration project created for educational and showcase purposes.
                It is not intended for production or commercial deployment.
              </p>
              <p className="mt-2">
                Users should not rely on DM-0 for confidential, business-critical, or long-term communication.
              </p>
            </section>

            <section>
              <h2 className="mb-2 text-lg font-semibold text-slate-900 dark:text-white">2. Information We Collect</h2>
              <p>When you use DM-0, we may collect the following information:</p>

              <h3 className="mt-4 mb-1 text-sm font-semibold text-slate-800 dark:text-slate-200">Account Information</h3>
              <ul className="ml-4 list-disc space-y-1">
                <li>Name</li>
                <li>Email address</li>
                <li>Profile image</li>
              </ul>
              <p className="mt-1 text-xs text-slate-400">(Provided through our authentication provider.)</p>

              <h3 className="mt-4 mb-1 text-sm font-semibold text-slate-800 dark:text-slate-200">Message Content</h3>
              <ul className="ml-4 list-disc space-y-1">
                <li>Messages and interactions sent within the platform.</li>
              </ul>

              <h3 className="mt-4 mb-1 text-sm font-semibold text-slate-800 dark:text-slate-200">Basic Usage Data</h3>
              <ul className="ml-4 list-disc space-y-1">
                <li>Online status</li>
                <li>Session activity required to enable real-time functionality.</li>
              </ul>

              <p className="mt-3">We do not intentionally collect sensitive personal information.</p>
            </section>

            <section>
              <h2 className="mb-2 text-lg font-semibold text-slate-900 dark:text-white">3. How We Use Information</h2>
              <p>Information collected is used solely to:</p>
              <ul className="ml-4 mt-2 list-disc space-y-1">
                <li>Authenticate users</li>
                <li>Provide real-time messaging functionality</li>
                <li>Display user profiles within the application</li>
                <li>Maintain system integrity and prevent abuse</li>
              </ul>
              <p className="mt-2 font-medium">We do not sell, rent, or trade personal data.</p>
            </section>

            <section>
              <h2 className="mb-2 text-lg font-semibold text-slate-900 dark:text-white">4. Third-Party Services</h2>
              <p>
                DM-0 relies on third-party infrastructure and authentication providers to operate. These providers
                may process limited data strictly as necessary to deliver their services.
              </p>
              <p className="mt-2">
                Data handled by third-party services is subject to their respective privacy policies.
              </p>
            </section>

            <section>
              <h2 className="mb-2 text-lg font-semibold text-slate-900 dark:text-white">5. Data Retention</h2>
              <p>Data is retained while your account remains active.</p>
              <p className="mt-2">However, as DM-0 is a demonstration project:</p>
              <ul className="ml-4 mt-2 list-disc space-y-1">
                <li>Data may be reset, modified, or permanently deleted at any time.</li>
                <li>Long-term storage is not guaranteed.</li>
                <li>Backup and recovery systems are not guaranteed.</li>
              </ul>
              <p className="mt-2">
                If you wish to request deletion of your account data, contact:{' '}
                <span className="font-medium">admin@dm0.social</span>
              </p>
            </section>

            <section>
              <h2 className="mb-2 text-lg font-semibold text-slate-900 dark:text-white">6. Security</h2>
              <p>Reasonable technical measures are used to protect data in transit and during authentication.</p>
              <p className="mt-2">However:</p>
              <ul className="ml-4 mt-2 list-disc space-y-1">
                <li>DM-0 has not undergone formal security auditing.</li>
                <li>It should not be used to store sensitive or confidential information.</li>
                <li>No system can guarantee absolute security.</li>
              </ul>
            </section>

            <section>
              <h2 className="mb-2 text-lg font-semibold text-slate-900 dark:text-white">7. User Responsibilities Regarding Data</h2>
              <p>You agree not to upload, transmit, or store:</p>
              <ul className="ml-4 mt-2 list-disc space-y-1">
                <li>Financial information</li>
                <li>Government-issued identification numbers</li>
                <li>Passwords</li>
                <li>Health information</li>
                <li>Confidential business data</li>
                <li>Illegal or harmful content</li>
              </ul>
              <p className="mt-2">DM-0 is not designed to handle sensitive personal data.</p>
            </section>

            <section>
              <h2 className="mb-2 text-lg font-semibold text-slate-900 dark:text-white">8. Changes to This Policy</h2>
              <p>
                This Privacy Policy may be updated periodically. Continued use of DM-0 after updates constitutes
                acceptance of the revised policy.
              </p>
            </section>

            <section>
              <h2 className="mb-2 text-lg font-semibold text-slate-900 dark:text-white">9. Contact</h2>
              <p>For privacy-related inquiries, contact:</p>
              <p className="mt-1 font-medium">admin@dm0.social</p>
            </section>
          </div>
        </div>

        {/* Footer links */}
        <div className="mt-8 flex items-center justify-center gap-3 text-xs text-slate-600 dark:text-slate-500">
          <Link href="/terms-of-service" className="transition-colors hover:text-slate-600 dark:hover:text-slate-300">
            Terms of Service
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
