import { agroApi } from "@/api/agroApi";


export const deleteStockAction = async (id: string): Promise<any> => {
  const data = await agroApi<void>({
    url: `/stock/${id}`,
    method: 'DELETE'
  })
  return data
}