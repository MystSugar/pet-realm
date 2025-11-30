import React from "react";
import { Card } from "@/components/ui/card";
import {
  AgreementSection,
  UserAccountsSection,
  ProductsServicesSection,
  OrdersPaymentsSection,
  LiabilityDisclaimersSection,
  ChangesToTermsSection,
} from "@/components/terms";
import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-cream-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary-600 via-primary-500 to-accent-500 text-white py-20">
        <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Terms of Service</h1>
          <p className="text-xl text-primary-50">Effective Date: January 01, 2025</p>
        </div>
      </div>

      {/* Content */}
      <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card className="p-8 md:p-12 space-y-2 bg-white shadow-lg">
          <AgreementSection />
          <UserAccountsSection />
          <ProductsServicesSection />
          <OrdersPaymentsSection />
          <LiabilityDisclaimersSection />
          <ChangesToTermsSection />
        </Card>

        {/* Footer Navigation */}
        <div className="flex justify-center space-x-4 pt-8 text-sm">
          <Link href="/privacy" className="text-primary-600 hover:text-primary-700 font-medium transition-colors">
            Privacy Policy
          </Link>
          <Link href="/contact" className="text-accent-600 hover:text-accent-700 font-medium transition-colors">
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}
