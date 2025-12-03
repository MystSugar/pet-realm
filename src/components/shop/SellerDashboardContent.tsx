"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Store, Package, ShoppingCart, DollarSign, Plus, ArrowRight, AlertCircle, Clock } from "lucide-react";
import { formatPrice } from "@/lib/utils/currency";
import { Prisma, OrderStatus } from "@prisma/client";
import { LoadingState } from "@/components/ui/loading-state";

interface DashboardStats {
  totalProducts: number;
  activeProducts: number;
  totalOrders: number;
  pendingOrders: number;
  revenue: Prisma.Decimal | number;
}

interface RecentOrder {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  total: Prisma.Decimal | number;
  createdAt: Date;
  customer: {
    name: string;
  };
}

const STATUS_CONFIG = {
  PENDING: { label: "Pending", color: "bg-yellow-500" },
  CONFIRMED: { label: "Confirmed", color: "bg-blue-500" },
  PREPARING: { label: "Preparing", color: "bg-purple-500" },
  READY_FOR_PICKUP: { label: "Ready", color: "bg-green-500" },
  OUT_FOR_DELIVERY: { label: "Out for Delivery", color: "bg-blue-500" },
  DELIVERED: { label: "Delivered", color: "bg-green-500" },
  PICKED_UP: { label: "Picked Up", color: "bg-green-500" },
  CANCELLED: { label: "Cancelled", color: "bg-red-500" },
};

export default function SellerDashboardContent() {
  const router = useRouter();
  const { status } = useSession();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
      return;
    }

    if (status === "authenticated") {
      fetchDashboardData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, router]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/shop/dashboard");

      if (!response.ok) {
        if (response.status === 404) {
          // No shop found, redirect to setup
          router.push("/shop/setup");
          return;
        }
        throw new Error("Failed to fetch dashboard data");
      }

      const data = await response.json();
      setStats(data.stats);
      setRecentOrders(data.recentOrders);
    } catch {
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl min-h-[calc(100vh-200px)]">
        <LoadingState message="Loading dashboard..." />
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl min-h-[calc(100vh-200px)]">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
              <p className="text-lg font-medium">{error || "Failed to load dashboard"}</p>
              <Button onClick={fetchDashboardData}>Try Again</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const revenue = typeof stats.revenue === "number" ? stats.revenue : parseFloat(stats.revenue.toString());

  return (
    <div className="bg-cream-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
              <Store className="h-6 w-6 sm:h-8 sm:w-8" />
              Seller Dashboard
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1">Manage your shop and track performance</p>
          </div>
          <Button onClick={() => router.push("/shop/products/new")} className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          <Card className="m-4">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-md font-medium">Total Products</CardTitle>
              <Package className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold -mt-2">{stats.totalProducts}</div>
              <p className="text-xs text-muted-foreground mt-1">{stats.activeProducts} active</p>
            </CardContent>
          </Card>

          <Card className="m-4">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-md font-medium">Total Orders</CardTitle>
              <ShoppingCart className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalOrders}</div>
              <p className="text-xs text-muted-foreground mt-1">{stats.pendingOrders} pending</p>
            </CardContent>
          </Card>

          <Card className="m-4">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-md font-medium">Revenue</CardTitle>
              <DollarSign className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatPrice(revenue)}</div>
              <p className="text-xs text-muted-foreground mt-1">All time earnings</p>
            </CardContent>
          </Card>

          <Card className="m-4">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-md font-medium">Pending Orders</CardTitle>
              <Clock className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingOrders}</div>
              <p className="text-xs text-muted-foreground mt-1">Require attention</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer mt-6" onClick={() => router.push("/shop/products")}>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Package className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Manage Products</h3>
                  <p className="text-sm text-muted-foreground">View and edit your products</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer mt-6" onClick={() => router.push("/shop/orders")}>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <ShoppingCart className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold">View Orders</h3>
                  <p className="text-sm text-muted-foreground">Process customer orders</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer mt-6" onClick={() => router.push("/shop/settings")}>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Store className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Shop Settings</h3>
                  <p className="text-sm text-muted-foreground">Update shop information</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">Recent Orders</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => router.push("/shop/orders")}>
                View All
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {recentOrders.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No orders yet</p>
                <p className="text-sm text-muted-foreground mt-1">Orders from customers will appear here</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentOrders.map((order) => {
                  const total = typeof order.total === "number" ? order.total : parseFloat(order.total.toString());
                  const statusConfig = STATUS_CONFIG[order.status];

                  return (
                    <Card key={order.id} className="p-4 hover:shadow-md transition-shadow cursor-pointer border">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <p className="font-semibold text-charcoal-800 break-all">{order.orderNumber}</p>
                            <Badge className={`${statusConfig.color} text-white flex-shrink-0`}>{statusConfig.label}</Badge>
                          </div>
                          <p className="text-sm text-charcoal-600 mb-1">
                            Customer: {order.customer.name} • {formatPrice(total)}
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
                        <Button variant="outline" size="sm" onClick={() => router.push(`/shop/orders/${order.id}`)} className="w-full md:w-auto">
                          View Details
                        </Button>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
