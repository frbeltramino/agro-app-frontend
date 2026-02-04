export interface VariableExpensesResponse {
  variableExpenses: VariableExpense[];
  pagination: Pagination;
}

export interface Pagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface VariableExpense {
  id?: number;
  user_id: number;
  campaign_id: number;
  lot_id: number;
  hectares: number;
  tons_harvested: number;
  expense_type_id: number;
  provider: string;
  expense_date: string;
  amount: number;
  deleted_at: null;
  created_at: string;
  updated_at: string;
  expense_type_name: string;
}
