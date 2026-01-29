import { create } from "zustand";

interface NewDeliveryData {
  campaignId: number;
  cropNameId: number;
  campaignName: string;
  cropName: string;
}

interface DeliveryFormStore {
  isDeliveryFormOpen: boolean;

  newDeliveryData: NewDeliveryData | null;

  openDeliveryForm: (data?: NewDeliveryData) => void;
  closeDeliveryForm: () => void;
  setNewDeliveryData: (data: NewDeliveryData | null) => void;
}

export const useDeliveryFormStore = create<DeliveryFormStore>((set) => ({
  isDeliveryFormOpen: false,
  newDeliveryData: null,

  openDeliveryForm: (data) =>
    set({
      isDeliveryFormOpen: true,
      newDeliveryData: data ?? null,
    }),

  closeDeliveryForm: () =>
    set({
      isDeliveryFormOpen: false,
      newDeliveryData: null,
    }),

  setNewDeliveryData: (data) => set({ newDeliveryData: data }),
}));
