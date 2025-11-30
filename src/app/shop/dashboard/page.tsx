import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import SellerDashboardContent from "@/components/shop/SellerDashboardContent";

export const metadata = {
  title: "Seller Dashboard | Pet Realm",
  description: "Manage your shop and products",
};

function DashboardSkeleton() {
  return (
    <div className="bg-cream-50">
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-10 w-64 mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    </div>
  );
}

export default function SellerDashboardPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <SellerDashboardContent />
    </Suspense>
  );
}
