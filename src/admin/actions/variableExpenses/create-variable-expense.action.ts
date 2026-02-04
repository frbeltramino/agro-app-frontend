import { agroApi } from "@/api/agroApi";

interface props {
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

export const createUpdateVariableExpenseAction = async (data: props) => {
  return agroApi.post(`variable/expenses/`, data);
};