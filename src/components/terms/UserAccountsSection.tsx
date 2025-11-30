import React from "react";

export default function UserAccountsSection() {
  return (
    <section>
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. User Accounts and Registration</h2>

      <h3 className="text-lg font-semibold text-gray-900 mb-3">2.1 Account Creation</h3>
      <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
        <li>You must be at least 18 years old to create an account</li>
        <li>You must provide accurate and complete information</li>
        <li>You are responsible for maintaining the confidentiality of your account credentials</li>
        <li>You must notify us immediately of any unauthorized use of your account</li>
        <li>One person or business may maintain only one account</li>
      </ul>

      <h3 className="text-lg font-semibold text-gray-900 mb-3">2.2 Business Accounts</h3>
      <p className="text-gray-700 mb-4">
        Pet shop owners and service providers must provide valid business registration documents and comply with all applicable Maldivian business
        licensing requirements.
      </p>
    </section>
  );
}
