import { agroApi } from "@/api/agroApi";
import { SupplyCreateResponse } from "@/interfaces/cropSupplies/supplyCreateResponse";

interface SupplyPayload {
  id?: number;
  crop_id: number;
  name: string;
  category_id: number;
  unit: "lt" | "kg" | "g" | "ml";
  dose_per_ha?: number | null;
  hectares?: number | null;
  price_per_unit?: number | null;
  status?: "active" | "inactive";
}


export const createSupplyAction = async (payload: SupplyPayload) => {
  console.log({ payloadSupply: payload });
  const { data } = await agroApi<SupplyCreateResponse>({
    url: "/supplies/new",
    method: "POST",
    data: payload,
  });

  return data;
};