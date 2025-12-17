import { agroApi } from "@/api/agroApi";

export const deleteDeliverySaleAction = async (id: any) => {
  const { data } = await agroApi.delete(`/deliveries/seed/${id}`);
  return data;
};