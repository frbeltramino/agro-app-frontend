
export interface VariableExpenseFormData {
  campaign_id: number | null;
  lot_id: number | null;
  hectares: number;
  tons_harvested: number;
  expense_type_id: number | null;
  provider?: string;
  expense_date: string | undefined;
  amount: number | undefined;
}
