"use client";

import api from "@/lib/api";
import { useAuth } from "@/providers/auth-provider";
import { createContext, useContext, useEffect, useState } from "react";

// Define Cart Item Type
export type CartItem = {
  id: string; // CartItem ID (backend) or Product ID (local) - see logic
  productId: string;
  name: string;
  price: number;
  image?: string;
  quantity: number;
};

type CartContextType = {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, "id"> & { id?: string }) => void; // Allow partial item for add
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Initial load
  useEffect(() => {
    setIsClient(true);
    if (user) {
      fetchServerCart();
    } else {
      const savedCart = localStorage.getItem("shopping_cart");
      if (savedCart) {
        try {
          setCart(JSON.parse(savedCart));
        } catch (e) {
          console.error("Failed to parse cart", e);
        }
      }
    }
  }, [user]);

  // Sync to local storage if guest
  useEffect(() => {
    if (isClient && !user) {
      localStorage.setItem("shopping_cart", JSON.stringify(cart));
    }
  }, [cart, isClient, user]);

  const fetchServerCart = async () => {
    try {
      const res = await api.get("/cart");
      // Transform API response to CartItem type
      // API returns { items: [{ id, productId, quantity, product: { ... } }] }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const serverItems = res.data.items.map((item: any) => ({
        id: item.id, // CartItem ID
        productId: item.productId,
        name: item.product?.name || "Unknown Product",
        price: item.product?.price || 0,
        image: item.product?.images?.[0] || "",
        quantity: item.quantity,
      }));
      setCart(serverItems);
    } catch (error) {
      console.error("Failed to fetch cart", error);
    }
  };

  const addToCart = async (newItem: Omit<CartItem, "id"> & { id?: string }) => {
    // newItem.id from Product List is usually ProductID.
    // For API, we send productId.

    if (user) {
      try {
        await api.post("/cart", {
          productId: newItem.productId || newItem.id, // Fallback if passed as id
          quantity: newItem.quantity,
        });
        await fetchServerCart();
        setIsCartOpen(true);
      } catch (error) {
        console.error("Failed to add to cart", error);
        // Fallback or error notification
      }
    } else {
      setCart((prev) => {
        const existing = prev.find((item) => item.productId === (newItem.productId || newItem.id));
        if (existing) {
          return prev.map((item) =>
            item.productId === (newItem.productId || newItem.id)
              ? { ...item, quantity: item.quantity + newItem.quantity }
              : item
          );
        }
        return [
          ...prev,
          {
            ...newItem,
            id: newItem.id || `local_${Date.now()}`,
            productId: newItem.productId || newItem.id,
          } as CartItem,
        ];
      });
      setIsCartOpen(true);
    }
  };

  const removeFromCart = async (id: string) => {
    if (user) {
      try {
        await api.delete(`/cart/${id}`); // id should be CartItem ID
        await fetchServerCart();
      } catch (error) {
        console.error("Failed to remove from cart", error);
      }
    } else {
      setCart((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const updateQuantity = async (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }

    if (user) {
      try {
        await api.patch(`/cart/${id}`, { quantity });
        await fetchServerCart();
      } catch (error) {
        console.error("Failed to update quantity", error);
      }
    } else {
      setCart((prev) => prev.map((item) => (item.id === id ? { ...item, quantity } : item)));
    }
  };

  const clearCart = async () => {
    if (user) {
      try {
        await api.delete("/cart");
        setCart([]);
      } catch (error) {
        console.error("Failed to clear cart", error);
      }
    } else {
      setCart([]);
    }
  };

  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        cartCount,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
