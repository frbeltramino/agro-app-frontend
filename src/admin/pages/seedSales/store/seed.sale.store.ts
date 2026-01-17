import { create } from "zustand";
import type { SeedSale } from "@/interfaces/sales/seed.sale.interface";

interface SeedSaleEditStore {
  originalSale: SeedSale | null;
  setOriginalSale: (sale: SeedSale) => void;
  clearOriginalSale: () => void;
}

export const useSeedSaleEditStore = create<SeedSaleEditStore>((set) => ({
  originalSale: null,
  setOriginalSale: (sale) =>
    set({ originalSale: structuredClone(sale) }),
  clearOriginalSale: () => set({ originalSale: null }),
}));
