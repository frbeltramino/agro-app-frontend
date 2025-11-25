import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Campaign } from "@/interfaces/campaigns/campaign.interface";


type CampaignState = {
  // properties
  selectedCampaign: Campaign | null;
  // getters

  // actions
  setSelectedCampaign: (campaign: Campaign | null) => void;
}

export const useCampaignStore = create<CampaignState>()(
  persist(
    (set) => ({
      selectedCampaign: null,
      setSelectedCampaign: (campaign) => set({ selectedCampaign: campaign }),
    }),
    {
      name: "campaign-store",
      partialize: (state) => ({ selectedCampaign: state.selectedCampaign }),
    }
  )
);