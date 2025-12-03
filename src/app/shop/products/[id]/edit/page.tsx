import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import EditProductForm from "@/components/shop/EditProductForm";

export const metadata = {
  title: "Edit Product | Pet Realm",
  description: "Edit your product details",
};

function EditProductSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <Skeleton className="h-10 w-64 mb-8" />
      <div className="space-y-6">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    </div>
  );
}

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  return (
    <Suspense fallback={<EditProductSkeleton />}>
      <EditProductForm productId={id} />
    </Suspense>
  );
}
