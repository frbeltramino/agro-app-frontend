import { create } from "zustand";

interface NewSaleData {
  campaignId: number;
  cropNameId: number;
  campaignName: string;
  cropName: string;
}

interface SeedSaleFormStore {
  isSaleFormOpen: boolean;

  newSaleData: NewSaleData | null;

  openSaleForm: (data?: NewSaleData) => void;
  closeSaleForm: () => void;
  setNewSaleData: (data: NewSaleData | null) => void;
}

export const useSaleFormStore = create<SeedSaleFormStore>((set) => ({
  isSaleFormOpen: false,
  newSaleData: null,

  openSaleForm: (data) =>
    set({
      isSaleFormOpen: true,
      newSaleData: data ?? null,
    }),

  closeSaleForm: () =>
    set({
      isSaleFormOpen: false,
      newSaleData: null,
    }),

  setSaleFormOpen: (open: any) => set({ isSaleFormOpen: open }),

  setNewSaleData: (data) => set({ newSaleData: data }),
}));
