import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import ShopSetupWizard from "@/components/shop/ShopSetupWizard";

export const metadata = {
  title: "Shop Setup | Pet Realm",
  description: "Set up your shop on Pet Realm",
};

function SetupSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <Skeleton className="h-10 w-64 mb-8" />
      <Skeleton className="h-2 w-full mb-8" />
      <div className="space-y-6">
        <Skeleton className="h-96 w-full" />
      </div>
    </div>
  );
}

export default function ShopSetupPage() {
  return (
    <Suspense fallback={<SetupSkeleton />}>
      <ShopSetupWizard />
    </Suspense>
  );
}
