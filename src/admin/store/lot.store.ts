
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Lot } from "@/interfaces/lots/lot.interface";


type LotState = {
  // properties
  selectedLot: Lot | null;
  // getters

  // actions
  setSelectedLot: (lot: Lot | null) => void;
}

export const useLotStore = create<LotState>()(
  persist(
    (set) => ({
      selectedLot: null,
      setSelectedLot: (lot) => set({ selectedLot: lot }),
    }),
    {
      name: "lot-storage",
    }
  )
);