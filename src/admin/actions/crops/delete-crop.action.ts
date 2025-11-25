import { agroApi } from "@/api/agroApi";

export const deleteCropAction = async (id: number) => {
  const { data } = await agroApi<any>({
    url: `/crops/${id}`,
    method: 'DELETE'
  })

  return data;
}