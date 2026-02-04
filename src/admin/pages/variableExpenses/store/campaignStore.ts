// store/campaignStore.ts
import { create } from "zustand";

interface CampaignStore {
  selectedCampaign: string;
  setSelectedCampaign: (id: string) => void;
}

export const useCampaignStore = create<CampaignStore>((set) => ({
  selectedCampaign: "",
  setSelectedCampaign: (id) => set({ selectedCampaign: id }),
}));
