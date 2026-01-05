import { useQuery } from "@tanstack/react-query";
import { getCropsAction } from "../actions/crops/get-crops.action";
import { useAuthStore } from "@/auth/store/auth.store";

export const useCropsToSale = () => {
  const user = useAuthStore((state) => state.user);
  return useQuery({
    queryKey: ["crops-to-sale", user?.id],
    queryFn: getCropsAction,
    staleTime: 1000 * 60 * 5,
  });
};