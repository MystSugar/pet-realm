import React from "react";

export default function InformationCollectionSection() {
  return (
    <section>
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Information We Collect</h2>

      <h3 className="text-lg font-semibold text-gray-900 mb-3">2.1 Personal Information</h3>
      <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
        <li>Name, email address, and phone number</li>
        <li>Island and atoll location within the Maldives</li>
        <li>Payment information (bank account details for transfers)</li>
        <li>Identity verification documents for business accounts</li>
        <li>Profile photos and shop images</li>
      </ul>

      <h3 className="text-lg font-semibold text-gray-900 mb-3">2.2 Pet Information</h3>
      <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
        <li>Pet names, species, breeds, and ages</li>
        <li>Pet photos and health records</li>
        <li>Vaccination history and medical information</li>
        <li>Behavioral notes and special requirements</li>
      </ul>

      <h3 className="text-lg font-semibold text-gray-900 mb-3">2.3 Usage Information</h3>
      <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
        <li>Device information and IP addresses</li>
        <li>Browsing history and search queries on our platform</li>
        <li>Purchase history and service bookings</li>
        <li>Communication records with customer support</li>
      </ul>
    </section>
  );
}
