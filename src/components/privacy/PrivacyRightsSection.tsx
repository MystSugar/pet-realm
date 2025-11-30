import React from "react";
import Link from "next/link";

export default function PrivacyRightsSection() {
  return (
    <section>
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Your Privacy Rights</h2>

      <h3 className="text-lg font-semibold text-gray-900 mb-3">5.1 Access and Control</h3>
      <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
        <li>Access and download your personal data</li>
        <li>Correct inaccurate or incomplete information</li>
        <li>Delete your account and associated data</li>
        <li>Opt out of marketing communications</li>
        <li>Request data portability to another platform</li>
      </ul>

      <h3 className="text-lg font-semibold text-gray-900 mb-3">5.2 Exercising Your Rights</h3>
      <p className="text-gray-700 mb-4">
        To exercise any of these rights, contact us at{" "}
        <Link href="mailto:privacy@petrealm.mv" className="text-blue-600 hover:underline">
          privacy@petrealm.mv
        </Link>{" "}
        or through your account settings. We will respond within 30 days of receiving your request.
      </p>
    </section>
  );
}
