"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, Calendar, User, Phone, Eye, CheckCircle, AlertCircle } from "lucide-react";
import { LoadingState } from "@/components/ui/loading-state";

interface OrderItem {
  id: string;
  quantity: number;
  price: string;
  product: {
    name: string;
    imagesUrl: string[];
  };
}

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  total: string;
  deliveryType: string;
  receiptUrl: string | null;
  createdAt: string;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  items: OrderItem[];
}

type OrderStatus = "ALL" | "PENDING" | "CONFIRMED" | "PREPARING" | "READY_FOR_PICKUP" | "OUT_FOR_DELIVERY" | "DELIVERED" | "PICKED_UP";

const STATUS_LABELS: Record<OrderStatus, string> = {
  ALL: "All Orders",
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  PREPARING: "Preparing",
  READY_FOR_PICKUP: "Ready for Pickup",
  OUT_FOR_DELIVERY: "Out for Delivery",
  DELIVERED: "Delivered",
  PICKED_UP: "Picked Up",
};

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  CONFIRMED: "bg-blue-100 text-blue-800",
  PREPARING: "bg-purple-100 text-purple-800",
  READY_FOR_PICKUP: "bg-green-100 text-green-800",
  OUT_FOR_DELIVERY: "bg-indigo-100 text-indigo-800",
  DELIVERED: "bg-green-100 text-green-800",
  PICKED_UP: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
};

const PAYMENT_STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-orange-100 text-orange-800",
  VERIFIED: "bg-green-100 text-green-800",
  PAID: "bg-blue-100 text-blue-800",
};

const NEXT_STATUS_OPTIONS: Record<string, string[]> = {
  PENDING: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["PREPARING", "CANCELLED"],
  PREPARING: ["READY_FOR_PICKUP", "OUT_FOR_DELIVERY"],
  READY_FOR_PICKUP: ["PICKED_UP"],
  OUT_FOR_DELIVERY: ["DELIVERED"],
  DELIVERED: [],
  PICKED_UP: [],
  CANCELLED: [],
};

export default function SellerOrdersContent() {
  const { status: sessionStatus } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>("ALL");
  const [updatingOrders, setUpdatingOrders] = useState<Set<string>>(new Set());

  const fetchOrders = useCallback(async () => {
    try {
      const url = selectedStatus === "ALL" ? "/api/shop/orders" : `/api/shop/orders?status=${selectedStatus}`;

      const response = await fetch(url);
      if (!response.ok) {
        if (response.status === 404) {
          router.push("/shop/setup");
          return;
        }
        throw new Error("Failed to fetch orders");
      }
      const data = await response.json();
      setOrders(data);
    } catch {
      // Error handled
    } finally {
      setLoading(false);
    }
  }, [selectedStatus, router]);

  useEffect(() => {
    if (sessionStatus === "unauthenticated") {
      router.push("/auth/signin");
      return;
    }

    if (sessionStatus === "authenticated") {
      fetchOrders();
    }
  }, [sessionStatus, router, fetchOrders]);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setUpdatingOrders((prev) => new Set(prev).add(orderId));

    try {
      const response = await fetch(`/api/shop/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update order status");
      }

      // Refresh orders list
      await fetchOrders();
    } catch {
      // Error handled
    } finally {
      setUpdatingOrders((prev) => {
        const newSet = new Set(prev);
        newSet.delete(orderId);
        return newSet;
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <LoadingState message="Loading orders..." />
      </div>
    );
  }

  return (
    <div className="bg-cream-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Orders</h1>
          <p className="text-muted-foreground mt-1">Manage and track your shop orders</p>
        </div>

        <Tabs value={selectedStatus} onValueChange={(v) => setSelectedStatus(v as OrderStatus)} className="mb-6">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
            <TabsTrigger value="ALL">All</TabsTrigger>
            <TabsTrigger value="PENDING">Pending</TabsTrigger>
            <TabsTrigger value="CONFIRMED">Confirmed</TabsTrigger>
            <TabsTrigger value="PREPARING">Preparing</TabsTrigger>
            <TabsTrigger value="READY_FOR_PICKUP" className="hidden lg:flex">
              Ready
            </TabsTrigger>
            <TabsTrigger value="OUT_FOR_DELIVERY" className="hidden lg:flex">
              Delivery
            </TabsTrigger>
            <TabsTrigger value="DELIVERED" className="hidden lg:flex">
              Delivered
            </TabsTrigger>
            <TabsTrigger value="PICKED_UP" className="hidden lg:flex">
              Picked Up
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {orders.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center py-12">
              <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                {selectedStatus === "ALL" ? "No orders yet" : `No ${STATUS_LABELS[selectedStatus].toLowerCase()} orders`}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Card key={order.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1 flex-1">
                      <CardTitle className="text-lg">Order #{order.orderNumber}</CardTitle>
                      <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {formatDate(order.createdAt)}
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          {order.customer.name}
                        </div>
                        <div className="flex items-center gap-1">
                          <Phone className="h-4 w-4" />
                          {order.customer.phone}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="flex gap-2">
                        <Badge className={STATUS_COLORS[order.status]}>{STATUS_LABELS[order.status as OrderStatus] || order.status}</Badge>
                        <Badge className={PAYMENT_STATUS_COLORS[order.paymentStatus] || "bg-gray-100 text-gray-800"}>
                          {order.paymentStatus === "PENDING" && (order.receiptUrl ? "Pending Verification" : "Awaiting Receipt")}
                          {order.paymentStatus === "VERIFIED" && "Verified"}
                          {order.paymentStatus === "PAID" && "Paid"}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3">
                        {order.receiptUrl ? (
                          <div className="flex items-center gap-1 text-green-600 text-xs">
                            <CheckCircle className="h-3 w-3" />
                            Receipt
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-orange-600 text-xs">
                            <AlertCircle className="h-3 w-3" />
                            No Receipt
                          </div>
                        )}
                        <div className="font-semibold">MVR {parseFloat(order.total).toFixed(2)}</div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium mb-2">Items</h4>
                      <div className="space-y-2">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex justify-between text-sm">
                            <span>
                              {item.product.name} × {item.quantity}
                            </span>
                            <span className="text-muted-foreground">MVR {parseFloat(item.price).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Delivery Type:</span>
                        <span className="text-sm capitalize">{order.deliveryType.replace("_", " ").toLowerCase()}</span>
                      </div>
                    </div>

                    <div className="pt-4 border-t flex gap-3">
                      {(NEXT_STATUS_OPTIONS[order.status]?.length ?? 0) > 0 && (
                        <div className="flex-1">
                          <label className="text-sm font-medium mb-2 block">Update Status</label>
                          <Select
                            value={order.status}
                            onValueChange={(value) => handleStatusChange(order.id, value)}
                            disabled={updatingOrders.has(order.id)}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value={order.status}>{STATUS_LABELS[order.status as OrderStatus] || order.status}</SelectItem>
                              {(NEXT_STATUS_OPTIONS[order.status] || []).map((status) => (
                                <SelectItem key={status} value={status}>
                                  {STATUS_LABELS[status as OrderStatus] || status}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                      <div className={!NEXT_STATUS_OPTIONS[order.status]?.length ? "flex-1" : ""}>
                        <label className="text-sm font-medium mb-2 block">&nbsp;</label>
                        <Button variant="outline" className="w-full" onClick={() => router.push(`/shop/orders/${order.id}`)}>
                          <Eye className="h-4 h-4 mr-2" />
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
