import React from "react";

export default function InformationUsageSection() {
  return (
    <section>
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. How We Use Your Information</h2>

      <h3 className="text-lg font-semibold text-gray-900 mb-3">3.1 Service Provision</h3>
      <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
        <li>Processing orders and facilitating deliveries across Maldivian islands</li>
        <li>Booking and managing pet service appointments</li>
        <li>Providing customer support and resolving issues</li>
        <li>Maintaining and updating your account and pet profiles</li>
      </ul>

      <h3 className="text-lg font-semibold text-gray-900 mb-3">3.2 Communication</h3>
      <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
        <li>Sending order confirmations and delivery updates</li>
        <li>Pet health reminders and vaccination notifications</li>
        <li>Marketing communications about relevant products and services</li>
        <li>Important platform updates and policy changes</li>
      </ul>

      <h3 className="text-lg font-semibold text-gray-900 mb-3">3.3 Improvement and Analytics</h3>
      <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
        <li>Analyzing usage patterns to improve our platform</li>
        <li>Personalizing product recommendations</li>
        <li>Ensuring platform security and preventing fraud</li>
        <li>Conducting market research for better services</li>
      </ul>
    </section>
  );
}
