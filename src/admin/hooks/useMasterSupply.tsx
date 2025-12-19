import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getMasterSupplyAction } from "../actions/supplies/get-master-supply.action";
import { createMasterSupplyAction } from "../actions/supplies/create-master-supply";
import { SupplyMasterCreateResponse } from "@/interfaces/cropSupplies/supply.master.create.response";

interface CreateMasterSupplyInput {
  name: string;
  unit: string;
  categoryId: number | null | undefined;
}

export const useMasterSupply = () => {
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["masterSupply"],
    queryFn: () => getMasterSupplyAction(),
    staleTime: 1000 * 60 * 5,
  });

  const mutation = useMutation<
    SupplyMasterCreateResponse, // tipo del response
    any,                        // tipo del error
    CreateMasterSupplyInput     // tipo del argumento que recibe mutateAsync
  >({
    mutationFn: async ({ name, unit, categoryId }: CreateMasterSupplyInput) => {
      const response = await createMasterSupplyAction({ name, unit, categoryId });
      return response; // o response según tu implementación
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["masterSupply"] });
    },
    onError: (error) => {
      const message =
        error?.response?.data?.message || // <- tu mensaje del backend
        error?.message ||                 // <- mensaje genérico de Axios
        "Error desconocido";

      console.log("Error al crear suministro:", message);
    },
  });

  return {
    data,
    isLoading,
    isError,
    mutation,
  };
};
