import { Delivery } from "@/interfaces/sales/seed.sale.delivery.interface";
import { create } from "zustand";
// Ajusta la ruta a tu interfaz

interface DeliveriesActionsState {
  deliveryToEdit: Delivery | null;
  deliveryToDelete: Delivery | null;
  isDeleteDialogOpen: boolean;

  setDeliveryToEdit: (delivery: Delivery) => void;
  setDeliveryToDelete: (delivery: Delivery) => void;

  openDeleteDialog: () => void;
  closeDeleteDialog: () => void;

  resetEdit: () => void;
  resetDelete: () => void;
}

export const useDeliveriesActionsStore = create<DeliveriesActionsState>((set) => ({
  deliveryToEdit: null,
  deliveryToDelete: null,
  isDeleteDialogOpen: false,

  setDeliveryToEdit: (delivery) => set({ deliveryToEdit: delivery }),
  setDeliveryToDelete: (delivery) => set({ deliveryToDelete: delivery }),

  openDeleteDialog: () => set({ isDeleteDialogOpen: true }),
  closeDeleteDialog: () => set({ isDeleteDialogOpen: false, deliveryToDelete: null }),

  resetEdit: () => set({ deliveryToEdit: null }),
  resetDelete: () => set({ deliveryToDelete: null, isDeleteDialogOpen: false }),
}));
