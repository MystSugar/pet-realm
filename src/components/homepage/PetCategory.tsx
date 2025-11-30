"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ProductCategory } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { Package, ShoppingBag, Gamepad2, Stethoscope } from "lucide-react";

export interface PetCategoryProps {
  icon?: string;
  lucideIcon?: "package" | "shopping-bag" | "gamepad" | "stethoscope";
  title: string;
  description: string;
  category: ProductCategory;
}

interface CategoryCounts {
  counts: Record<ProductCategory, number>;
}

const LUCIDE_ICONS = {
  package: Package,
  "shopping-bag": ShoppingBag,
  gamepad: Gamepad2,
  stethoscope: Stethoscope,
};

export default function PetCategory({ icon, lucideIcon, title, description, category }: PetCategoryProps) {
  const [productCount, setProductCount] = useState<number | null>(null);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const response = await fetch("/api/products/categories/counts");
        if (response.ok) {
          const data: CategoryCounts = await response.json();
          setProductCount(data.counts[category] || 0);
        }
      } catch {
        // Silently fail - the count will just not be shown
      }
    };

    fetchCounts();
  }, [category]);

  const LucideIconComponent = lucideIcon ? LUCIDE_ICONS[lucideIcon] : null;

  return (
    <Link href={`/marketplace?category=${category}`}>
      <section className="py-8 h-[200px] bg-gradient-to-br from-primary-100 to-secondary-100 rounded-xl shadow-md flex flex-col items-center justify-center group cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
        <div className="flex items-center justify-center mb-4 h-16 w-16">
          {LucideIconComponent ? (
            <LucideIconComponent className="h-12 w-12 text-charcoal group-hover:scale-110 transition-transform duration-300" />
          ) : icon ? (
            <div className="relative h-16 w-16">
              <Image src={icon} alt={`${title} Icon`} fill className="object-contain group-hover:scale-110 transition-transform duration-300" />
            </div>
          ) : null}
        </div>

        <div className="flex items-center gap-2 mb-2">
          <h2 className="text-xl text-center font-bold group-hover:text-primary-600 transition-colors">{title}</h2>
          {productCount !== null && productCount > 0 && (
            <Badge variant="secondary" className="text-sm bg-white">
              {productCount}
            </Badge>
          )}
        </div>

        <p className="text-md text-center text-gray-600 mx-8 group-hover:text-gray-800 transition-colors">{description}</p>
      </section>
    </Link>
  );
}
