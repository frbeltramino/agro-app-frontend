import { useQuery } from "@tanstack/react-query";
import { getCropsAction } from "../actions/crops/get-crops.action";

export const useCropsToSale = () => {
  return useQuery({
    queryKey: ["crops-to-sale"],
    queryFn: getCropsAction,
    staleTime: 1000 * 60 * 5,
  });
};