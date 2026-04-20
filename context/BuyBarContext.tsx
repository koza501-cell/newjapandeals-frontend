'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

export interface BuyBarProduct {
  id: number;
  slug: string;
  title: string;
  image: string | null;
  price_jpy: number;
  condition: string;
  shipping_category_id: number | null;
  brand: string;
  model: string;
}

interface BuyBarContextType {
  product: BuyBarProduct | null;
  setProduct: (p: BuyBarProduct | null) => void;
  showBuyBar: boolean;
  setShowBuyBar: (v: boolean) => void;
  quantity: number;
  setQuantity: (n: number) => void;
}

const BuyBarContext = createContext<BuyBarContextType>({
  product: null,
  setProduct: () => {},
  showBuyBar: false,
  setShowBuyBar: () => {},
  quantity: 1,
  setQuantity: () => {},
});

export function BuyBarProvider({ children }: { children: ReactNode }) {
  const [product, setProduct] = useState<BuyBarProduct | null>(null);
  const [showBuyBar, setShowBuyBar] = useState(false);
  const [quantity, setQuantity] = useState(1);

  return (
    <BuyBarContext.Provider value={{ product, setProduct, showBuyBar, setShowBuyBar, quantity, setQuantity }}>
      {children}
    </BuyBarContext.Provider>
  );
}

export function useBuyBar(): BuyBarContextType {
  return useContext(BuyBarContext);
}
