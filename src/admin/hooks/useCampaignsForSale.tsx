import { getCampaignsForSaleAction } from "../actions/campaigns/get-campaigns-for-sale.action";
import { useQuery } from "@tanstack/react-query"



export const useCampaignsForSale = () => {

  const query = useQuery({
    queryKey: ['campaignsForSale'],
    queryFn: () => getCampaignsForSaleAction(),
    staleTime: 1000 * 60 * 5
  });

  return {
    ...query
  }

}