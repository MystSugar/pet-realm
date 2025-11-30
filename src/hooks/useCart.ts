import { useCallback } from "react";
import { useLocalStorage } from "./useLocalStorage";

/**
 * useCart Hook
 *
 * Manages shopping cart state with localStorage persistence
 */

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  maxQuantity?: number;
}

interface CartState {
  items: CartItem[];
  itemCount: number;
  totalPrice: number;
  isEmpty: boolean;
}

interface CartActions {
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  isInCart: (itemId: string) => boolean;
  getItem: (itemId: string) => CartItem | undefined;
}

export function useCart(): CartState & CartActions {
  const [items, setItems, clearItems] = useLocalStorage<CartItem[]>("shopping-cart", []);

  // Calculate derived state
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = items.reduce((total, item) => total + item.price * item.quantity, 0);
  const isEmpty = items.length === 0;

  // Add item to cart
  const addItem = useCallback(
    (newItem: Omit<CartItem, "quantity">, quantity: number = 1) => {
      setItems((currentItems) => {
        const existingItemIndex = currentItems.findIndex((item) => item.id === newItem.id);

        if (existingItemIndex >= 0) {
          // Update existing item quantity
          const updatedItems = [...currentItems];
          const existingItem = updatedItems[existingItemIndex];

          if (existingItem) {
            const newQuantity = existingItem.quantity + quantity;
            const maxQty = newItem.maxQuantity || 999;

            const updatedItem: CartItem = {
              id: existingItem.id,
              name: existingItem.name,
              price: existingItem.price,
              quantity: Math.min(newQuantity, maxQty),
            };

            if (existingItem.image !== undefined) {
              updatedItem.image = existingItem.image;
            }

            if (existingItem.maxQuantity !== undefined) {
              updatedItem.maxQuantity = existingItem.maxQuantity;
            }

            updatedItems[existingItemIndex] = updatedItem;
          }

          return updatedItems;
        } else {
          // Add new item
          const cartItem: CartItem = {
            id: newItem.id,
            name: newItem.name,
            price: newItem.price,
            quantity,
          };

          if (newItem.image !== undefined) {
            cartItem.image = newItem.image;
          }

          if (newItem.maxQuantity !== undefined) {
            cartItem.maxQuantity = newItem.maxQuantity;
          }

          return [...currentItems, cartItem];
        }
      });
    },
    [setItems]
  );

  // Remove item from cart
  const removeItem = useCallback(
    (itemId: string) => {
      setItems((currentItems) => currentItems.filter((item) => item.id !== itemId));
    },
    [setItems]
  );

  // Update item quantity
  const updateQuantity = useCallback(
    (itemId: string, quantity: number) => {
      if (quantity <= 0) {
        removeItem(itemId);
        return;
      }

      setItems((currentItems) => {
        return currentItems.map((item) => {
          if (item.id === itemId) {
            const maxQty = item.maxQuantity || 999;
            return { ...item, quantity: Math.min(quantity, maxQty) };
          }
          return item;
        });
      });
    },
    [setItems, removeItem]
  );

  // Clear entire cart
  const clearCart = useCallback(() => {
    clearItems();
  }, [clearItems]);

  // Check if item is in cart
  const isInCart = useCallback(
    (itemId: string) => {
      return items.some((item) => item.id === itemId);
    },
    [items]
  );

  // Get specific item from cart
  const getItem = useCallback(
    (itemId: string) => {
      return items.find((item) => item.id === itemId);
    },
    [items]
  );

  return {
    items,
    itemCount,
    totalPrice,
    isEmpty,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    isInCart,
    getItem,
  };
}

/**
 * Example usage:
 *
 * const cart = useCart();
 *
 * // Add product to cart
 * cart.addItem({
 *   id: 'product-1',
 *   name: 'Premium Dog Food',
 *   price: 45.99,
 *   image: '/products/dog-food.jpg'
 * });
 *
 * // Display cart summary
 * console.log(`Cart: ${cart.itemCount} items, Total: MVR ${cart.totalPrice}`);
 */
