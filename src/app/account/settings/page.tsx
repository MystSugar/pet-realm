import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import AccountSettingsContent from "@/components/user/AccountSettingsContent";

export const metadata = {
  title: "Account Settings | Pet Realm",
  description: "Manage your account settings and preferences",
};

function AccountSettingsSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Skeleton className="h-10 w-64 mb-8" />
      <div className="space-y-6">
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    </div>
  );
}

export default function AccountSettingsPage() {
  return (
    <Suspense fallback={<AccountSettingsSkeleton />}>
      <AccountSettingsContent />
    </Suspense>
  );
}
