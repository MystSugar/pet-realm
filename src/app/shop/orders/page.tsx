import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import SellerOrdersContent from "@/components/shop/SellerOrdersContent";

export const metadata = {
  title: "Orders | Pet Realm",
  description: "Manage your shop orders",
};

function OrdersSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <Skeleton className="h-10 w-64 mb-8" />
      <div className="space-y-4">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    </div>
  );
}

export default function SellerOrdersPage() {
  return (
    <Suspense fallback={<OrdersSkeleton />}>
      <SellerOrdersContent />
    </Suspense>
  );
}
