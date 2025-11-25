import { adjustStockAction } from "../actions/stock/adjust-stock.action";
import { getStockAction } from "../actions/stock/get-stock.action";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface UseStockOptions {
  page?: number;
  limit?: number;
  q?: string;
}

export const useStock = ({ page = 1, limit = 10, q = "" }: UseStockOptions = {}) => {

  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["stock", { page, limit, q }],
    queryFn: () =>
      getStockAction({
        page,
        limit,
        search: q,
      }),
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  const adjustStock = useMutation({
    mutationFn: adjustStockAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stock"] });
    },
    onError: (error) => {
      console.log(error);
    }
  });

  return {
    ...query,
    adjustStock
  }
};