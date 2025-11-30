"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { ProductCategory, Prisma, ShopCategory } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, Store, MapPin, Phone, Mail, ChevronRight, Home, Minus, Plus, Package } from "lucide-react";
import { formatPrice } from "@/lib/utils/currency";
import ProductCard from "@/components/marketplace/ProductCard";
import { LoadingState } from "@/components/ui/loading-state";

interface Product {
  id: string;
  name: string;
  description: string;
  price: Prisma.Decimal | number;
  category: ProductCategory;
  imagesUrl: string[];
  tags: string[];
  stock: number;
  breed?: string | null;
  age?: string | null;
  gender?: string | null;
  weight?: string | null;
  color?: string | null;
  isLiveAnimal: boolean;
  vaccinationStatus?: string | null;
  healthCondition?: string | null;
  specialNeeds?: string | null;
  shop: {
    id: string;
    name: string;
    description: string | null;
    island: string;
    atoll: string;
    phone: string;
    email: string | null;
    isVerified: boolean;
    category: ShopCategory;
  };
}

interface SimilarProduct {
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

interface ProductDetailContentProps {
  productId: string;
}

export default function ProductDetailContent({ productId }: ProductDetailContentProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [product, setProduct] = useState<Product | null>(null);
  const [similarProducts, setSimilarProducts] = useState<SimilarProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [addingToCart, setAddingToCart] = useState(false);

  const fetchProduct = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/products/${productId}`);
      if (!response.ok) {
        if (response.status === 404) {
          setError("Product not found");
        } else {
          throw new Error("Failed to fetch product");
        }
        return;
      }
      const data = await response.json();
      setProduct(data.product);
    } catch {
      setError("Failed to load product. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [productId]);

  const fetchSimilarProducts = useCallback(async () => {
    try {
      const response = await fetch(`/api/products/${productId}/similar?limit=4`);
      if (response.ok) {
        const data = await response.json();
        setSimilarProducts(data.products);
      }
    } catch {
      // Silently fail - similar products are optional
    }
  }, [productId]);

  useEffect(() => {
    fetchProduct();
    fetchSimilarProducts();
  }, [fetchProduct, fetchSimilarProducts]);

  const handleAddToCart = async () => {
    // Check if user is authenticated
    if (!session) {
      router.push("/auth/signin");
      return;
    }

    setAddingToCart(true);
    setError(null);
    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          quantity,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to add to cart");
      }

      router.push("/cart");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add to cart");
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return <LoadingState message="Loading product..." />;
  }

  if (error || !product) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <p className="text-red-800 mb-4">{error || "Product not found"}</p>
          <Button onClick={() => router.push("/marketplace")}>Back to Marketplace</Button>
        </div>
      </div>
    );
  }

  const priceValue = typeof product.price === "number" ? product.price : parseFloat(product.price.toString());

  const formatCategory = (category: ProductCategory) => {
    return category
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const placeholderImage =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect width='400' height='300' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='system-ui' font-size='18' fill='%239ca3af'%3ENo Image%3C/text%3E%3C/svg%3E";

  const images = product.imagesUrl.length > 0 ? product.imagesUrl : [placeholderImage];
  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;
  const isSeller = session?.user?.role === "SELLER";
  const isOwnProduct = session?.user?.id && product.shop.id === session.user.id;
  const canPurchase = !isSeller && !isOwnProduct;

  return (
    <div className="max-w-6xl mx-auto">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
        <Link href="/" className="hover:text-primary-600 flex items-center">
          <Home className="w-4 h-4 mr-1" />
          Home
        </Link>
        <ChevronRight className="w-4 h-4" />
        <Link href="/marketplace" className="hover:text-primary-600">
          Marketplace
        </Link>
        <ChevronRight className="w-4 h-4" />
        <Link href={`/marketplace?category=${product.category}`} className="hover:text-primary-600">
          {formatCategory(product.category)}
        </Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-gray-900 font-medium truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Product Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="relative h-96 w-full rounded-xl overflow-hidden bg-gray-100">
            <Image src={images[selectedImage] || placeholderImage} alt={product.name} fill className="object-cover" priority />
          </div>

          {/* Thumbnail Images */}
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`relative h-20 w-20 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-colors ${
                    selectedImage === idx ? "border-primary-600" : "border-gray-200 hover:border-gray-300"
                  }`}>
                  <Image src={img} alt={`${product.name} ${idx + 1}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <div>
            <Badge variant="secondary" className="mb-3">
              {formatCategory(product.category)}
            </Badge>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
            <p className="text-4xl font-bold text-primary-600 mb-4">{formatPrice(priceValue)}</p>

            {/* Stock Status */}
            <div className="flex items-center gap-2 mb-4">
              <Package className="w-5 h-5 text-gray-500" />
              {isOutOfStock ? (
                <Badge className="bg-red-500 hover:bg-red-600">Out of Stock</Badge>
              ) : isLowStock ? (
                <Badge className="bg-orange-500 hover:bg-orange-600">Only {product.stock} left</Badge>
              ) : (
                <span className="text-gray-600">{product.stock} in stock</span>
              )}
            </div>
          </div>

          <Separator />

          {/* Description */}
          <div>
            <h2 className="font-semibold text-lg mb-2">Description</h2>
            <p className="text-gray-700 whitespace-pre-wrap">{product.description}</p>
          </div>

          {/* Tags */}
          {product.tags.length > 0 && (
            <div>
              <h3 className="font-semibold text-sm mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Live Animal Details */}
          {product.isLiveAnimal && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-3">Pet Details</h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-blue-700 font-medium">Breed:</span>
                  <span className="ml-2 text-blue-900">{product.breed || "Not provided"}</span>
                </div>
                <div>
                  <span className="text-blue-700 font-medium">Age:</span>
                  <span className="ml-2 text-blue-900">{product.age || "Not provided"}</span>
                </div>
                <div>
                  <span className="text-blue-700 font-medium">Gender:</span>
                  <span className="ml-2 text-blue-900">{product.gender || "Not provided"}</span>
                </div>
                <div>
                  <span className="text-blue-700 font-medium">Weight:</span>
                  <span className="ml-2 text-blue-900">{product.weight || "Not provided"}</span>
                </div>
                <div>
                  <span className="text-blue-700 font-medium">Color:</span>
                  <span className="ml-2 text-blue-900">{product.color || "Not provided"}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-blue-700 font-medium">Vaccination:</span>
                  <span className="ml-2 text-blue-900">{product.vaccinationStatus || "Not provided"}</span>
                </div>
                {product.healthCondition && (
                  <div className="col-span-2">
                    <span className="text-blue-700 font-medium">Health:</span>
                    <span className="ml-2 text-blue-900">{product.healthCondition}</span>
                  </div>
                )}
                {product.specialNeeds && (
                  <div className="col-span-2">
                    <span className="text-blue-700 font-medium">Special Needs:</span>
                    <span className="ml-2 text-blue-900">{product.specialNeeds}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          <Separator />

          {/* Quantity Selector & Add to Cart - Only for Customers */}
          {canPurchase ? (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="font-medium">Quantity:</span>
                <div className="flex items-center border rounded-lg">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="h-10 w-10">
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="px-4 font-medium">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={quantity >= product.stock}
                    className="h-10 w-10">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <Button size="lg" className="w-full" onClick={handleAddToCart} disabled={isOutOfStock || addingToCart}>
                <ShoppingCart className="w-5 h-5 mr-2" />
                {addingToCart ? "Adding..." : isOutOfStock ? "Out of Stock" : "Add to Cart"}
              </Button>
            </div>
          ) : (
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <p className="text-sm text-blue-800">
                  {isOwnProduct
                    ? "This is your product. You cannot purchase your own items."
                    : "As a seller, please browse products using a customer account to make purchases."}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Shop Information */}
          <Card>
            <CardContent className="px-8">
              <div className="flex items-start gap-3">
                <Store className="w-5 h-5 text-charcoal mt-1" />
                <div className="flex-1">
                  <Link href={`/shops/${product.shop.id}`} className="font-semibold text-lg hover:text-primary-600 transition-colors">
                    {product.shop.name}
                  </Link>
                  {product.shop.description && <p className="text-sm text-gray-600 mt-1">{product.shop.description}</p>}
                  <div className="mt-3 space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>
                        {product.shop.island}, {product.shop.atoll}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      <a href={`tel:${product.shop.phone}`} className="hover:text-primary-600">
                        {product.shop.phone}
                      </a>
                    </div>
                    {product.shop.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        <a href={`mailto:${product.shop.email}`} className="hover:text-primary-600">
                          {product.shop.email}
                        </a>
                      </div>
                    )}
                  </div>
                  <Button variant="outline" size="sm" className="mt-4" onClick={() => router.push(`/shops/${product.shop.id}`)}>
                    Visit Shop
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Similar Products */}
      {similarProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Similar Products</h2>
          <div className="flex flex-wrap gap-6">
            {similarProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
