import { agroApi } from "@/api/agroApi";
import { CampaignsForSaleResponse } from "@/interfaces/campaigns/campaigns-for-sale.response";

export const getCampaignsForSaleAction = async (): Promise<CampaignsForSaleResponse> => {
  const { data } = await agroApi.get<CampaignsForSaleResponse>("/campaigns/for-sale");
  return data;
};