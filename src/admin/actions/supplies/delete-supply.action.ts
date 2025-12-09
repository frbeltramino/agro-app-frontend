import { agroApi } from "@/api/agroApi";

interface DeleteSupplyPayload {
  supply_id?: number | null;
  crop_supply_id?: number;
  stock_id?: number | null;
  crop_stock_id?: number | null;
  from_stock: boolean;
}

export const deleteSupplyAction = async (payload: DeleteSupplyPayload) => {

  const { data } = await agroApi({
    url: "/supplies/delete",
    method: "DELETE",
    data: payload,
  });

  return data;
};