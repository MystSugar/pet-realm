"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, Truck, Store, Loader2 } from "lucide-react";
import { formatPrice, calculateTotal, TAX_RATE } from "@/lib/utils/currency";
import { Prisma } from "@prisma/client";
import { LoadingState } from "@/components/ui/loading-state";

interface CartItem {
  id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: Prisma.Decimal | number;
    imagesUrl: string[];
    stock: number;
    shop: {
      id: string;
      name: string;
      island: string;
      atoll: string;
      deliveryFee: Prisma.Decimal | null;
    };
  };
}

const ISLANDS = ["Male'", "Hulhumale Phase 1", "Hulhumale Phase 2", "Villimale"] as const;

const ATOLLS = ["K"] as const;

const PAYMENT_METHODS = [{ id: "bank_transfer", name: "Bank Transfer", description: "Upload receipt after payment" }];

export default function CheckoutContent() {
  const router = useRouter();
  const { status } = useSession();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [deliveryType, setDeliveryType] = useState<"PICKUP" | "DELIVERY">("DELIVERY");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [deliveryIsland, setDeliveryIsland] = useState<string>("");
  const [deliveryAtoll, setDeliveryAtoll] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState("bank_transfer");

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/cart");
      if (!response.ok) throw new Error("Failed to fetch cart");
      const data = await response.json();

      if (!data.cartItems || data.cartItems.length === 0) {
        router.push("/cart");
        return;
      }

      setCartItems(data.cartItems);
    } catch {
      setError("Failed to load cart items");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
      return;
    }

    if (status === "authenticated") {
      fetchCart();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, router]);

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      const price = typeof item.product.price === "number" ? item.product.price : parseFloat(item.product.price.toString());
      return total + price * item.quantity;
    }, 0);
  };

  const calculateDeliveryFee = () => {
    if (deliveryType === "PICKUP") return 0;

    // Get delivery fee from the first shop (assuming single shop checkout)
    const shop = cartItems[0]?.product.shop;
    if (!shop?.deliveryFee) return 0;

    return typeof shop.deliveryFee === "number" ? shop.deliveryFee : parseFloat(shop.deliveryFee.toString());
  };

  const subtotal = calculateSubtotal();
  const deliveryFee = calculateDeliveryFee();
  const tax = calculateTotal(subtotal) - subtotal;
  const total = subtotal + tax + deliveryFee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (deliveryType === "DELIVERY") {
      if (!deliveryAddress || !deliveryIsland || !deliveryAtoll) {
        setError("Please fill in all delivery details");
        return;
      }
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          deliveryType,
          deliveryAddress: deliveryType === "DELIVERY" ? deliveryAddress : null,
          deliveryIsland: deliveryType === "DELIVERY" ? deliveryIsland : null,
          deliveryAtoll: deliveryType === "DELIVERY" ? deliveryAtoll : null,
          paymentMethod,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create order");
      }

      const data = await response.json();
      router.push(`/orders/${data.order.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create order");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl min-h-[calc(100vh-200px)]">
        <LoadingState message="Loading checkout..." />
      </div>
    );
  }

  if (cartItems.length === 0) {
    return null;
  }

  // Check if multiple shops (not supported yet)
  const shopIds = new Set(cartItems.map((item) => item.product.shop.id));
  if (shopIds.size > 1) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              Currently, orders can only contain items from a single shop. Please checkout items from one shop at a time.
            </p>
            <div className="flex justify-center mt-4">
              <Button onClick={() => router.push("/cart")}>Back to Cart</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const shop = cartItems[0]?.product.shop;
  if (!shop) {
    return null;
  }

  return (
    <div className="bg-cream-50 min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Forms */}
            <div className="lg:col-span-2 space-y-6">
              {/* Order Items */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingBag className="h-5 w-5" />
                    Order Items
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Store className="h-4 w-4" />
                      <span>
                        From: <strong>{shop.name}</strong>
                      </span>
                      <Badge variant="outline" className="ml-2">
                        {shop.island}, {shop.atoll}
                      </Badge>
                    </div>
                    <Separator />
                    {cartItems.map((item) => {
                      const price = typeof item.product.price === "number" ? item.product.price : parseFloat(item.product.price.toString());
                      const imageUrl =
                        item.product.imagesUrl[0] ||
                        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%23f0f0f0' width='100' height='100'/%3E%3C/svg%3E";

                      return (
                        <div key={item.id} className="flex gap-4">
                          <div className="relative h-20 w-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                            <Image src={imageUrl} alt={item.product.name} fill className="object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium truncate">{item.product.name}</h3>
                            <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                            <p className="font-medium mt-1">{formatPrice(price * item.quantity)}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Delivery Options */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="h-5 w-5" />
                    Delivery Method
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <RadioGroup value={deliveryType} onValueChange={(value: string) => setDeliveryType(value as "PICKUP" | "DELIVERY")}>
                    <div className="flex items-center space-x-2 p-4 border rounded-lg cursor-pointer hover:bg-accent">
                      <RadioGroupItem value="DELIVERY" id="delivery" />
                      <Label htmlFor="delivery" className="flex-1 cursor-pointer">
                        <div className="flex items-center gap-2">
                          <Truck className="h-4 w-4" />
                          <div>
                            <div className="font-medium">Delivery</div>
                            <div className="text-sm text-muted-foreground">
                              {shop.deliveryFee
                                ? `Delivery fee: ${formatPrice(parseFloat(shop.deliveryFee.toString()))}`
                                : "Delivery fee to be determined"}
                            </div>
                          </div>
                        </div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-4 border rounded-lg cursor-pointer hover:bg-accent">
                      <RadioGroupItem value="PICKUP" id="pickup" />
                      <Label htmlFor="pickup" className="flex-1 cursor-pointer">
                        <div className="flex items-center gap-2">
                          <Store className="h-4 w-4" />
                          <div>
                            <div className="font-medium">Pickup from Shop</div>
                            <div className="text-sm text-muted-foreground">
                              {shop.island}, {shop.atoll}
                            </div>
                          </div>
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>

                  {deliveryType === "DELIVERY" && (
                    <div className="space-y-4 pt-4 border-t">
                      <div className="space-y-2">
                        <Label htmlFor="address">Delivery Address *</Label>
                        <Input
                          id="address"
                          placeholder="Enter your full address"
                          value={deliveryAddress}
                          onChange={(e) => setDeliveryAddress(e.target.value)}
                          required={deliveryType === "DELIVERY"}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="island">Island *</Label>
                          <select
                            id="island"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            value={deliveryIsland}
                            onChange={(e) => setDeliveryIsland(e.target.value)}
                            required={deliveryType === "DELIVERY"}>
                            <option value="">Select island</option>
                            {ISLANDS.map((island) => (
                              <option key={island} value={island}>
                                {island}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="atoll">Atoll *</Label>
                          <select
                            id="atoll"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            value={deliveryAtoll}
                            onChange={(e) => setDeliveryAtoll(e.target.value)}
                            required={deliveryType === "DELIVERY"}>
                            <option value="">Select atoll</option>
                            {ATOLLS.map((atoll) => (
                              <option key={atoll} value={atoll}>
                                {atoll}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card>
                <CardHeader>
                  <CardTitle>Payment Method</CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                    {PAYMENT_METHODS.map((method) => (
                      <div key={method.id} className="flex items-center space-x-2 p-4 border rounded-lg">
                        <RadioGroupItem value={method.id} id={method.id} />
                        <Label htmlFor={method.id} className="flex-1 cursor-pointer">
                          <div className="font-medium">{method.name}</div>
                          <div className="text-sm text-muted-foreground">{method.description}</div>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tax ({(TAX_RATE * 100).toFixed(0)}%)</span>
                      <span>{formatPrice(tax)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Delivery</span>
                      <span>{deliveryFee > 0 ? formatPrice(deliveryFee) : "Free"}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span>{formatPrice(total)}</span>
                    </div>
                  </div>

                  <Button type="submit" className="w-full" size="lg" disabled={submitting}>
                    {submitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating Order...
                      </>
                    ) : (
                      "Place Order"
                    )}
                  </Button>

                  <p className="text-xs text-center text-muted-foreground">By placing this order, you agree to our terms and conditions</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
