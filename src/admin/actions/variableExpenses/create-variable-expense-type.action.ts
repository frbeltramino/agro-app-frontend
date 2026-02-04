import { agroApi } from "@/api/agroApi";

interface props {
  name: string;
}

export const createVariableExpenseTypeAction = async ({ name }: props) => {

  return agroApi.post(`/expenses/types/new`, {
    name: name,
  });
};