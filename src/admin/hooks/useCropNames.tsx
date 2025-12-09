import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getCropNamesAction } from "../actions/crops/get-crop-names.action";
import { createCropNameAction } from "../actions/crops/create-crop-name.action";

export const useCropNames = () => {

  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["crop-names"],
    queryFn: () => getCropNamesAction(),
    staleTime: 1000 * 60 * 5,
  });

  const createCropName = useMutation({
    mutationFn: (name: string) => createCropNameAction(name),
    onSuccess: () => {
      // 🔹 Refrescar la lista de nombres al crear uno nuevo
      queryClient.invalidateQueries({ queryKey: ["crop-names"] });
    },
  });



  return {
    ...query,
    createCropName: createCropName.mutateAsync,
  }


}
