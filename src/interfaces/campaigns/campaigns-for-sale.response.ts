export interface CampaignsForSaleResponse {
  campaigns: Campaign[];
}

export interface Campaign {
  id: number;
  name: string;
}
