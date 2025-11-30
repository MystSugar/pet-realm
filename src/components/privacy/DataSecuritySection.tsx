import React from "react";

export default function DataSecuritySection() {
  return (
    <section>
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Data Security</h2>
      <p className="text-gray-700 leading-relaxed mb-4">We implement industry-standard security measures to protect your personal information:</p>
      <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
        <li>Encryption of sensitive data in transit and at rest</li>
        <li>Secure servers with regular security updates</li>
        <li>Access controls limiting who can view your information</li>
        <li>Regular security audits and vulnerability assessments</li>
        <li>Secure payment processing compliant with banking regulations</li>
      </ul>
    </section>
  );
}
