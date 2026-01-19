import { create } from "zustand";
import { Crop } from "@/interfaces/sales/campaign.sales.response";
import { SeedSale } from "@/interfaces/sales/seed.sale.interface";

interface SalesActionsState {
  cropToEdit: SeedSale | null;
  cropToDelete: SeedSale | null;

  setCropToEdit: (SeedSale: SeedSale) => void;
  setCropToDelete: (SeedSale: SeedSale) => void;

  resetEdit: () => void;
  resetDelete: () => void;
}

export const useSalesActionsStore = create<SalesActionsState>((set) => ({
  cropToEdit: null,
  cropToDelete: null,

  setCropToEdit: (SeedSale) => set({ cropToEdit: SeedSale }),
  setCropToDelete: (SeedSale) => set({ cropToDelete: SeedSale }),

  resetEdit: () => set({ cropToEdit: null }),
  resetDelete: () => set({ cropToDelete: null }),
}));