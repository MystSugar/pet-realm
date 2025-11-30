"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Package, ShoppingCart, Clock, Settings } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils/currency";
import { LoadingState } from "@/components/ui/loading-state";

interface OrderStats {
  total: number;
  pending: number;
  completed: number;
}

interface RecentOrder {
  id: string;
  orderNumber: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  items: {
    quantity: number;
    product: {
      name: string;
    };
  }[];
}

export default function ProfileContent() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<OrderStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const [statsRes, ordersRes] = await Promise.all([fetch("/api/user/orders/stats"), fetch("/api/user/orders?limit=5")]);

        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats(statsData);
        }

        if (ordersRes.ok) {
          const ordersData = await ordersRes.json();
          setRecentOrders(ordersData.orders || []);
        }
      } catch {
        // Silently fail - user will see empty state
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "confirmed":
        return "bg-blue-100 text-blue-700";
      case "delivered":
      case "completed":
        return "bg-green-100 text-green-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <LoadingState message="Loading profile..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-charcoal-800 mb-2">Welcome back, {session?.user?.name || "Customer"}!</h1>
          <p className="text-charcoal-600">Manage your orders and account information</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 bg-white transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-charcoal-600 mb-1">Total Orders</p>
                <p className="text-3xl font-bold text-charcoal-800">{stats?.total || 0}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center">
                <ShoppingCart className="h-6 w-6 text-primary-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-charcoal-600 mb-1">Pending Orders</p>
                <p className="text-3xl font-bold text-charcoal-800">{stats?.pending || 0}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-charcoal-600 mb-1">Completed</p>
                <p className="text-3xl font-bold text-charcoal-800">{stats?.completed || 0}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                <Package className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Recent Orders */}
        <Card className="p-6 bg-white">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-bold text-charcoal-800">Recent Orders</h2>
            <Link href="/orders">
              <Button variant="outline" size="sm">
                View All Orders
              </Button>
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-16 w-16 text-charcoal-300 mx-auto mb-4" />
              <p className="text-charcoal-600 mb-4">You haven&apos;t placed any orders yet</p>
              <Link href="/marketplace">
                <Button>Start Shopping</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <Link key={order.id} href={`/orders/${order.id}`} className="block">
                  <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer border">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <p className="font-semibold text-charcoal-800">Order #{order.orderNumber}</p>
                          <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                        </div>
                        <p className="text-sm text-charcoal-600 mb-1">
                          {order.items.reduce((sum, item) => sum + item.quantity, 0)} item(s) • {formatPrice(order.totalAmount)}
                        </p>
                        <p className="text-xs text-charcoal-500">
                          {new Date(order.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                            hour: "numeric",
                            minute: "2-digit",
                            hour12: true,
                          })}
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </Card>

        {/* Quick Links */}
        <div className="grid md:grid-cols-3 gap-6 mt-8">
          <Link href="/orders">
            <Card className="p-6 bg-white hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-primary-300">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center">
                  <Package className="h-6 w-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-charcoal-800 mb-1">Order History</h3>
                  <p className="text-sm text-charcoal-600">View all your past orders</p>
                </div>
              </div>
            </Card>
          </Link>

          <Link href="/marketplace">
            <Card className="p-6 bg-white hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-accent-300">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-accent-100 flex items-center justify-center">
                  <ShoppingCart className="h-6 w-6 text-accent-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-charcoal-800 mb-1">Continue Shopping</h3>
                  <p className="text-sm text-charcoal-600">Browse products in marketplace</p>
                </div>
              </div>
            </Card>
          </Link>

          <Link href="/account/settings">
            <Card className="p-6 bg-white hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-secondary-300">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-secondary-100 flex items-center justify-center">
                  <Settings className="h-6 w-6 text-secondary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-charcoal-800 mb-1">Account Settings</h3>
                  <p className="text-sm text-charcoal-600">Edit profile and preferences</p>
                </div>
              </div>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
