import { agroApi } from "@/api/agroApi";
import { CanCreateCropResponse } from "@/interfaces/crops/can.create.crop.response";


interface props {
  campaignId: number | undefined;
  lotId: number | undefined;
}

export const canCreateCropAction = async ({ campaignId, lotId }: props): Promise<CanCreateCropResponse> => {
  const response = await agroApi.get(`crops/can-create/${lotId}/${campaignId}`);
  return response.data;
};