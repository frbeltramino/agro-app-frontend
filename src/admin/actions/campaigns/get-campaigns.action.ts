import { agroApi } from "@/api/agroApi"
import { CampaingsResponse } from "@/interfaces/campaigns/campaigns.response";


interface Options {
  page?: number | string;
  limit?: number | string;
  search?: string;
}

export const getCampaignsAction = async (options: Options): Promise<CampaingsResponse> => {

  const { page, limit, search } = options;

  const { data } = await agroApi.get<CampaingsResponse>('/campaigns', {
    params: {
      page,
      limit,
      search
    }
  });

  return data;
}