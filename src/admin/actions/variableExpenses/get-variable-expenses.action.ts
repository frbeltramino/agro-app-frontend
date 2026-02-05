import { agroApi } from "@/api/agroApi";
import { VariableExpensesResponse } from "@/interfaces/variableExpenses/variable.expenses.response";

interface Options {
  campaignId: number;
  page?: number;
}

export const getVariableExpenses = async ({ campaignId, page = 1 }: Options): Promise<VariableExpensesResponse> => {
  const { data } = await agroApi.get("/variable/expenses", {
    params: {
      campaignId,
      page,
    },
  });

  return data;
};