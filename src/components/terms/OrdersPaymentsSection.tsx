import React from "react";

export default function OrdersPaymentsSection() {
  return (
    <section>
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Orders, Payments, and Refunds</h2>

      <h3 className="text-lg font-semibold text-gray-900 mb-3">4.1 Order Processing</h3>
      <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
        <li>Orders are subject to acceptance by individual sellers</li>
        <li>Prices are displayed in Maldivian Rufiyaa (MVR) and include applicable taxes</li>
        <li>Delivery times vary based on product availability and island location</li>
        <li>Special handling may be required for live animals or perishable products</li>
      </ul>

      <h3 className="text-lg font-semibold text-gray-900 mb-3">4.2 Payment Methods</h3>
      <p className="text-gray-700 mb-4">
        We accept bank transfers to licensed Maldivian banks. Payment verification through receipt upload is required to process orders. Cash on
        delivery may be available for select locations.
      </p>

      <h3 className="text-lg font-semibold text-gray-900 mb-3">4.3 Refunds and Returns</h3>
      <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
        <li>Unopened products may be returned within 14 days of delivery</li>
        <li>Perishable items (pet food, medications) cannot be returned once opened</li>
        <li>Service cancellations must be made at least 24 hours in advance</li>
        <li>Refunds are processed through the original payment method</li>
        <li>Return shipping costs are borne by the customer unless the product is defective</li>
      </ul>
    </section>
  );
}
