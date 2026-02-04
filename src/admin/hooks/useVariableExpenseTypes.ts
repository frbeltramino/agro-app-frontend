
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getVariableExpenseTypes } from "../actions/variableExpenses/get-variable-expense-types";
import { createVariableExpenseTypeAction } from "../actions/variableExpenses/create-variable-expense-type.action";

export const useVariableExpenseTypes = () => {

  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["variable-expense-types"],
    queryFn: () =>
      getVariableExpenseTypes(),
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  const createVariableExpenseType = useMutation({
    mutationFn: (data: { name: string }) => createVariableExpenseTypeAction(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['variable-expense-types'] });
    },
    onError: (error) => {
      console.log(error);
    }
  });

  return {
    ...query,
    createVariableExpenseType,
  }
}