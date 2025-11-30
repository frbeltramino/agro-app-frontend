import { agroApi } from "@/api/agroApi";

export const deleteSeedSaleAction = async (id: number) => {
  const { data } = await agroApi.delete(`/sales/seed/${id}`);
  return data;
};