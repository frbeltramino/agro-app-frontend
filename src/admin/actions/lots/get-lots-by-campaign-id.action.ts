import { agroApi } from "@/api/agroApi"
import { LotsResponse } from "@/interfaces/lots/lots.response";

interface Options {
  campaignId: number;
  page?: number | string;
  limit?: number | string;
  search?: string;
}

export const getLotsByCampaignIdAction = async (options: Options): Promise<LotsResponse> => {
  const { campaignId } = options;

  if (!campaignId) throw new Error('Campaign id is required');

  const { data } = await agroApi.get<LotsResponse>(`/lots/campaign/${campaignId}`, {
  });

  return data;
}