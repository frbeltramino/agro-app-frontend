import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CropSupply } from "@/interfaces/cropSupplies/cropSupply.Interface";


type SupplyState = {
  // properties
  selectedSupply: CropSupply | null;
  // getters

  // actions
  setSelectedSupply: (supply: CropSupply) => void;
}

export const useSupplyStore = create<SupplyState>()(
  persist(
    (set) => ({
      selectedSupply: null,
      setSelectedSupply: (supply) => set({ selectedSupply: supply }),
    }),
    {
      name: "supply-storage",
    }
  )
);