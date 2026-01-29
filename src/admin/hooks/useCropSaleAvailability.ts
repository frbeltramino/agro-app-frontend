import { useQuery } from "@tanstack/react-query";
import { getCropSaleAvailabilityAction } from "../actions/crops/get-crop-sale-availability.action";

interface UseCropSaleAvailabilityOptions {
  campaignId: number | null;
  cropNameId: number | null;
}

export const useCropSaleAvailability = ({ campaignId, cropNameId }: UseCropSaleAvailabilityOptions) => {

  return useQuery({
    queryKey: ["crop-sale-availability", { campaignId, cropNameId }],
    queryFn: () => getCropSaleAvailabilityAction({ campaignId, cropNameId }),
    staleTime: 1000 * 60 * 5,
    enabled: !!campaignId && !!cropNameId,
  });
};