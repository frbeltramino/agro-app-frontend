import { agroApi } from "@/api/agroApi";
import { CropsSalesResponse } from "@/interfaces/crops/crop.sales.response";

export const getCropsAction = async (): Promise<CropsSalesResponse> => {
  const response = await agroApi.get("/crops");
  return response.data;
};