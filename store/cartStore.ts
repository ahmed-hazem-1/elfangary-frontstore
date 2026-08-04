import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartLine, Cart } from "@/types/shopify";

interface CartState {
  cartId: string | null;
  checkoutUrl: string | null;
  totalQuantity: number;
  lines: CartLine[];
  cost: Cart["cost"] | null;
  discountCodes: Cart["discountCodes"];
  isOpen: boolean;
  customerPhone: string;
  customerName: string;
  setCustomerPhone: (phone: string) => void;
  setCustomerName: (name: string) => void;
  setCart: (cart: Cart) => void;
  setCartId: (id: string | null) => void;
  setLines: (lines: CartLine[]) => void;
  setTotalQuantity: (n: number) => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
  reset: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      cartId: null,
      checkoutUrl: null,
      totalQuantity: 0,
      lines: [],
      cost: null,
      discountCodes: [],
      isOpen: false,
      customerPhone: "",
      customerName: "",
      setCustomerPhone: (customerPhone) => set({ customerPhone }),
      setCustomerName: (customerName) => set({ customerName }),
      setCart: (cart) =>
        set({ 
          cartId: cart.id, 
          checkoutUrl: cart.checkoutUrl,
          totalQuantity: cart.totalQuantity, 
          lines: cart.lines?.edges ? cart.lines.edges.map(e => e.node) : [],
          cost: cart.cost,
          discountCodes: cart.discountCodes || []
        }),
      setCartId: (id) => set({ cartId: id }),
      setLines: (lines) => set({ lines }),
      setTotalQuantity: (n) => set({ totalQuantity: n }),
      openDrawer: () => set({ isOpen: true }),
      closeDrawer: () => set({ isOpen: false }),
      toggleDrawer: () => set((s) => ({ isOpen: !s.isOpen })),
      reset: () => set({ cartId: null, checkoutUrl: null, totalQuantity: 0, lines: [], cost: null, discountCodes: [], isOpen: false, customerPhone: "", customerName: "" }),
    }),
    { 
      name: "elfangary-cart", 
      partialize: (s) => ({ 
        cartId: s.cartId,
        customerPhone: s.customerPhone,
        customerName: s.customerName 
      }) 
    }
  )
);
