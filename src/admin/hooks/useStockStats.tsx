
import { useQuery } from "@tanstack/react-query";
import { getStockStatsAction } from "../actions/stock/stock-stats.action";
import { useAuthStore } from "@/auth/store/auth.store";


export const useStockStats = () => {
  const user = useAuthStore((state) => state.user);
  const query = useQuery({
    queryKey: ['stockStats', user?.id],
    queryFn: getStockStatsAction,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  return {
    ...query
  }
}