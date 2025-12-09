import { agroApi } from "@/api/agroApi";

export const createCropNameAction = async (name: string) => {
  const { data } = await agroApi<any>({
    url: "/crop/names/new",
    method: "POST",
    data: { name }
  });
  return data;
};