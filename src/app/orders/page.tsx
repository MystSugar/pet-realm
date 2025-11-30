import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import OrdersListContent from "@/components/orders/OrdersListContent";

export const metadata = {
  title: "My Orders | Pet Realm",
  description: "View your order history",
};

function OrdersListSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <Skeleton className="h-10 w-48 mb-8" />
      <div className="space-y-4">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    </div>
  );
}

export default function OrdersPage() {
  return (
    <Suspense fallback={<OrdersListSkeleton />}>
      <OrdersListContent />
    </Suspense>
  );
}
