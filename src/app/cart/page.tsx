import { Suspense } from "react";
import Layout from "@/components/layouts/Layout";
import CartContent from "@/components/cart/CartContent";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata = {
  title: "Shopping Cart - Pet Realm",
  description: "Review your cart and proceed to checkout",
};

export default function CartPage() {
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-cream-50 to-secondary-50 ">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-6xl">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

          <Suspense fallback={<CartSkeleton />}>
            <CartContent />
          </Suspense>
        </div>
      </div>
    </Layout>
  );
}

function CartSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-white rounded-lg p-4 space-y-3">
            <div className="flex gap-4">
              <Skeleton className="h-24 w-24 rounded-lg" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-6 w-1/4" />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div>
        <Skeleton className="h-64 w-full rounded-lg" />
      </div>
    </div>
  );
}
