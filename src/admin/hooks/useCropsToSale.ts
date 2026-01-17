import { useQuery } from "@tanstack/react-query";
import { getCropsAction } from "../actions/crops/get-crops.action";

interface UseCropsToSaleOptions {
  campaignId: number;
  enabled?: boolean;
}

export const useCropsToSale = ({ campaignId, enabled }: UseCropsToSaleOptions) => {

  return useQuery({
    queryKey: ["crops-to-sale", { campaignId }],
    queryFn: () => getCropsAction({ campaignId }),
    staleTime: 1000 * 60 * 5,
    enabled,
  });
};