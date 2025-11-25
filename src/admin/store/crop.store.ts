import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Crop } from "@/interfaces/crops/crop.interface";


type CropState = {
  // properties
  selectedCrop: Crop | null;
  // getters

  // actions
  setSelectedCrop: (crop: Crop | null) => void;
}

export const useCropStore = create<CropState>()(
  persist(
    (set) => ({
      selectedCrop: null,
      setSelectedCrop: (crop) => set({ selectedCrop: crop }),
    }),
    {
      name: "crop-storage",
    }
  )
);