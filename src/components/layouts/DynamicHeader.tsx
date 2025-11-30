"use client";

import { useAuth } from "@/hooks/useAuth";
import { AccountType } from "@prisma/client";
import PublicHeader from "./PublicHeader";
import CustomerHeader from "./CustomerHeader";
import SellerHeader from "./SellerHeader";
import { useEffect, useState } from "react";

export default function DynamicHeader() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const [shop, setShop] = useState<{ id: string; name: string } | undefined>();
  const [fetchedShopId, setFetchedShopId] = useState<string | null>(null);

  // Fetch shop data for sellers
  useEffect(() => {
    const fetchShop = async () => {
      if (user?.role === AccountType.SELLER && user?.id && user.id !== fetchedShopId) {
        try {
          const response = await fetch("/api/shop/settings");
          if (response.ok) {
            const data = await response.json();
            setShop({ id: data.id, name: data.name });
            setFetchedShopId(user.id);
          }
        } catch (error) {
          console.error("Failed to fetch shop data:", error);
        }
      }
    };

    fetchShop();
  }, [user?.role, user?.id, fetchedShopId]);

  // Show loading state during authentication check
  if (isLoading) {
    return (
      <header className="bg-cream-50 border-b border-gray-200 sticky top-0 z-50">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-200 rounded-lg animate-pulse"></div>
              <div className="w-24 h-6 bg-gray-200 rounded ml-2 animate-pulse"></div>
            </div>
            <div className="flex space-x-2">
              <div className="w-16 h-8 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-20 h-8 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </header>
    );
  }

  // Not authenticated - show public header
  if (!isAuthenticated || !user) {
    return <PublicHeader />;
  }

  // Check account type and show appropriate header
  if (user.role === AccountType.SELLER) {
    return <SellerHeader user={user} shop={shop} />;
  }

  if (user.role === AccountType.ADMIN) {
    // TODO: Create AdminHeader component
    return <SellerHeader user={user} shop={shop} />; // Temporary fallback since no AdminHeader exists yet
  }

  // Default to customer header
  return <CustomerHeader user={user} />;
}
