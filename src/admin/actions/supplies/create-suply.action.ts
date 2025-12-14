import { agroApi } from "@/api/agroApi";
import { SupplyCreateResponse } from "@/interfaces/cropSupplies/supplyCreateResponse";

interface SupplyPayload {
  id?: number | string | null;
  crop_id: number;
  name: string;
  category_id: number | null;
  unit: string;
  dose_per_ha?: number | null;
  hectares?: number | null;
  price_per_unit?: number | null | undefined | string;
  status?: string;
}


export const createSupplyAction = async (payload: SupplyPayload) => {
  const { id } = payload;
  const isCreating = !!id;
  const { data } = await agroApi<SupplyCreateResponse>({
    url: isCreating ? "/supplies/new" : `/supplies/${id}`,
    method: isCreating ? "POST" : "PATCH",
    data: payload,
  });

  return data;
};