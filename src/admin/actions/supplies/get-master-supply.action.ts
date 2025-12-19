import { agroApi } from "@/api/agroApi";
import { MasterSupplyResponse } from "@/interfaces/cropSupplies/supply.master.response";

export const getMasterSupplyAction = async (): Promise<MasterSupplyResponse> => {
  const response = await agroApi.get("/master/supplies");
  return response.data;
};