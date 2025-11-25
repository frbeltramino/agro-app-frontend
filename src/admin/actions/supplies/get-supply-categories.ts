import { agroApi } from "@/api/agroApi"
import { SupplyCategoriesResponse } from "@/interfaces/cropSupplies/supply.categories.response";




export const getSupplyCategoriesAction = async (): Promise<SupplyCategoriesResponse> => {



  const { data } = await agroApi.get<SupplyCategoriesResponse>('/supply/categories', {
  });

  return data;
}