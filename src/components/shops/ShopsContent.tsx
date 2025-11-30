"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ShopCategory } from "@prisma/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Store, Phone, MapPin, Package, Loader2 } from "lucide-react";
import Image from "next/image";

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
  businessHours: string | null;
  createdAt: string;
  _count: {
    products: number;
  };
}

const SHOP_CATEGORIES = {
  PET_STORE: { label: "Pet Store", color: "bg-blue-100 text-blue-700" },
  GROOMING: { label: "Grooming", color: "bg-purple-100 text-purple-700" },
  VETERINARY_CLINIC: { label: "Veterinary Clinic", color: "bg-green-100 text-green-700" },
  BOARDING: { label: "Boarding", color: "bg-orange-100 text-orange-700" },
};

const ISLANDS = ["Male'", "Hulhumale Phase 1", "Hulhumale Phase 2", "Villimale"];

export default function ShopsContentOptionB() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);

  const selectedCategory = searchParams.get("category");
  const selectedIsland = searchParams.get("island");

  const fetchShops = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedCategory) params.set("category", selectedCategory);
      if (selectedIsland) params.set("island", selectedIsland);

      const response = await fetch(`/api/shops?${params.toString()}`);
      const data = await response.json();

      if (response.ok) {
        setShops(data.shops || []);
      }
    } catch {
      // Error handled silently
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShops();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory, selectedIsland]);

  const updateFilter = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/shops?${params.toString()}`);
  };

  const clearFilters = () => {
    router.push("/shops");
  };

  // Use a data URL placeholder matching product cards
  const placeholderLogo =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect width='400' height='300' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='system-ui' font-size='18' fill='%239ca3af'%3ENo Image%3C/text%3E%3C/svg%3E";

  return (
    <div className="bg-cream-50">
      <div className="container mx-auto sm:px-6 lg:px-8 py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Pet Shops</h1>
          <p className="text-gray-600">Discover local pet shops, groomers, veterinary clinics, and boarding facilities</p>
        </div>

        {/* Filters - Compact Dropdowns */}
        <div className="mb-8 flex flex-wrap items-center gap-3">
          <span className="text-sm font-medium text-gray-700">Filter:</span>

          {/* Category Filter */}
          <Select value={selectedCategory || "all"} onValueChange={(val) => updateFilter("category", val === "all" ? null : val)}>
            <SelectTrigger className="w-[180px] bg-white">
              <SelectValue placeholder="Shop Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Shop Types</SelectItem>
              {Object.entries(SHOP_CATEGORIES).map(([key, config]) => (
                <SelectItem key={key} value={key}>
                  {config.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Island Filter */}
          <Select value={selectedIsland || "all"} onValueChange={(val) => updateFilter("island", val === "all" ? null : val)}>
            <SelectTrigger className="w-[180px] bg-white">
              <SelectValue placeholder="Location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Islands</SelectItem>
              {ISLANDS.map((island) => (
                <SelectItem key={island} value={island}>
                  {island}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Clear Filters */}
          {(selectedCategory || selectedIsland) && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="text-gray-600">
              Clear
            </Button>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
          </div>
        )}

        {/* No Results */}
        {!loading && shops.length === 0 && (
          <div className="text-center py-20">
            <Store className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No shops found</h3>
            <p className="text-gray-500 mb-4">Try adjusting your filters</p>
            {(selectedCategory || selectedIsland) && (
              <Button onClick={clearFilters} variant="outline">
                Clear Filters
              </Button>
            )}
          </div>
        )}

        {/* Shop Grid */}
        {!loading && shops.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {shops.map((shop) => (
              <Card
                key={shop.id}
                className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 h-full w-70 overflow-hidden p-0"
                onClick={() => router.push(`/shops/${shop.id}`)}>
                {/* Banner/Logo */}
                <div className="relative h-48 w-full overflow-hidden bg-gray-100">
                  <Image
                    src={shop.banner || shop.logo || placeholderLogo}
                    alt={shop.name}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = placeholderLogo;
                    }}
                  />
                  <Badge className={`absolute top-3 right-3 ${SHOP_CATEGORIES[shop.category].color}`}>{SHOP_CATEGORIES[shop.category].label}</Badge>
                </div>

                <CardContent className="py-4 pb-4 -mt-6 flex flex-col">
                  <div className="flex-1">
                    {/* Shop Name */}
                    <h3 className="font-semibold text-lg mb-2 line-clamp-1 group-hover:text-primary-600 transition-colors">{shop.name}</h3>

                    {/* Description */}
                    {shop.description && <p className="text-gray-600 text-sm mb-3 line-clamp-2">{shop.description}</p>}

                    {/* Location */}
                    <div className="flex items-start gap-2 text-sm text-gray-600 mb-2">
                      <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span className="truncate">
                        {shop.island}, {shop.atoll}
                      </span>
                    </div>

                    {/* Phone */}
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                      <Phone className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">{shop.phone}</span>
                    </div>
                  </div>

                  {/* Product Count */}
                  <div className="flex items-center gap-2 text-sm text-primary-600 font-medium border-t pt-3 mt-auto">
                    <Package className="w-4 h-4" />
                    <span>{shop._count.products} products</span>
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
