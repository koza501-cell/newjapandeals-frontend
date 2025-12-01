'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface CartItem {
  id: number;
  slug: string;
  title: string;
  brand: string;
  model: string;
  price_jpy: number;
  image: string;
  condition: string;
  quantity: number;
  shipping_category_id: number | null;
}

interface ShippingMethod {
  method_id: number;
  method_code: string;
  method_name: string;
  total_price_jpy: number;
  estimated_days_min: number;
  estimated_days_max: number;
  has_tracking: boolean;
  has_insurance: boolean;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  getItemCount: () => number;
  getSubtotal: () => number;
  getHandlingFee: () => number;
  selectedShipping: ShippingMethod | null;
  setSelectedShipping: (method: ShippingMethod | null) => void;
  selectedCountry: string;
  setSelectedCountry: (country: string) => void;
  getTotal: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'njd_cart';
const COUNTRY_STORAGE_KEY = 'njd_country';

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [selectedShipping, setSelectedShipping] = useState<ShippingMethod | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [isLoaded, setIsLoaded] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      const savedCountry = localStorage.getItem(COUNTRY_STORAGE_KEY);
      
      if (savedCart) {
        setItems(JSON.parse(savedCart));
      }
      if (savedCountry) {
        setSelectedCountry(savedCountry);
      }
    } catch (error) {
      console.error('Failed to load cart from localStorage:', error);
    }
    setIsLoaded(true);
  }, []);

  // Save cart to localStorage when items change
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
      } catch (error) {
        console.error('Failed to save cart to localStorage:', error);
      }
    }
  }, [items, isLoaded]);

  // Save country to localStorage when it changes
  useEffect(() => {
    if (isLoaded && selectedCountry) {
      try {
        localStorage.setItem(COUNTRY_STORAGE_KEY, selectedCountry);
      } catch (error) {
        console.error('Failed to save country to localStorage:', error);
      }
    }
  }, [selectedCountry, isLoaded]);

  // Reset shipping when items or country change
  useEffect(() => {
    setSelectedShipping(null);
  }, [items, selectedCountry]);

  const addToCart = (product: Omit<CartItem, 'quantity'>) => {
    setItems(currentItems => {
      const existingItem = currentItems.find(item => item.id === product.id);
      
      if (existingItem) {
        // Item already in cart - show message but don't add duplicate
        // For watches, typically quantity is 1
        return currentItems;
      }
      
      return [...currentItems, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: number) => {
    setItems(currentItems => currentItems.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(productId);
      return;
    }
    
    setItems(currentItems =>
      currentItems.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    setSelectedShipping(null);
  };

  const getItemCount = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const getSubtotal = () => {
    return items.reduce((total, item) => total + (item.price_jpy * item.quantity), 0);
  };

  const getHandlingFee = () => {
    return Math.round(getSubtotal() * 0.10); // 10% handling fee
  };

  const getTotal = () => {
    const subtotal = getSubtotal();
    const handling = getHandlingFee();
    const shipping = selectedShipping?.total_price_jpy || 0;
    return subtotal + handling + shipping;
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getItemCount,
        getSubtotal,
        getHandlingFee,
        selectedShipping,
        setSelectedShipping,
        selectedCountry,
        setSelectedCountry,
        getTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
