"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import CartItem from "./CartItem";
import CartSummary from "./CartSummary";
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";
import { LoadingState } from "@/components/ui/loading-state";
import Link from "next/link";
import { ProductCategory, Prisma } from "@prisma/client";

interface CartItemData {
  id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    description: string;
    price: Prisma.Decimal | number;
    category: ProductCategory;
    imagesUrl: string[];
    stock: number;
    isAvailable: boolean;
    shop: {
      id: string;
      name: string;
      island: string;
      atoll: string;
      isVerified: boolean;
    };
  };
}

export default function CartContent() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [cartItems, setCartItems] = useState<CartItemData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCart = useCallback(async () => {
    if (status === "loading") return;

    if (!session) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("/api/cart");

      if (!response.ok) {
        throw new Error("Failed to fetch cart");
      }

      const data = await response.json();
      setCartItems(data.cartItems);
    } catch {
      setError("Failed to load cart");
    } finally {
      setLoading(false);
    }
  }, [session, status]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const handleUpdateQuantity = async (itemId: string, newQuantity: number) => {
    try {
      const response = await fetch(`/api/cart/${itemId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: newQuantity }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to update quantity");
      }

      // Refresh cart
      await fetchCart();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update quantity");
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    try {
      const response = await fetch(`/api/cart/${itemId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to remove item");
      }

      // Refresh cart
      await fetchCart();
    } catch {
      setError("Failed to remove item");
    }
  };

  const handleClearCart = async () => {
    if (!confirm("Are you sure you want to clear your cart?")) return;

    try {
      const response = await fetch("/api/cart", {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to clear cart");
      }

      setCartItems([]);
    } catch {
      setError("Failed to clear cart");
    }
  };

  // Redirect to sign in if not authenticated
  if (status === "unauthenticated") {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-8">
          <ShoppingBag className="w-16 h-16 text-blue-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Sign in to view your cart</h2>
          <p className="text-gray-600 mb-6">You need to be signed in to add items to your cart and checkout.</p>
          <Button onClick={() => router.push("/auth/signin")}>Sign In</Button>
        </div>
      </div>
    );
  }

  if (loading) {
    return <LoadingState message="Loading your cart..." />;
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <p className="text-red-800 mb-4">{error}</p>
          <Button onClick={() => fetchCart()}>Try Again</Button>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <div className="bg-white rounded-lg shadow-md p-8">
          <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Looks like you haven&apos;t added any items to your cart yet.</p>
          <Link href="/marketplace">
            <Button>Continue Shopping</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Cart Items */}
      <div className="lg:col-span-2 space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Cart Items ({cartItems.length})</h2>
          {cartItems.length > 0 && (
            <Button variant="outline" size="sm" onClick={handleClearCart}>
              Clear Cart
            </Button>
          )}
        </div>

        {cartItems.map((item) => (
          <CartItem key={item.id} item={item} onUpdateQuantity={handleUpdateQuantity} onRemove={handleRemoveItem} />
        ))}
      </div>

      {/* Cart Summary */}
      <div>
        <CartSummary items={cartItems} />
      </div>
    </div>
  );
}
