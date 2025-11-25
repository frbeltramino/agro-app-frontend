import { agroApi } from "@/api/agroApi"
import { CropsResponse } from "@/interfaces/crops/crops.response";


interface Options {
  lotId: number;
  page?: number | string;
  limit?: number | string;
  search?: string;
}

export const getCropsByLotIdAction = async (options: Options): Promise<CropsResponse> => {
  const { lotId } = options;

  if (!lotId) throw new Error('Campaign id is required');

  const { data } = await agroApi.get<CropsResponse>(`/crops/lot/${lotId}`, {
  });

  return data;
}