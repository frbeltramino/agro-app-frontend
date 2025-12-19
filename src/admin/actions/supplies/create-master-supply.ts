import { agroApi } from "@/api/agroApi";
import { SupplyMasterCreateResponse } from "@/interfaces/cropSupplies/supply.master.create.response";

interface CreateMasterSupplyInput {
  name: string;
  unit: string;
  categoryId: number | null | undefined;
}

export const createMasterSupplyAction = ({ name, unit, categoryId }: CreateMasterSupplyInput): Promise<SupplyMasterCreateResponse> => {
  return agroApi.post("/master/supplies/new", {
    name,
    unit,
    category_id: categoryId,
  });
};