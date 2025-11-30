import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import OrderDetailContent from "@/components/orders/OrderDetailContent";

export const metadata = {
  title: "Order Details | Pet Realm",
  description: "View your order details",
};

function OrderDetailSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <Skeleton className="h-10 w-64 mb-8" />
      <div className="space-y-6">
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    </div>
  );
}

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <Suspense fallback={<OrderDetailSkeleton />}>
      <OrderDetailContent orderId={id} />
    </Suspense>
  );
}
