"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ProductCategory } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Gamepad2, Stethoscope, Cat, Bird, Fish, Turtle, Rabbit, Package } from "lucide-react";

const CATEGORY_CONFIG = {
  // Live Animals - Green theme with visual distinction
  [ProductCategory.CATS]: {
    label: "Cats",
    icon: Cat,
    color: "bg-green-100 text-green-700 hover:bg-green-200 border-2 border-green-300",
    isLiveAnimal: true,
  },
  [ProductCategory.BIRDS]: {
    label: "Birds",
    icon: Bird,
    color: "bg-green-100 text-green-700 hover:bg-green-200 border-2 border-green-300",
    isLiveAnimal: true,
  },
  [ProductCategory.FISH]: {
    label: "Fish",
    icon: Fish,
    color: "bg-green-100 text-green-700 hover:bg-green-200 border-2 border-green-300",
    isLiveAnimal: true,
  },
  [ProductCategory.REPTILES]: {
    label: "Reptiles",
    icon: Turtle,
    color: "bg-green-100 text-green-700 hover:bg-green-200 border-2 border-green-300",
    isLiveAnimal: true,
  },
  [ProductCategory.SMALL_PETS]: {
    label: "Small Pets",
    icon: Rabbit,
    color: "bg-green-100 text-green-700 hover:bg-green-200 border-2 border-green-300",
    isLiveAnimal: true,
  },
  // Products - Various colors
  [ProductCategory.PET_FOOD]: {
    label: "Pet Food",
    icon: Package,
    color: "bg-amber-100 text-amber-700 hover:bg-amber-200",
    isLiveAnimal: false,
  },
  [ProductCategory.ACCESSORIES]: {
    label: "Accessories",
    icon: ShoppingBag,
    color: "bg-purple-100 text-purple-700 hover:bg-purple-200",
    isLiveAnimal: false,
  },
  [ProductCategory.TOYS]: {
    label: "Toys",
    icon: Gamepad2,
    color: "bg-blue-100 text-blue-700 hover:bg-blue-200",
    isLiveAnimal: false,
  },
  [ProductCategory.HEALTH_CARE]: {
    label: "Health Care",
    icon: Stethoscope,
    color: "bg-red-100 text-red-700 hover:bg-red-200",
    isLiveAnimal: false,
  },
};

interface CategoryFilterProps {
  selectedCategory?: string | null;
}

export default function CategoryFilter({ selectedCategory }: CategoryFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleCategoryChange = (category: ProductCategory | null) => {
    const params = new URLSearchParams(searchParams.toString());

    if (category) {
      params.set("category", category);
    } else {
      params.delete("category");
    }

    params.delete("page");

    router.push(`/marketplace?${params.toString()}`);
  };

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-gray-700">Filter by Category</h3>

      <div className="flex flex-wrap gap-2">
        {/* All Products Button */}
        <Button variant={!selectedCategory ? "default" : "outline"} size="sm" onClick={() => handleCategoryChange(null)} className="h-auto py-2 px-3">
          All Products
        </Button>

        {/* Category Buttons */}
        {Object.entries(CATEGORY_CONFIG).map(([category, config]) => {
          const Icon = config.icon;
          const isSelected = selectedCategory === category;

          return (
            <Button
              key={category}
              variant={isSelected ? "default" : "outline"}
              size="sm"
              onClick={() => handleCategoryChange(category as ProductCategory)}
              className={`h-auto py-2 px-3 flex items-center gap-2 relative ${isSelected ? "" : config.color}`}>
              <Icon className="w-4 h-4" />
              {config.label}
              {config.isLiveAnimal && <span className="ml-1 text-[10px] font-semibold bg-green-600 text-white px-1.5 py-0.5 rounded">LIVE</span>}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
