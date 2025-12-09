import { checkSupplyUsageAction } from "../actions/supplies/check-supply-usage.action";
import { createSupplyAction } from "../actions/supplies/create-suply.action";
import { deleteSupplyAction } from "../actions/supplies/delete-supply.action";
import { getSupplyByCropIdAction } from "../actions/supplies/get-supply-by-crop-id.action";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";


interface UseSupplyOptions {
  cropId: number;
  page?: number;
  limit?: number;
  q?: string;
}

export const useSupply = ({ cropId, page, limit, q }: UseSupplyOptions) => {

  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ["supply", { cropId, page, limit, q }],
    queryFn: () =>
      getSupplyByCropIdAction({
        cropId,
        page,
        limit,
        search: q,
      }),
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  const createSupply = useMutation({
    mutationFn: createSupplyAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["supply"] });
      queryClient.invalidateQueries({ queryKey: ["stock"] });
    },
    onError: (error) => {
      console.log(error);
    }
  });

  const checkSupplyUsage = useMutation({
    mutationFn: checkSupplyUsageAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["supply"] });
    },
    onError: (error) => {
      console.log(error);
    }
  });

  const deleteSupply = useMutation({
    mutationFn: deleteSupplyAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["supply"] });
      queryClient.invalidateQueries({ queryKey: ["stock"] });
    },
    onError: (error) => {
      console.log(error);
    }
  });

  return {
    ...query,
    createSupply,
    checkSupplyUsage,
    deleteSupply
  }


};


