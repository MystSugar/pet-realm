import { useRouter } from "next/navigation";
import { ProductCategory, Prisma } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart } from "lucide-react";
import { formatPrice, calculateTotal, TAX_RATE } from "@/lib/utils/currency";

interface CartSummaryProps {
  items: Array<{
    quantity: number;
    product: {
      price: Prisma.Decimal | number;
      category: ProductCategory;
    };
  }>;
}

export default function CartSummary({ items }: CartSummaryProps) {
  const router = useRouter();

  // Calculate subtotal
  const subtotal = items.reduce((total, item) => {
    const price = typeof item.product.price === "number" ? item.product.price : parseFloat(item.product.price.toString());
    return total + price * item.quantity;
  }, 0);

  const tax = subtotal * TAX_RATE;
  const total = calculateTotal(subtotal);

  const handleCheckout = () => {
    router.push("/checkout");
  };

  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingCart className="w-5 h-5" />
          Order Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-medium">{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Tax (TGST {(TAX_RATE * 100).toFixed(0)}%)</span>
            <span className="font-medium">{formatPrice(tax)}</span>
          </div>
        </div>

        <Separator />

        <div className="flex justify-between text-lg font-bold">
          <span>Total</span>
          <span className="text-primary-600">{formatPrice(total)}</span>
        </div>

        <Button size="lg" className="w-full" onClick={handleCheckout} disabled={items.length === 0}>
          Proceed to Checkout
        </Button>

        <div className="text-xs text-gray-500 text-center">Shipping costs will be calculated at checkout</div>
      </CardContent>
    </Card>
  );
}
