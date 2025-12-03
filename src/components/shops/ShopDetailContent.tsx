"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ShopCategory, ProductCategory, Prisma } from "@prisma/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Mail, Clock, ArrowLeft, Store } from "lucide-react";
import Image from "next/image";
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
  isAvailable: boolean;
  shop: {
    id: string;
    name: string;
    island: string;
    atoll: string;
    isVerified: boolean;
  };
}

interface Shop {
  id: string;
  name: string;
  description: string | null;
  logo: string | null;
  banner: string | null;
  category: ShopCategory;
  island: string;
  atoll: string;
  address: string;
  phone: string;
  email: string | null;
  businessHours: {
    days: string[];
    openTime: string;
    closeTime: string;
  } | null;
  createdAt: string;
  products: Product[];
}

const SHOP_CATEGORIES = {
  PET_STORE: { label: "Pet Store", color: "bg-blue-100 text-blue-700" },
  GROOMING: { label: "Grooming", color: "bg-purple-100 text-purple-700" },
  VETERINARY_CLINIC: { label: "Veterinary Clinic", color: "bg-green-100 text-green-700" },
  BOARDING: { label: "Boarding", color: "bg-orange-100 text-orange-700" },
};

const DAY_LABELS: { [key: string]: string } = {
  MON: "Mon",
  TUE: "Tue",
  WED: "Wed",
  THU: "Thu",
  FRI: "Fri",
  SAT: "Sat",
  SUN: "Sun",
};

interface ShopDetailContentProps {
  shopId: string;
}

export default function ShopDetailContent({ shopId }: ShopDetailContentProps) {
  const router = useRouter();
  const [shop, setShop] = useState<Shop | null>(null);
  const [loading, setLoading] = useState(true);

  const placeholderBanner =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1200' height='300'%3E%3Crect width='1200' height='300' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='system-ui' font-size='24' fill='%239ca3af'%3ENo Banner Image%3C/text%3E%3C/svg%3E";

  const placeholderLogo =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect width='200' height='200' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='system-ui' font-size='18' fill='%239ca3af'%3ENo Logo%3C/text%3E%3C/svg%3E";

  const formatBusinessHours = (businessHours: { days: string[]; openTime: string; closeTime: string } | null) => {
    if (!businessHours || businessHours.days.length === 0) return null;

    const daysText = businessHours.days.map((day) => DAY_LABELS[day] || day).join(", ");
    return `${daysText}\n${businessHours.openTime} - ${businessHours.closeTime}`;
  };

  useEffect(() => {
    fetchShop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shopId]);

  const fetchShop = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/shops/${shopId}`);
      const data = await response.json();

      if (response.ok) {
        setShop(data.shop);
      } else {
        router.push("/shops");
      }
    } catch {
      router.push("/shops");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <LoadingState message="Loading shop..." />
      </div>
    );
  }

  if (!shop) {
    return null;
  }

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Banner Section */}
      <div className="relative h-64 md:h-80 bg-gray-100">
        <Image
          src={shop.banner || placeholderBanner}
          alt={shop.name}
          fill
          className="object-cover"
          priority
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = placeholderBanner;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        {/* Back Button */}
        <div className="absolute top-6 left-6">
          <Button variant="secondary" size="sm" onClick={() => router.push("/shops")} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Shops
          </Button>
        </div>
      </div>

      {/* Shop Info Section */}
      <div className="container mx-auto px-4 -mt-20 relative z-10 mb-8 max-w-6xl">
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="flex flex-col md:flex-row md:items-center">
              {/* Logo */}
              <div className="relative w-full md:w-48 h-48 bg-white flex items-center justify-center md:border-r">
                <div className="relative w-32 h-32 rounded-lg overflow-hidden shadow-md">
                  <Image
                    src={shop.logo || placeholderLogo}
                    alt={shop.name}
                    fill
                    className="object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = placeholderLogo;
                    }}
                  />
                </div>
              </div>

              {/* Shop Details */}
              <div className="flex-1 p-6">
                <div className="mb-4">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-2xl md:text-3xl font-bold text-charcoal-800">{shop.name}</h1>
                    <Badge className={SHOP_CATEGORIES[shop.category].color}>{SHOP_CATEGORIES[shop.category].label}</Badge>
                  </div>
                  {shop.description && <p className="text-gray-600 text-sm">{shop.description}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Location */}
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-primary-500 mt-1 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-xs font-medium text-gray-500 uppercase mb-1">Location</p>
                      <p className="text-sm text-gray-800 leading-tight">
                        {shop.address}, {shop.island}
                      </p>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-start gap-2">
                    <Phone className="w-4 h-4 text-primary-500 mt-1 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-xs font-medium text-gray-500 uppercase mb-1">Phone</p>
                      <a href={`tel:${shop.phone}`} className="text-sm text-gray-800 hover:text-primary-600">
                        {shop.phone}
                      </a>
                    </div>
                  </div>

                  {/* Email */}
                  {shop.email && (
                    <div className="flex items-start gap-2">
                      <Mail className="w-4 h-4 text-primary-500 mt-1 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-xs font-medium text-gray-500 uppercase mb-1">Email</p>
                        <a href={`mailto:${shop.email}`} className="text-sm text-gray-800 hover:text-primary-600 break-all">
                          {shop.email}
                        </a>
                      </div>
                    </div>
                  )}

                  {/* Business Hours */}
                  {shop.businessHours && formatBusinessHours(shop.businessHours) && (
                    <div className="flex items-start gap-2">
                      <Clock className="w-4 h-4 text-primary-500 mt-1 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-xs font-medium text-gray-500 uppercase mb-1">Hours</p>
                        <p className="text-sm text-gray-800 whitespace-pre-line leading-tight">{formatBusinessHours(shop.businessHours)}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Products Section */}
      <div className="container mx-auto px-4 pb-12 max-w-6xl">
        <div className="flex items-center gap-3 mb-6">
          <Store className="w-6 h-6 text-gray-700" />
          <h2 className="text-2xl font-bold text-charcoal-800">Products ({shop.products.length})</h2>
        </div>

        {shop.products.length === 0 ? (
          <Card>
            <CardContent className="py-20 text-center">
              <Store className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Products Yet</h3>
              <p className="text-gray-500">This shop hasn&apos;t added any products.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="flex flex-wrap gap-8 items-center justify-center">
            {shop.products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
