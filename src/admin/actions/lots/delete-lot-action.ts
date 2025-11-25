import { agroApi } from "@/api/agroApi";

export const deleteLotAction = async (id: number) => {
  const { data } = await agroApi<any>({
    url: `/lots/${id}`,
    method: 'DELETE'
  })

  return data;
}