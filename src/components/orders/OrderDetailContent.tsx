"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { CheckCircle, Clock, Package, Truck, MapPin, Store, Upload, Loader2, AlertCircle, Home, Eye, RefreshCw } from "lucide-react";
import { formatPrice } from "@/lib/utils/currency";
import { Prisma, OrderStatus, PaymentStatus, DeliveryType } from "@prisma/client";
import ReceiptModal from "./ReceiptModal";
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
  subtotal: Prisma.Decimal | number;
  tax: Prisma.Decimal | number;
  delivery: Prisma.Decimal | number;
  total: Prisma.Decimal | number;
  deliveryType: DeliveryType;
  deliveryAddress: string | null;
  deliveryIsland: string | null;
  deliveryAtoll: string | null;
  paymentMethod: string | null;
  paymentStatus: PaymentStatus;
  receiptUrl: string | null;
  receiptUploadedAt: Date | null;
  confirmedAt: Date | null;
  preparingAt: Date | null;
  readyAt: Date | null;
  outForDeliveryAt: Date | null;
  deliveredAt: Date | null;
  pickedUpAt: Date | null;
  cancelledAt: Date | null;
  createdAt: Date;
  customerId: string;
  items: OrderItem[];
  shop: {
    id: string;
    name: string;
    island: string;
    atoll: string;
    phone: string;
    bankName: string | null;
    accountHolderName: string | null;
    accountNumber: string | null;
  };
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

interface OrderDetailContentProps {
  orderId: string;
}

export default function OrderDetailContent({ orderId }: OrderDetailContentProps) {
  const router = useRouter();
  const { status: authStatus, data: session } = useSession();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploadingReceipt, setUploadingReceipt] = useState(false);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [showReplaceConfirm, setShowReplaceConfirm] = useState(false);

  useEffect(() => {
    if (authStatus === "unauthenticated") {
      router.push("/auth/signin");
      return;
    }

    if (authStatus === "authenticated") {
      fetchOrder();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authStatus, orderId, router]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/orders/${orderId}`);
      if (!response.ok) {
        if (response.status === 404) {
          setError("Order not found");
        } else {
          throw new Error("Failed to fetch order");
        }
        return;
      }
      const data = await response.json();
      setOrder(data.order);
    } catch {
      setError("Failed to load order details");
    } finally {
      setLoading(false);
    }
  };

  const handleReceiptUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!receiptFile) return;

    setUploadingReceipt(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("receipt", receiptFile);

      const response = await fetch(`/api/orders/${orderId}/receipt`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to upload receipt");
      }

      // Refresh order data
      await fetchOrder();
      setReceiptFile(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload receipt");
    } finally {
      setUploadingReceipt(false);
    }
  };

  const handleReplaceReceipt = async () => {
    if (!receiptFile) return;

    setShowReplaceConfirm(false);
    setUploadingReceipt(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("receipt", receiptFile);

      const response = await fetch(`/api/orders/${orderId}/receipt`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to replace receipt");
      }

      // Refresh order data
      await fetchOrder();
      setReceiptFile(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to replace receipt");
    } finally {
      setUploadingReceipt(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl min-h-[calc(100vh-200px)]">
        <LoadingState message="Loading order details..." />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl min-h-[calc(100vh-200px)]">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
              <p className="text-lg font-medium">{error || "Order not found"}</p>
              <Button onClick={() => router.push("/orders")}>View All Orders</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const statusConfig = STATUS_CONFIG[order.status];
  const StatusIcon = statusConfig.icon;

  const subtotal = typeof order.subtotal === "number" ? order.subtotal : parseFloat(order.subtotal.toString());
  const tax = order.tax ? (typeof order.tax === "number" ? order.tax : parseFloat(order.tax.toString())) : 0;
  const delivery = typeof order.delivery === "number" ? order.delivery : parseFloat(order.delivery.toString());
  const total = typeof order.total === "number" ? order.total : parseFloat(order.total.toString());

  const isNewOrder = order.status === "PENDING" && !order.receiptUrl;

  return (
    <div className="bg-cream-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl bg-cream-50">
        {/* Success Message for New Orders */}
        {isNewOrder && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <h2 className="text-lg font-semibold text-green-900 mb-1">Order Placed Successfully!</h2>
                <p className="text-sm text-green-800">Thank you for your order. Please complete the payment and upload your receipt below.</p>
              </div>
            </div>
          </div>
        )}

        {/* Breadcrumb */}
        <nav className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-foreground flex-shrink-0">
            <Home className="h-4 w-4" />
          </Link>
          <span className="flex-shrink-0">/</span>
          <Link href="/orders" className="hover:text-foreground flex-shrink-0">
            Orders
          </Link>
          <span className="flex-shrink-0">/</span>
          <span className="text-foreground break-all">{order.orderNumber}</span>
        </nav>

        <div className="space-y-6">
          {/* Order Header */}
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-xl sm:text-2xl break-all">Order #{order.orderNumber}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
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
                <Badge className={`${statusConfig.color} text-white flex-shrink-0 self-start`}>
                  <StatusIcon className="h-3 w-3 mr-1" />
                  {statusConfig.label}
                </Badge>
              </div>
            </CardHeader>
          </Card>

          {/* Order Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Order Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                    <div className="w-0.5 h-full bg-gray-200 mt-1" />
                  </div>
                  <div className="flex-1 pb-4">
                    <p className="font-medium">Order Placed</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(order.createdAt).toLocaleString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>

                {order.confirmedAt && (
                  <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="h-2 w-2 rounded-full bg-green-500" />
                      <div className="w-0.5 h-full bg-gray-200 mt-1" />
                    </div>
                    <div className="flex-1 pb-4">
                      <p className="font-medium">Order Confirmed</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(order.confirmedAt).toLocaleString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                )}

                {order.preparingAt && (
                  <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="h-2 w-2 rounded-full bg-green-500" />
                      <div className="w-0.5 h-full bg-gray-200 mt-1" />
                    </div>
                    <div className="flex-1 pb-4">
                      <p className="font-medium">Preparing Order</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(order.preparingAt).toLocaleString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                )}

                {order.readyAt && (
                  <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="h-2 w-2 rounded-full bg-green-500" />
                      <div className="w-0.5 h-full bg-gray-200 mt-1" />
                    </div>
                    <div className="flex-1 pb-4">
                      <p className="font-medium">
                        {order.deliveryType === "PICKUP" ? "Ready for Pickup" : "Ready"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(order.readyAt).toLocaleString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                )}

                {order.outForDeliveryAt && (
                  <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="h-2 w-2 rounded-full bg-green-500" />
                      <div className="w-0.5 h-full bg-gray-200 mt-1" />
                    </div>
                    <div className="flex-1 pb-4">
                      <p className="font-medium">Out for Delivery</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(order.outForDeliveryAt).toLocaleString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                )}

                {order.deliveredAt && (
                  <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="h-2 w-2 rounded-full bg-green-500" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">Delivered</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(order.deliveredAt).toLocaleString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                )}

                {order.pickedUpAt && (
                  <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="h-2 w-2 rounded-full bg-green-500" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">Picked Up</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(order.pickedUpAt).toLocaleString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                )}

                {order.cancelledAt && (
                  <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="h-2 w-2 rounded-full bg-red-500" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-red-600">Cancelled</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(order.cancelledAt).toLocaleString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items.map((item) => {
                  const price = typeof item.price === "number" ? item.price : parseFloat(item.price.toString());
                  const imageUrl =
                    item.product.imagesUrl[0] ||
                    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%23f0f0f0' width='100' height='100'/%3E%3C/svg%3E";

                  return (
                    <div key={item.id} className="flex gap-4">
                      <div className="relative h-20 w-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        <Image src={imageUrl} alt={item.product.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{item.product.name}</h3>
                        <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                        <p className="font-medium mt-1">{formatPrice(price * item.quantity)}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <Separator className="my-4" />
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
                  <span>{formatPrice(total)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Delivery Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {order.deliveryType === "DELIVERY" ? <Truck className="h-5 w-5" /> : <Store className="h-5 w-5" />}
                {order.deliveryType === "DELIVERY" ? "Delivery Information" : "Pickup Information"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {order.deliveryType === "DELIVERY" ? (
                <>
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium">{order.deliveryAddress}</p>
                      <p className="text-muted-foreground">
                        {order.deliveryIsland}, {order.deliveryAtoll}
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-sm">
                    <strong>Shop:</strong> {order.shop.name}
                  </p>
                  <p className="text-sm">
                    <strong>Location:</strong> {order.shop.island}, {order.shop.atoll}
                  </p>
                  <p className="text-sm">
                    <strong>Contact:</strong> {order.shop.phone}
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          {/* Payment Information */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm">
                  <strong>Method:</strong> Bank Transfer
                </p>
                <p className="text-sm">
                  <strong>Status:</strong> <Badge variant={order.paymentStatus === "PENDING" ? "secondary" : "default"}>{order.paymentStatus}</Badge>
                </p>
              </div>

              {order.receiptUrl ? (
                <div className="space-y-3">
                  <Label>Uploaded Receipt</Label>
                  <div
                    className="relative w-full max-w-md aspect-video rounded-lg overflow-hidden border cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => setIsReceiptModalOpen(true)}>
                    <Image src={order.receiptUrl} alt="Payment receipt" fill className="object-contain" />
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    {order.receiptUploadedAt && (
                      <p className="text-xs text-muted-foreground">Uploaded on {new Date(order.receiptUploadedAt).toLocaleString()}</p>
                    )}
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button variant="outline" size="sm" onClick={() => setIsReceiptModalOpen(true)} className="w-full sm:w-auto">
                        <Eye className="h-4 w-4 mr-1" />
                        <span className="hidden sm:inline">View Full Size</span>
                        <span className="sm:hidden">View</span>
                      </Button>
                      {session?.user?.id === order.customerId && order.paymentStatus === "PENDING" && (
                        <>
                          <Input
                            id="replace-receipt"
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                setReceiptFile(file);
                                setShowReplaceConfirm(true);
                              }
                            }}
                            disabled={uploadingReceipt}
                            className="hidden"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => document.getElementById("replace-receipt")?.click()}
                            disabled={uploadingReceipt}
                            className="w-full sm:w-auto">
                            <RefreshCw className="h-4 w-4 mr-1" />
                            <span className="hidden sm:inline">Replace Receipt</span>
                            <span className="sm:hidden">Replace</span>
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                  {session?.user?.id === order.customerId && order.paymentStatus === "PENDING" && (
                    <p className="text-xs text-blue-600">You can replace this receipt until the shop verifies your payment.</p>
                  )}
                </div>
              ) : (
                <form onSubmit={handleReceiptUpload} className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-900 font-semibold mb-3">Bank Transfer Details:</p>
                    {order.shop.bankName && order.shop.accountHolderName && order.shop.accountNumber ? (
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-blue-700">Bank Name:</span>
                          <span className="text-blue-900 font-medium">{order.shop.bankName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-blue-700">Account Holder:</span>
                          <span className="text-blue-900 font-medium">{order.shop.accountHolderName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-blue-700">Account Number:</span>
                          <span className="text-blue-900 font-medium">{order.shop.accountNumber}</span>
                        </div>
                        <div className="flex justify-between pt-2 border-t border-blue-200">
                          <span className="text-blue-700">Amount to Transfer:</span>
                          <span className="text-blue-900 font-bold">{formatPrice(total)}</span>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-blue-800">
                        Please contact the shop at {order.shop.phone} for bank account details to transfer {formatPrice(total)}.
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="receipt">Upload Payment Receipt</Label>
                    <Input
                      id="receipt"
                      type="file"
                      accept="image/*"
                      onChange={(e) => setReceiptFile(e.target.files?.[0] || null)}
                      disabled={uploadingReceipt}
                    />
                    <p className="text-xs text-muted-foreground">Accepted formats: JPG, PNG, PDF (max 10MB)</p>
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <p className="text-sm text-red-800">{error}</p>
                    </div>
                  )}

                  <Button type="submit" disabled={!receiptFile || uploadingReceipt} className="w-full sm:w-auto">
                    {uploadingReceipt ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="mr-2 h-4 w-4" />
                        Upload Receipt
                      </>
                    )}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-4">
            <Button variant="outline" onClick={() => router.push("/orders")} className="flex-1">
              View All Orders
            </Button>
            <Button variant="outline" onClick={() => router.push("/marketplace")} className="flex-1">
              Continue Shopping
            </Button>
          </div>
        </div>

        {/* Receipt Modal */}
        {order.receiptUrl && (
          <ReceiptModal
            isOpen={isReceiptModalOpen}
            onClose={() => setIsReceiptModalOpen(false)}
            receiptUrl={order.receiptUrl}
            orderNumber={order.orderNumber}
          />
        )}

        {/* Replace Receipt Confirmation Dialog */}
        <AlertDialog open={showReplaceConfirm} onOpenChange={setShowReplaceConfirm}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Replace Receipt?</AlertDialogTitle>
              <AlertDialogDescription>
                This will replace your current receipt. The shop owner will see the new receipt instead.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setReceiptFile(null)}>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleReplaceReceipt}>
                {uploadingReceipt ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Replacing...
                  </>
                ) : (
                  "Replace Receipt"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
