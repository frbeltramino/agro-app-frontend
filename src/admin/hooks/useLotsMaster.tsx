import { useQuery } from "@tanstack/react-query";
import { getLotsMasterAction } from "../actions/lots/get-lots-master.action";

export const useLotsMaster = () => {

  // Obtener categorías
  const lotsMasterQuery = useQuery({
    queryKey: ["lots-master"],
    queryFn: () => getLotsMasterAction(),
    staleTime: 1000 * 60 * 5,
  });

  return {
    ...lotsMasterQuery,
  };
};