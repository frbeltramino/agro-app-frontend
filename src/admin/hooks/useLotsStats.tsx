
import { useQuery } from "@tanstack/react-query";
import { getLotsStatsAction } from "../actions/lotsStats/get-lots-stats.action";


export const useLotsStats = (data: any) => {
  const { campaignId } = data

  const query = useQuery({
    queryKey: ['lotsStats'],
    queryFn: () => getLotsStatsAction(campaignId),
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  return {
    ...query
  }
}