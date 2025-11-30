import { Suspense } from "react";
import ShopSettingsContent from "@/components/shop/ShopSettingsContent";
import { ShopSettingsSkeleton } from "@/components/shop/ShopSettingsSkeleton";

export const metadata = {
  title: "Shop Settings | Pet Realm",
  description: "Manage your shop settings and preferences",
};

export default function ShopSettingsPage() {
  return (
    <Suspense fallback={<ShopSettingsSkeleton />}>
      <ShopSettingsContent />
    </Suspense>
  );
}
