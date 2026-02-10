import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getLotsMasterAction } from "../actions/lots/get-lots-master.action";
import { createLotMasterAction } from "../actions/lots/create-lot-master";
import { toast } from "sonner";

export const useLotsMaster = () => {
  const queryClient = useQueryClient();

  const lotsMasterQuery = useQuery({
    queryKey: ["lots-master"],
    queryFn: () => getLotsMasterAction(),
    staleTime: 1000 * 60 * 5,
  });

  const createLotMasterMutation = useMutation({
    mutationFn: (data: any) => createLotMasterAction(data),

    onSuccess: () => {
      toast.success("Lote maestro creado correctamente"); // 🎉 mensaje de éxito
      queryClient.invalidateQueries({ queryKey: ["lots-master"] }); // refresca la lista
    },

    onError: (error: any) => {
      const message =
        error?.response?.data?.message || "Error al crear lote maestro";
      toast.error(message);
    },
  });

  return {
    ...lotsMasterQuery,
    createLotMasterMutation
  };
};