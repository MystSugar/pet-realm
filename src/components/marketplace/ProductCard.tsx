import Link from "next/link";
import Image from "next/image";
import { ProductCategory, Prisma } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import { formatPrice } from "@/lib/utils/currency";

interface Product {
  id: string;
  name: string;
  description: string;
  price: Prisma.Decimal | number;
  category: ProductCategory;
  imagesUrl: string[];
  tags: string[];
  stock: number;
  shop: {
    id: string;
    name: string;
    island: string;
    atoll: string;
    isVerified: boolean;
  };
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  // Convert Prisma Decimal to number for display
  const priceValue = typeof product.price === "number" ? product.price : parseFloat(product.price.toString());

  const formatCategory = (category: ProductCategory) => {
    return category
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (l) => l.toUpperCase());
  };

  // Use a data URL placeholder instead of a missing file
  const placeholderImage =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect width='400' height='300' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='system-ui' font-size='18' fill='%239ca3af'%3ENo Image%3C/text%3E%3C/svg%3E";

  const imageUrl = product.imagesUrl[0] || placeholderImage;

  return (
    <Link href={`/products/${product.id}`}>
      <Card className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 h-full w-84 overflow-hidden p-0">
        <div className="relative h-48 w-full overflow-hidden bg-gray-100">
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = placeholderImage;
            }}
          />
          {product.stock <= 5 && product.stock > 0 && <Badge className="absolute top-3 left-3 bg-orange-500 hover:bg-orange-600">Low Stock</Badge>}
          {product.stock === 0 && <Badge className="absolute top-3 left-3 bg-red-500 hover:bg-red-600">Out of Stock</Badge>}
        </div>

        <CardContent className="py-4 pb-4 -mt-6 flex flex-col">
          <div className="flex-1">
            <div className="mb-2">
              <Badge variant="secondary" className="text-xs">
                {formatCategory(product.category)}
              </Badge>
            </div>

            <h3 className="font-semibold text-lg mb-2 line-clamp-1 group-hover:text-primary-600 transition-colors">{product.name}</h3>

            <p className="text-gray-600 text-sm mb-3 line-clamp-2 min-h-[calc(1.25rem*2)]">{product.description}</p>

            <div className="min-h-[calc(1.25rem)] mb-3">
              {product.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {product.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {product.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{product.tags.length - 3}
                    </Badge>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-3 mt-auto">
            <div className="flex items-center justify-between">
              <span className="text-xl font-bold text-primary-600">{formatPrice(priceValue)}</span>
              <span className="text-sm text-gray-500">{product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}</span>
            </div>

            <div className="flex items-center text-sm text-gray-500 border-t pt-3">
              <MapPin className="w-4 h-4 mr-1" />
              <span className="truncate">
                {product.shop.name} • {product.shop.island}, {product.shop.atoll}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
