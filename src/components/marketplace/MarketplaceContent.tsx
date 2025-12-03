"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { ProductCategory, Prisma } from "@prisma/client";
import ProductCard from "./ProductCard";
import CategoryFilter from "./CategoryFilter";
import Pagination from "./Pagination";

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

interface ProductResponse {
  products: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export default function MarketplaceContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get search parameters
  const category = searchParams.get("category");
  const search = searchParams.get("search");
  const page = parseInt(searchParams.get("page") || "1");

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (category) params.set("category", category);
      if (search) params.set("search", search);
      params.set("page", page.toString());
      params.set("limit", "12");

      const response = await fetch(`/api/products?${params.toString()}`);
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }

      const data: ProductResponse = await response.json();
      setProducts(data.products);
      setPagination(data.pagination);
    } catch {
      setError("Failed to load products. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [category, search, page]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  if (loading) {
    return <MarketplaceLoading />;
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">{error}</div>
        <button onClick={fetchProducts} className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Category Filter */}
      <div className="space-y-4">
        <CategoryFilter selectedCategory={category} />
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-gray-600">
          {pagination.total > 0 ? (
            <>
              Showing {(pagination.page - 1) * pagination.limit + 1} - {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
              {pagination.total} products
              {category && ` in ${category.replace("_", " ").toLowerCase()}`}
              {search && ` for "${search}"`}
            </>
          ) : (
            "No products found"
          )}
        </p>
      </div>

      {/* Products Grid */}
      {products.length > 0 ? (
        <div className="flex flex-wrap gap-8 justify-center items-center">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg mb-2">No products found</div>
          <p className="text-gray-400">{search || category ? "Try adjusting your search or category filter" : "Check back later for new products"}</p>
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination currentPage={pagination.page} totalPages={pagination.totalPages} hasNext={pagination.hasNext} hasPrev={pagination.hasPrev} />
        </div>
      )}
    </div>
  );
}

function MarketplaceLoading() {
  return (
    <div className="space-y-6">
      {/* Category Filter Skeleton */}
      <div className="flex flex-wrap gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-10 w-24 bg-gray-200 rounded-lg animate-pulse" />
        ))}
      </div>

      {/* Products Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-md p-4 space-y-4">
            <div className="h-48 bg-gray-200 rounded-lg animate-pulse" />
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded animate-pulse" />
              <div className="h-3 bg-gray-200 rounded w-3/4 animate-pulse" />
              <div className="h-5 bg-gray-200 rounded w-1/2 animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
