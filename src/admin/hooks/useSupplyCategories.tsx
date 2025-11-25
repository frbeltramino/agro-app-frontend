import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getSupplyCategoriesAction } from "../actions/supplies/get-supply-categories";
import { createSupplyCategoryAction } from "../actions/supplies/create-supply-category.action";

export const useSupplyCategories = () => {
  const queryClient = useQueryClient();

  // Obtener categorías
  const categoriesQuery = useQuery({
    queryKey: ["supply-categories"],
    queryFn: () => getSupplyCategoriesAction(),
    staleTime: 1000 * 60 * 5,
  });

  // Crear nueva categoría
  const createCategoryMutation = useMutation({
    mutationFn: (name: string) => createSupplyCategoryAction(name),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["supply-categories"] });
    },
  });

  return {
    ...categoriesQuery,
    createCategory: createCategoryMutation.mutateAsync,
    isCreatingCategory: createCategoryMutation.isPending,
  };
};
