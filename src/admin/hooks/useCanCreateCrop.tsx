import { useQuery } from "@tanstack/react-query";
import { canCreateCropAction } from "../actions/crops/can-create-crop.action";

interface useCanCreateCropOptions {
  lotId: number | undefined;
  campaignId: number | undefined;
}

export const useCanCreateCrop = ({ lotId, campaignId }: useCanCreateCropOptions) => {

  const query = useQuery({
    queryKey: ["can-create-crop", { lotId, campaignId }],
    queryFn: () =>
      canCreateCropAction({
        campaignId: campaignId,
        lotId: lotId,
      }),
    staleTime: 1000 * 60 * 5, // 5 minutos
    enabled: !!lotId && !!campaignId,
  });

  return { ...query };
};