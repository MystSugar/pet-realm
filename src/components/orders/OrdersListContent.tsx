"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Package, ShoppingBag, AlertCircle, ChevronRight, Home, Clock, CheckCircle, Truck, Store } from "lucide-react";
import { formatPrice } from "@/lib/utils/currency";
import { Prisma, OrderStatus } from "@prisma/client";
import { LoadingState } from "@/components/ui/loading-state";

interface OrderListItem {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  total: Prisma.Decimal | number;
  createdAt: Date;
  shop: {
    id: string;
    name: string;
    island: string;
    atoll: string;
  };
  items: {
    id: string;
    quantity: number;
  }[];
}

const STATUS_CONFIG = {
  PENDING: { label: "Pending", icon: Clock, color: "bg-yellow-500" },
  CONFIRMED: { label: "Confirmed", icon: CheckCircle, color: "bg-blue-500" },
  PREPARING: { label: "Preparing", icon: Package, color: "bg-purple-500" },
  READY_FOR_PICKUP: { label: "Ready for Pickup", icon: Store, color: "bg-green-500" },
  OUT_FOR_DELIVERY: { label: "Out for Delivery", icon: Truck, color: "bg-blue-500" },
  DELIVERED: { label: "Delivered", icon: CheckCircle, color: "bg-green-500" },
  PICKED_UP: { label: "Picked Up", icon: CheckCircle, color: "bg-green-500" },
  CANCELLED: { label: "Cancelled", icon: AlertCircle, color: "bg-red-500" },
};

export default function OrdersListContent() {
  const router = useRouter();
  const { status: authStatus } = useSession();
  const [orders, setOrders] = useState<OrderListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/orders?limit=50");
      if (!response.ok) throw new Error("Failed to fetch orders");
      const data = await response.json();
      setOrders(data.orders);
    } catch {
      setError("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authStatus === "unauthenticated") {
      router.push("/auth/signin");
      return;
    }

    if (authStatus === "authenticated") {
      fetchOrders();
    }
  }, [authStatus, router]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl bg-cream-50">
        <LoadingState message="Loading orders..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl bg-cream-50">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
              <p className="text-lg font-medium">{error}</p>
              <Button onClick={fetchOrders}>Try Again</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="bg-cream-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl bg-cream-50">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-foreground">
            <Home className="h-4 w-4" />
          </Link>
          <span>/</span>
          <span className="text-foreground">My Orders</span>
        </nav>

        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Package className="h-8 w-8" />
            My Orders
          </h1>
        </div>

        {orders.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center space-y-4 py-12">
                <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto" />
                <div>
                  <h2 className="text-xl font-semibold mb-2">No orders yet</h2>
                  <p className="text-muted-foreground">Start shopping to see your orders here</p>
                </div>
                <Button onClick={() => router.push("/marketplace")}>Browse Marketplace</Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const statusConfig = STATUS_CONFIG[order.status];
              const StatusIcon = statusConfig.icon;
              const total = typeof order.total === "number" ? order.total : parseFloat(order.total.toString());
              const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);

              return (
                <Card key={order.id} className="hover:shadow-lg transition-shadow">
                  <CardContent>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold text-lg">{order.orderNumber}</h3>
                          <Badge className={`${statusConfig.color} text-white`}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {statusConfig.label}
                          </Badge>
                        </div>

                        <div className="text-sm text-muted-foreground space-y-1">
                          <p>
                            <strong>Shop:</strong> {order.shop.name} ({order.shop.island}, {order.shop.atoll})
                          </p>
                          <p>
                            <strong>Items:</strong> {itemCount} {itemCount === 1 ? "item" : "items"}
                          </p>
                          <p>
                            <strong>Placed:</strong>{" "}
                            {new Date(order.createdAt).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Total</p>
                          <p className="text-xl font-bold">{formatPrice(total)}</p>
                        </div>
                        <Button variant="outline" onClick={() => router.push(`/orders/${order.id}`)} className="w-full sm:w-auto">
                          View Details
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
