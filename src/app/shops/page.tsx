import { Metadata } from "next";
import { Suspense } from "react";
import ShopsContent from "@/components/shops/ShopsContent";

export const metadata: Metadata = {
  title: "Pet Shops | Pet Realm",
  description: "Browse local pet shops in the Maldives. Find pet stores, grooming services, veterinary clinics, and boarding facilities.",
};

export default function ShopsPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-8">Loading shops...</div>}>
      <ShopsContent />
    </Suspense>
  );
}
