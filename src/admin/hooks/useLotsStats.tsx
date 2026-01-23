
import { useQuery } from "@tanstack/react-query";
import { getLotsStatsAction } from "../actions/lotsStats/get-lots-stats.action";

interface LotsStatsParams {
  campaignId?: number | null;
  enabled?: boolean;
}


export const useLotsStats = (data: LotsStatsParams) => {
  const { campaignId, enabled = true } = data

  const query = useQuery({
    queryKey: ['lotsStats', campaignId],
    queryFn: () => getLotsStatsAction(campaignId!),
    staleTime: 1000 * 60 * 5, // 5 minutos
    enabled: enabled && !!campaignId,
  });

  return {
    ...query
  }
}