import { agroApi } from "@/api/agroApi";

interface Options {
  campaignId: number | null;
  cropNameId: number | null;
}

export const getCropSaleAvailabilityAction = async (options: Options) => {
  const { campaignId, cropNameId } = options;
  const { data } = await agroApi.get<any>(`/crops/sale/availability?campaignId=${campaignId}&cropNameId=${cropNameId}`, {
  });
  return data;
};