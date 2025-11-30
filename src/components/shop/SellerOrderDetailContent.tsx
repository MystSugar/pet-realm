"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle, Clock, Package, Truck, MapPin, User, Phone, Mail, CreditCard, AlertCircle, ArrowLeft, Eye, XCircle } from "lucide-react";
import { formatPrice } from "@/lib/utils/currency";
import { Prisma, OrderStatus, PaymentStatus, DeliveryType } from "@prisma/client";
import ReceiptModal from "@/components/orders/ReceiptModal";
import { LoadingState } from "@/components/ui/loading-state";

interface OrderItem {
  id: string;
  quantity: number;
  price: Prisma.Decimal | number;
  product: {
    id: string;
    name: string;
    imagesUrl: string[];
  };
}

interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  subtotal: Prisma.Decimal | number;
  tax: Prisma.Decimal | number;
  delivery: Prisma.Decimal | number;
  total: Prisma.Decimal | number;
  deliveryType: DeliveryType;
  deliveryAddress: string;
  deliveryIsland: string;
  deliveryAtoll: string;
  receiptUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
  customer: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
  items: OrderItem[];
  shop: {
    id: string;
    name: string;
    bankName: string | null;
    accountHolderName: string | null;
    accountNumber: string | null;
  };
}

interface SellerOrderDetailContentProps {
  orderId: string;
}

const STATUS_CONFIG = {
  PENDING: { label: "Pending", color: "bg-yellow-500", icon: Clock },
  CONFIRMED: { label: "Confirmed", color: "bg-blue-500", icon: CheckCircle },
  PREPARING: { label: "Preparing", color: "bg-purple-500", icon: Package },
  READY_FOR_PICKUP: { label: "Ready for Pickup", color: "bg-green-500", icon: CheckCircle },
  OUT_FOR_DELIVERY: { label: "Out for Delivery", color: "bg-blue-500", icon: Truck },
  DELIVERED: { label: "Delivered", color: "bg-green-500", icon: CheckCircle },
  PICKED_UP: { label: "Picked Up", color: "bg-green-500", icon: CheckCircle },
  CANCELLED: { label: "CANCELLED", color: "bg-red-500", icon: XCircle },
};

const PAYMENT_STATUS_CONFIG = {
  PENDING: { label: "Pending", color: "bg-orange-500" },
  VERIFIED: { label: "Verified", color: "bg-green-500" },
  PAID: { label: "Paid", color: "bg-blue-500" },
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

export default function SellerOrderDetailContent({ orderId }: SellerOrderDetailContentProps) {
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [updatingPayment, setUpdatingPayment] = useState(false);
  const [receiptModalOpen, setReceiptModalOpen] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/shop/orders/${orderId}`);

        if (!response.ok) {
          if (response.status === 404) {
            setError("Order not found");
          } else if (response.status === 403) {
            setError("You don't have permission to view this order");
          } else {
            throw new Error("Failed to fetch order");
          }
          return;
        }

        const data = await response.json();
        setOrder(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load order");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  const refetchOrder = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/shop/orders/${orderId}`);

      if (!response.ok) {
        if (response.status === 404) {
          setError("Order not found");
        } else if (response.status === 403) {
          setError("You don't have permission to view this order");
        } else {
          throw new Error("Failed to fetch order");
        }
        return;
      }

      const data = await response.json();
      setOrder(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load order");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!order) return;

    try {
      setUpdatingStatus(true);
      const response = await fetch(`/api/shop/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to update status");
      }

      await refetchOrder();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update status");
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handlePaymentVerification = async () => {
    if (!order) return;

    try {
      setUpdatingPayment(true);
      const response = await fetch(`/api/shop/orders/${orderId}/verify-payment`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to verify payment");
      }

      await refetchOrder();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to verify payment");
    } finally {
      setUpdatingPayment(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl bg-cream-50">
        <LoadingState message="Loading order details..." />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl bg-cream-50">
        <Card>
          <CardContent className="pt-6 text-center py-12">
            <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
            <p className="text-lg font-medium mb-2">{error || "Order not found"}</p>
            <Button onClick={() => router.push("/shop/orders")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Orders
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const StatusIcon = STATUS_CONFIG[order.status].icon;
  const subtotal = Number(order.subtotal);
  const tax = Number(order.tax);
  const delivery = Number(order.delivery);

  return (
    <div className="bg-cream-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-6">
          <Button variant="ghost" onClick={() => router.push("/shop/orders")} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Orders
          </Button>
          <h1 className="text-3xl font-bold">Order #{order.orderNumber}</h1>
          <p className="text-muted-foreground">
            Placed on{" "}
            {new Date(order.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Status Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <StatusIcon className="w-5 h-5" />
                  Order Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Current Status</p>
                    <Badge className={`${STATUS_CONFIG[order.status].color} text-white`}>{STATUS_CONFIG[order.status].label}</Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Delivery Type</p>
                    <p className="font-medium capitalize">{order.deliveryType.replace("_", " ").toLowerCase()}</p>
                  </div>
                </div>

                {(NEXT_STATUS_OPTIONS[order.status]?.length ?? 0) > 0 && (
                  <div>
                    <label className="text-sm font-medium mb-2 block">Update Order Status</label>
                    <Select value={order.status} onValueChange={handleStatusChange} disabled={updatingStatus}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={order.status}>{STATUS_CONFIG[order.status].label}</SelectItem>
                        {(NEXT_STATUS_OPTIONS[order.status] ?? []).map((status) => (
                          <SelectItem key={status} value={status}>
                            {STATUS_CONFIG[status as OrderStatus].label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Customer Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Customer Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Name</p>
                    <p className="font-medium">{order.customer.name}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <a href={`tel:${order.customer.phone}`} className="font-medium text-primary-600 hover:underline">
                      {order.customer.phone}
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <a href={`mailto:${order.customer.email}`} className="font-medium text-primary-600 hover:underline">
                      {order.customer.email}
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Delivery Address */}
            {order.deliveryType === "DELIVERY" ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Delivery Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="font-medium">{order.deliveryAddress}</p>
                    <p className="text-muted-foreground">
                      {order.deliveryIsland}, {order.deliveryAtoll}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    Pickup Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Customer will pick up the order from your shop location.</p>
                </CardContent>
              </Card>
            )}

            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Order Items
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        {item.product.imagesUrl[0] ? (
                          <Image src={item.product.imagesUrl[0]} alt={item.product.name} fill className="object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="w-8 h-8 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <Link href={`/products/${item.product.id}`} className="font-medium hover:text-primary-600 transition-colors">
                          {item.product.name}
                        </Link>
                        <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                        <p className="text-sm font-medium mt-1">
                          {formatPrice(Number(item.price))} × {item.quantity} = {formatPrice(Number(item.price) * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tax (8%)</span>
                      <span>{formatPrice(tax)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Delivery</span>
                      <span>{delivery > 0 ? formatPrice(delivery) : "Free"}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span>{formatPrice(Number(order.total))}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Payment Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Payment Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Badge
                    className={`${
                      PAYMENT_STATUS_CONFIG[order.paymentStatus as keyof typeof PAYMENT_STATUS_CONFIG]?.color || "bg-gray-500"
                    } text-white`}>
                    {PAYMENT_STATUS_CONFIG[order.paymentStatus as keyof typeof PAYMENT_STATUS_CONFIG]?.label || order.paymentStatus}
                  </Badge>
                </div>

                {/* Bank Account Info */}
                {(order.shop.bankName || order.shop.accountHolderName || order.shop.accountNumber) && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
                    <p className="text-sm font-medium text-blue-900">Your Bank Details</p>
                    {order.shop.bankName && (
                      <div>
                        <p className="text-xs text-blue-700">Bank</p>
                        <p className="text-sm font-medium text-blue-900">{order.shop.bankName}</p>
                      </div>
                    )}
                    {order.shop.accountHolderName && (
                      <div>
                        <p className="text-xs text-blue-700">Account Holder</p>
                        <p className="text-sm font-medium text-blue-900">{order.shop.accountHolderName}</p>
                      </div>
                    )}
                    {order.shop.accountNumber && (
                      <div>
                        <p className="text-xs text-blue-700">Account Number</p>
                        <p className="text-sm font-medium text-blue-900">{order.shop.accountNumber}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Receipt Section */}
                <div>
                  <p className="text-sm font-medium mb-2">Payment Receipt</p>
                  {order.receiptUrl ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-green-600 text-sm">
                        <CheckCircle className="w-4 h-4" />
                        Receipt uploaded
                      </div>
                      <Button variant="outline" size="sm" className="w-full" onClick={() => setReceiptModalOpen(true)}>
                        <Eye className="w-4 h-4 mr-2" />
                        View Receipt
                      </Button>
                      {order.paymentStatus === "PENDING" && (
                        <Button className="w-full" onClick={handlePaymentVerification} disabled={updatingPayment}>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          {updatingPayment ? "Verifying..." : "Verify Payment"}
                        </Button>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-orange-600 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      Awaiting receipt from customer
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Items</span>
                  <span className="font-medium">{order.items.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Quantity</span>
                  <span className="font-medium">{order.items.reduce((sum, item) => sum + item.quantity, 0)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-base">
                  <span>Total</span>
                  <span>{formatPrice(Number(order.total))}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Receipt Modal */}
        {order.receiptUrl && (
          <ReceiptModal
            isOpen={receiptModalOpen}
            onClose={() => setReceiptModalOpen(false)}
            receiptUrl={order.receiptUrl}
            orderNumber={order.orderNumber}
          />
        )}
      </div>
    </div>
  );
}
