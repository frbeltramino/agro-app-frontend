import { agroApi } from "@/api/agroApi";
import { Category } from "@/interfaces/cropSupplies/supply.category.interface";


export const createSupplyCategoryAction = async (name: string) => {


  const { data } = await agroApi<Category>({
    url: '/supply/categories/new',
    method: 'POST',
    data: {
      name
    }
  })

  return data;

}