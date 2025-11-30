import { useState, useCallback } from "react";

/**
 * useApi Hook
 *
 * Manages API calls with loading, error, and data states
 */

interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface ApiActions<T> {
  execute: (...args: unknown[]) => Promise<T | undefined>;
  reset: () => void;
}

type ApiFunction<T> = (...args: unknown[]) => Promise<T>;

export function useApi<T>(apiFunction: ApiFunction<T>): ApiState<T> & ApiActions<T> {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(
    async (...args: unknown[]): Promise<T | undefined> => {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
        const result = await apiFunction(...args);
        setState({ data: result, loading: false, error: null });
        return result;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
        setState((prev) => ({ ...prev, loading: false, error: errorMessage }));
        return undefined;
      }
    },
    [apiFunction]
  );

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return {
    data: state.data,
    loading: state.loading,
    error: state.error,
    execute,
    reset,
  };
}

/**
 * Example usage:
 *
 * const fetchProducts = async (category: string) => {
 *   const response = await fetch(`/api/products?category=${category}`);
 *   return response.json();
 * };
 *
 * const { data: products, loading, error, execute } = useApi(fetchProducts);
 *
 * // Trigger API call
 * execute('dogs');
 */
