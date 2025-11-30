import { Suspense } from "react";
import Layout from "@/components/layouts/Layout";
import MarketplaceContent from "@/components/marketplace/MarketplaceContent";

export const metadata = {
  title: "Marketplace - Pet Realm",
  description: "Browse and shop from a wide variety of pet supplies, live animals, and accessories from local shops in the Maldives.",
};

export default function MarketplacePage() {
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-cream-50 to-secondary-50">
        <div className="container mx-auto sm:px-6 lg:px-8 py-2 lg:py-6 max-w-6xl">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Marketplace</h1>
            <p className="text-gray-600">Discover the best pet supplies and services across the Maldives</p>
          </div>

          <Suspense fallback={<MarketplaceLoading />}>
            <MarketplaceContent />
          </Suspense>
        </div>
      </div>
    </Layout>
  );
}

function MarketplaceLoading() {
  return (
    <div className="space-y-6">
      {/* Category Filter Skeleton */}
      <div className="flex flex-wrap gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-10 w-24 bg-gray-200 rounded-lg animate-pulse" />
        ))}
      </div>

      {/* Products Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-md p-4 space-y-4">
            <div className="h-48 bg-gray-200 rounded-lg animate-pulse" />
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded animate-pulse" />
              <div className="h-3 bg-gray-200 rounded w-3/4 animate-pulse" />
              <div className="h-5 bg-gray-200 rounded w-1/2 animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
