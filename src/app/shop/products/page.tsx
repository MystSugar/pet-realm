import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import SellerProductsContent from "@/components/shop/SellerProductsContent";

export const metadata = {
  title: "Manage Products | Pet Realm",
  description: "Manage your shop products",
};

function ProductsSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <Skeleton className="h-10 w-64 mb-8" />
      <div className="space-y-4">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    </div>
  );
}

export default function SellerProductsPage() {
  return (
    <Suspense fallback={<ProductsSkeleton />}>
      <SellerProductsContent />
    </Suspense>
  );
}
