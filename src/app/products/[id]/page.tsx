import { Suspense } from "react";
import Layout from "@/components/layouts/Layout";
import ProductDetailContent from "@/components/products/ProductDetailContent";
import { Skeleton } from "@/components/ui/skeleton";

interface ProductPageProps {
  params: {
    id: string;
  };
}

export default function ProductPage({ params }: ProductPageProps) {
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-cream-50 to-secondary-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Suspense fallback={<ProductDetailSkeleton />}>
            <ProductDetailContent productId={params.id} />
          </Suspense>
        </div>
      </div>
    </Layout>
  );
}

function ProductDetailSkeleton() {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Image Skeleton */}
        <Skeleton className="h-96 w-full rounded-xl" />

        {/* Details Skeleton */}
        <div className="space-y-4">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-6 w-1/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-12 w-full mt-6" />
        </div>
      </div>
    </div>
  );
}
