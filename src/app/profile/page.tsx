import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import ProfileContent from "@/components/user/ProfileContent";

export const metadata = {
  title: "My Profile | Pet Realm",
  description: "View your profile and recent orders",
};

function ProfileSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <Skeleton className="h-10 w-48 mb-8" />
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
      <Skeleton className="h-64 w-full" />
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<ProfileSkeleton />}>
      <ProfileContent />
    </Suspense>
  );
}
