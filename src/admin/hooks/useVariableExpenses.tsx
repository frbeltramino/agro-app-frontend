import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getVariableExpenses } from "../actions/variableExpenses/get-variable-expenses.action";
import { createUpdateVariableExpenseAction } from "../actions/variableExpenses/create-variable-expense.action";
import { deleteVariableExpenseAction } from "../actions/variableExpenses/delete-variable-expense.action";
import { toast } from "sonner";

interface UseVariableExpensesOptions {
  campaignId: number; // obligatorio
  page: number;
}

interface createVariableExpenseProps {
  id?: number;
  campaign_id: number;
  lot_id: number;
  hectares: number;
  tons_harvested: number;
  expense_type_id: number;
  provider?: string | null;
  expense_date: string;
  amount: number;
}

export const useVariableExpenses = (
  { campaignId, page }: UseVariableExpensesOptions

) => {

  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["variable-expenses", campaignId, page],
    queryFn: () =>
      getVariableExpenses({
        campaignId,
        page: isNaN(Number(+page)) ? 1 : Number(page),
      }),
    staleTime: 1000 * 60 * 5, // 5 minutos
    enabled: campaignId > 0,
  });

  const createVariableExpense = useMutation({
    mutationFn: (data: createVariableExpenseProps) =>
      createUpdateVariableExpenseAction(data),

    onSuccess: () => {
      toast.success("Gasto variable guardado correctamente");

      queryClient.invalidateQueries({
        queryKey: ["variable-expenses", campaignId],
      });
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
        "Error al guardar el gasto variable"
      );
    },
  });

  const deleteVariableExpense = useMutation({
    mutationFn: (id: number) => deleteVariableExpenseAction(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["variable-expenses", campaignId]
      });
    },
    onError: (error) => {
      console.log(error);
    }
  });

  return {
    ...query,
    createVariableExpense,
    deleteVariableExpense
  }
}