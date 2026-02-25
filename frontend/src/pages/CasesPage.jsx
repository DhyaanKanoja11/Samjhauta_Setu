import { ShieldCheck, FileText, Scale, Clock } from "lucide-react";

export default function CasesPage() {
  return (
    <div className="min-h-screen py-10">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-green-700 dark:text-green-400">
          Manage Disputes
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400 mt-2">
          Secure platform to register, track and resolve agricultural disputes.
        </p>
      </div>

      {/* Coming Soon Banner */}
      <div className="bg-green-100 dark:bg-green-900/40 border border-green-300 dark:border-green-700 rounded-2xl p-8 shadow-sm">

        <div className="flex items-center gap-3 mb-4">
          <Clock className="text-green-700 dark:text-green-400" size={28} />
          <h2 className="text-2xl font-semibold text-green-800 dark:text-green-300">
            Dispute Resolution System — Coming Soon
          </h2>
        </div>

        <p className="text-neutral-700 dark:text-neutral-300 mb-6">
          Samjhauta Setu will soon allow farmers to digitally register disputes
          related to land, crop insurance, payments, contracts, and government claims.
          You will be able to upload documents, track status, and receive guided assistance.
        </p>

        {/* Feature List */}
        <div className="grid md:grid-cols-2 gap-6">

          <div className="bg-white dark:bg-neutral-800 p-6 rounded-xl border border-neutral-200 dark:border-neutral-700">
            <div className="flex items-center gap-3 mb-3">
              <FileText size={20} className="text-green-600" />
              <h3 className="font-semibold text-lg">Digital Case Filing</h3>
            </div>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Register disputes online by uploading supporting documents
              like land records, agreements, payment proofs, or insurance forms.
            </p>
          </div>

          <div className="bg-white dark:bg-neutral-800 p-6 rounded-xl border border-neutral-200 dark:border-neutral-700">
            <div className="flex items-center gap-3 mb-3">
              <Scale size={20} className="text-green-600" />
              <h3 className="font-semibold text-lg">Case Tracking</h3>
            </div>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Track dispute progress, review updates, and monitor resolution
              steps in a structured dashboard.
            </p>
          </div>

          <div className="bg-white dark:bg-neutral-800 p-6 rounded-xl border border-neutral-200 dark:border-neutral-700">
            <div className="flex items-center gap-3 mb-3">
              <ShieldCheck size={20} className="text-green-600" />
              <h3 className="font-semibold text-lg">Secure & Encrypted Storage</h3>
            </div>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              All documents and case details will be encrypted and stored securely.
              Only authorized personnel will be able to access case records.
            </p>
          </div>

          <div className="bg-white dark:bg-neutral-800 p-6 rounded-xl border border-neutral-200 dark:border-neutral-700">
            <div className="flex items-center gap-3 mb-3">
              <ShieldCheck size={20} className="text-green-600" />
              <h3 className="font-semibold text-lg">Government Interface (Future)</h3>
            </div>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Future integration with government grievance portals and district
              agriculture departments for streamlined dispute escalation.
            </p>
          </div>

        </div>

        {/* Security Notice */}
        <div className="mt-8 p-6 bg-neutral-50 dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-700">
          <h4 className="font-semibold mb-2 text-green-700 dark:text-green-400">
            Data Protection & Confidentiality
          </h4>
          <ul className="text-sm text-neutral-600 dark:text-neutral-400 list-disc ml-5 space-y-2">
            <li>End-to-end encrypted document storage</li>
            <li>No public visibility of dispute details</li>
            <li>Access restricted to authorized officials only</li>
            <li>Secure cloud infrastructure with audit logging</li>
          </ul>
        </div>

      </div>

    </div>
  );
}