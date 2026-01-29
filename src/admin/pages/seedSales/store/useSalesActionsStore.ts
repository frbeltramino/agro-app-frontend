import { create } from "zustand";
import { SeedSale } from "@/interfaces/sales/seed.sale.interface";

interface SalesActionsState {
  saleToEdit: SeedSale | null;
  saleToDelete: SeedSale | null;
  isDeleteDialogOpen: boolean;

  setSaleToEdit: (SeedSale: SeedSale) => void;
  setSaleToDelete: (SeedSale: SeedSale) => void;

  openDeleteDialog: () => void;  // <-- nueva acción
  closeDeleteDialog: () => void;

  resetEdit: () => void;
  resetDelete: () => void;
}

export const useSalesActionsStore = create<SalesActionsState>((set) => ({
  saleToEdit: null,
  saleToDelete: null,
  isDeleteDialogOpen: false,

  setSaleToEdit: (SeedSale) => set({ saleToEdit: SeedSale }),
  setSaleToDelete: (SeedSale) => set({ saleToDelete: SeedSale }),

  openDeleteDialog: () => set({ isDeleteDialogOpen: true }),
  closeDeleteDialog: () => set({ isDeleteDialogOpen: false, saleToDelete: null }),

  resetEdit: () => set({ saleToEdit: null }),
  resetDelete: () => set({ saleToDelete: null }),
}));