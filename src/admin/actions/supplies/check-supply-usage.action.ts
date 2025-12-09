import { agroApi } from "@/api/agroApi";
import { CropSupplyCheckUsageResponse } from "@/interfaces/cropSupplies/cropSupply.check.usage.response";


interface Options {
  crop_id: number;
  supply_id?: number | null;
  stock_id?: number | null;
}

export const checkSupplyUsageAction = async (options: Options): Promise<CropSupplyCheckUsageResponse> => {
  // const { crop_id, supply_id, stock_id } = options;



  const { data } = await agroApi<CropSupplyCheckUsageResponse>({
    url: "/supplies/check-usage",
    method: "POST",
    data: options,
  });

  return data;
};