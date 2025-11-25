import { agroApi } from "@/api/agroApi";
import { CropNamesResponse } from "@/interfaces/crops/crop.names.response";



export const getCropNamesAction = async (): Promise<CropNamesResponse> => {
  const { data } = await agroApi.get<CropNamesResponse>('/crop/names', {});

  return data;
}