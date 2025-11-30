import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import AddProductForm from "@/components/shop/AddProductForm";

export const metadata = {
  title: "Add Product | Pet Realm",
  description: "Add a new product to your shop",
};

function AddProductSkeleton() {
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

export default function NewProductPage() {
  return (
    <Suspense fallback={<AddProductSkeleton />}>
      <AddProductForm />
    </Suspense>
  );
}
