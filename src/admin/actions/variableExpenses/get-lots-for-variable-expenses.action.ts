import { agroApi } from "@/api/agroApi";
import { VariableExpensesLots } from "@/interfaces/variableExpenses/variable.expenses.lots.response";

export const getLotsForVariableExpenses = async (campaignId: number): Promise<VariableExpensesLots> => {
  const response = await agroApi.get(`/variable/expenses/campaign/${campaignId}/variable-expenses-lots`);
  return response.data;
};