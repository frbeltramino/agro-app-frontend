import { agroApi } from "@/api/agroApi";

export const deleteCampaignAction = async (id: number) => {
  const { data } = await agroApi<any>({
    url: `/campaigns/${id}`,
    method: 'DELETE'
  })

  return data;
}