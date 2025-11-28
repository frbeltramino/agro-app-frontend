
import { useQuery } from "@tanstack/react-query";
import { getStockStatsAction } from "../actions/stock/stock-stats.action";


export const useStockStats = () => {

  const query = useQuery({
    queryKey: ['stockStats'],
    queryFn: getStockStatsAction,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  return {
    ...query
  }
}