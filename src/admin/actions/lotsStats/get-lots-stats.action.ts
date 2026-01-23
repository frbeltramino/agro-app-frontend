import { agroApi } from "@/api/agroApi";
import { LotsStatsResponse } from "@/interfaces/lotsStats/lots.stats.response";

export const getLotsStatsAction = async (campaignId: number): Promise<LotsStatsResponse> => {

  const { data } = await agroApi.get<LotsStatsResponse>(`/lots-stats?campaign_id=${campaignId}`, {
  });
  return data;
};