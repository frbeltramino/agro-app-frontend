import { createSupplyAction } from "../actions/supplies/create-suply.action";
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
    },
    onError: (error) => {
      console.log(error);
    }
  });

  return {
    ...query,
    createSupply
  }


};



//TODO: ejemplos de filtros

// GET /crops/1/supplies?name=glifo
//GET /crops/1/supplies?category=Fertilizante
//GET /crops/1/supplies?page=2&limit=10
//GET /crops/1/supplies?name=urea&category=Ferti&page=1&limit=5
