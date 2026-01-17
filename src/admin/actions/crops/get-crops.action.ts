import { agroApi } from "@/api/agroApi";
import { CropsSalesResponse } from "@/interfaces/crops/crop.sales.response";

interface Options {
  campaignId: number;
}

export const getCropsAction = async (options: Options): Promise<CropsSalesResponse> => {
  const { campaignId } = options;
  const response = await agroApi.get(`/crops?campaignId=${campaignId}`);
  return response.data;
};