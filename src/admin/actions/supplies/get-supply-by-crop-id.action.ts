import { agroApi } from "@/api/agroApi"
import { CropSupplyResponse } from "@/interfaces/cropSupplies/cropSupply.response";

interface Options {
  cropId: number;
  page?: number | string;
  limit?: number | string;
  search?: string;
}

export const getSupplyByCropIdAction = async (options: Options): Promise<CropSupplyResponse> => {
  const { cropId, page, limit, search } = options;

  if (!cropId) throw new Error('Campaign id is required');
  await new Promise(resolve => setTimeout(resolve, 500));

  const { data } = await agroApi.get<CropSupplyResponse>(`/supplies/crop/${cropId}`, {
    params: {
      page,
      limit,
      search
    }
  });

  return data;
}