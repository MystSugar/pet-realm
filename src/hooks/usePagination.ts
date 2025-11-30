import { useState, useMemo, useCallback } from "react";

/**
 * usePagination Hook
 *
 * Manages pagination state and calculations
 */

interface PaginationOptions {
  initialPage?: number;
  initialPageSize?: number;
  totalItems?: number;
}

interface PaginationReturn {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startIndex: number;
  endIndex: number;
  goToPage: (page: number) => void;
  goToNextPage: () => void;
  goToPreviousPage: () => void;
  goToFirstPage: () => void;
  goToLastPage: () => void;
  setPageSize: (size: number) => void;
  setTotalItems: (total: number) => void;
}

export function usePagination({ initialPage = 1, initialPageSize = 20, totalItems = 0 }: PaginationOptions = {}): PaginationReturn {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageSize, setPageSizeState] = useState(initialPageSize);
  const [totalItemsState, setTotalItemsState] = useState(totalItems);

  // Calculate derived values
  const calculations = useMemo(() => {
    const totalPages = Math.ceil(totalItemsState / pageSize);
    const hasNextPage = currentPage < totalPages;
    const hasPreviousPage = currentPage > 1;
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize - 1, totalItemsState - 1);

    return {
      totalPages: totalPages || 1,
      hasNextPage,
      hasPreviousPage,
      startIndex,
      endIndex,
    };
  }, [currentPage, pageSize, totalItemsState]);

  // Navigation functions
  const goToPage = useCallback(
    (page: number) => {
      const validPage = Math.max(1, Math.min(page, calculations.totalPages));
      setCurrentPage(validPage);
    },
    [calculations.totalPages]
  );

  const goToNextPage = useCallback(() => {
    if (calculations.hasNextPage) {
      setCurrentPage((prev) => prev + 1);
    }
  }, [calculations.hasNextPage]);

  const goToPreviousPage = useCallback(() => {
    if (calculations.hasPreviousPage) {
      setCurrentPage((prev) => prev - 1);
    }
  }, [calculations.hasPreviousPage]);

  const goToFirstPage = useCallback(() => {
    setCurrentPage(1);
  }, []);

  const goToLastPage = useCallback(() => {
    setCurrentPage(calculations.totalPages);
  }, [calculations.totalPages]);

  const setPageSize = useCallback((size: number) => {
    const newSize = Math.max(1, size);
    setPageSizeState(newSize);
    // Reset to first page when page size changes
    setCurrentPage(1);
  }, []);

  const setTotalItems = useCallback(
    (total: number) => {
      setTotalItemsState(Math.max(0, total));
      // Adjust current page if it's now beyond the last page
      const newTotalPages = Math.ceil(total / pageSize);
      if (currentPage > newTotalPages && newTotalPages > 0) {
        setCurrentPage(newTotalPages);
      }
    },
    [currentPage, pageSize]
  );

  return {
    currentPage,
    pageSize,
    totalItems: totalItemsState,
    totalPages: calculations.totalPages,
    hasNextPage: calculations.hasNextPage,
    hasPreviousPage: calculations.hasPreviousPage,
    startIndex: calculations.startIndex,
    endIndex: calculations.endIndex,
    goToPage,
    goToNextPage,
    goToPreviousPage,
    goToFirstPage,
    goToLastPage,
    setPageSize,
    setTotalItems,
  };
}

/**
 * Example usage:
 *
 * const pagination = usePagination({
 *   initialPage: 1,
 *   initialPageSize: 20,
 *   totalItems: products.length
 * });
 *
 * // Display: "Showing 1-20 of 150 items"
 * const displayText = `Showing ${pagination.startIndex + 1}-${pagination.endIndex + 1} of ${pagination.totalItems} items`;
 */
