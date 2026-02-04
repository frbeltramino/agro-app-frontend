import { agroApi } from "@/api/agroApi";

export const deleteVariableExpenseAction = async (id: number) => {
  return agroApi.delete(`variable/expenses/${id}`);
};