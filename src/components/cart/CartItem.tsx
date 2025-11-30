import Image from "next/image";
import Link from "next/link";
import { ProductCategory, Prisma } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Minus, Plus, Trash2, Store } from "lucide-react";
import { formatPrice } from "@/lib/utils/currency";
import { useState } from "react";

interface CartItemProps {
  item: {
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
  };
  onUpdateQuantity: (itemId: string, newQuantity: number) => Promise<void>;
  onRemove: (itemId: string) => Promise<void>;
}

export default function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
  const [updating, setUpdating] = useState(false);
  const [removing, setRemoving] = useState(false);

  const priceValue = typeof item.product.price === "number" ? item.product.price : parseFloat(item.product.price.toString());

  const itemTotal = priceValue * item.quantity;

  const placeholderImage =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect width='400' height='300' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='system-ui' font-size='18' fill='%239ca3af'%3ENo Image%3C/text%3E%3C/svg%3E";

  const imageUrl = item.product.imagesUrl[0] || placeholderImage;

  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity < 1 || newQuantity > item.product.stock || updating) return;

    setUpdating(true);
    try {
      await onUpdateQuantity(item.id, newQuantity);
    } finally {
      setUpdating(false);
    }
  };

  const handleRemove = async () => {
    if (removing) return;

    setRemoving(true);
    try {
      await onRemove(item.id);
    } finally {
      setRemoving(false);
    }
  };

  const formatCategory = (category: ProductCategory) => {
    return category
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (l) => l.toUpperCase());
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex gap-4">
          {/* Product Image */}
          <Link href={`/products/${item.product.id}`} className="flex-shrink-0">
            <div className="relative h-24 w-24 rounded-lg overflow-hidden bg-gray-100">
              <Image src={imageUrl} alt={item.product.name} fill className="object-cover" />
            </div>
          </Link>

          {/* Product Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <Link href={`/products/${item.product.id}`} className="font-semibold text-lg hover:text-primary-600 transition-colors line-clamp-1">
                  {item.product.name}
                </Link>
                <Badge variant="secondary" className="text-xs mt-1">
                  {formatCategory(item.product.category)}
                </Badge>
                <div className="flex items-center gap-1 text-sm text-gray-600 mt-2">
                  <Store className="w-3 h-3" />
                  <span className="truncate">{item.product.shop.name}</span>
                </div>
              </div>

              {/* Remove Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRemove}
                disabled={removing}
                className="text-red-600 hover:text-red-700 hover:bg-red-50">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>

            {/* Price and Quantity Controls */}
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuantityChange(item.quantity - 1)}
                  disabled={item.quantity <= 1 || updating}
                  className="h-8 w-8 p-0">
                  <Minus className="w-3 h-3" />
                </Button>
                <span className="w-12 text-center font-medium">{item.quantity}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuantityChange(item.quantity + 1)}
                  disabled={item.quantity >= item.product.stock || updating}
                  className="h-8 w-8 p-0">
                  <Plus className="w-3 h-3" />
                </Button>
              </div>

              <div className="text-right">
                <div className="text-sm text-gray-500">{formatPrice(priceValue)} each</div>
                <div className="font-bold text-lg text-primary-600">{formatPrice(itemTotal)}</div>
              </div>
            </div>

            {/* Stock Warning */}
            {item.quantity >= item.product.stock && <div className="mt-2 text-xs text-orange-600">Maximum quantity reached</div>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
