import React from "react";

export default function ProductsServicesSection() {
  return (
    <section>
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Products and Services</h2>

      <h3 className="text-lg font-semibold text-gray-900 mb-3">3.1 Product Listings</h3>
      <p className="text-gray-700 mb-4">
        Sellers are responsible for providing accurate product descriptions, pricing, and availability. All products must comply with Maldivian import
        regulations and animal welfare standards.
      </p>

      <h3 className="text-lg font-semibold text-gray-900 mb-3">3.2 Service Providers</h3>
      <p className="text-gray-700 mb-4">
        Professional service providers (veterinarians, groomers, trainers) must maintain appropriate licenses and certifications required by Maldivian
        law and professional bodies.
      </p>

      <h3 className="text-lg font-semibold text-gray-900 mb-3">3.3 Quality Standards</h3>
      <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
        <li>All products must be safe for animals and meet quality standards</li>
        <li>Pet food must be within expiration dates and properly stored</li>
        <li>Services must be performed by qualified professionals</li>
        <li>Emergency veterinary services must be available 24/7 as advertised</li>
      </ul>
    </section>
  );
}
