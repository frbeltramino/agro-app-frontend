import { create } from "zustand";
import { Crop } from "@/interfaces/sales/campaign.sales.response";
import { SeedSale } from "@/interfaces/sales/seed.sale.interface";

interface SalesActionsState {
  cropToEdit: SeedSale | null;
  cropToDelete: SeedSale | null;

  setCropToEdit: (crop: Crop) => void;
  setCropToDelete: (crop: Crop) => void;

  resetEdit: () => void;
  resetDelete: () => void;
}

export const useSalesActionsStore = create<SalesActionsState>((set) => ({
  cropToEdit: null,
  cropToDelete: null,

  setCropToEdit: (crop) => set({ cropToEdit: crop }),
  setCropToDelete: (crop) => set({ cropToDelete: crop }),

  resetEdit: () => set({ cropToEdit: null }),
  resetDelete: () => set({ cropToDelete: null }),
}));