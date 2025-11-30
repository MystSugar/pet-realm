"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export default function Pagination({ currentPage, totalPages, hasNext, hasPrev }: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());

    if (page === 1) {
      params.delete("page");
    } else {
      params.set("page", page.toString());
    }

    router.push(`/marketplace?${params.toString()}`);
  };

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages = [];
    const delta = 2; // Number of pages to show on each side of current page

    for (let i = Math.max(1, currentPage - delta); i <= Math.min(totalPages, currentPage + delta); i++) {
      pages.push(i);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex items-center justify-center space-x-2">
      {/* Previous Button */}
      <Button variant="outline" size="sm" onClick={() => handlePageChange(currentPage - 1)} disabled={!hasPrev} className="flex items-center gap-1">
        <ChevronLeft className="w-4 h-4" />
        Previous
      </Button>

      {/* First page if not visible */}
      {pageNumbers.length > 0 && pageNumbers[0]! > 1 && (
        <>
          <Button variant={currentPage === 1 ? "default" : "outline"} size="sm" onClick={() => handlePageChange(1)}>
            1
          </Button>
          {pageNumbers[0]! > 2 && <span className="text-gray-400">...</span>}
        </>
      )}

      {/* Page Numbers */}
      {pageNumbers.map((page) => (
        <Button
          key={page}
          variant={page === currentPage ? "default" : "outline"}
          size="sm"
          onClick={() => handlePageChange(page)}
          className="min-w-[40px]">
          {page}
        </Button>
      ))}

      {/* Last page if not visible */}
      {pageNumbers.length > 0 && pageNumbers[pageNumbers.length - 1]! < totalPages && (
        <>
          {pageNumbers[pageNumbers.length - 1]! < totalPages - 1 && <span className="text-gray-400">...</span>}
          <Button variant={currentPage === totalPages ? "default" : "outline"} size="sm" onClick={() => handlePageChange(totalPages)}>
            {totalPages}
          </Button>
        </>
      )}

      {/* Next Button */}
      <Button variant="outline" size="sm" onClick={() => handlePageChange(currentPage + 1)} disabled={!hasNext} className="flex items-center gap-1">
        Next
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  );
}
