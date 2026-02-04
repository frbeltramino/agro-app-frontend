
import { agroApi } from "@/api/agroApi";
import { VariableExpenseTypes } from "@/interfaces/variableExpenses/variable-expense-types";

export const getVariableExpenseTypes = async (): Promise<VariableExpenseTypes> => {
  const response = await agroApi.get(`/expenses/types`);
  return response.data;
};