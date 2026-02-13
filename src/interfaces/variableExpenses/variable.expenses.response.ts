

export interface VariableExpensesResponse {
  data: Datum[];
  pagination: Pagination;
}

export interface Datum {
  lotId: number;
  lotName: string;
  expenses: VariableExpense[];
}

export interface VariableExpense {
  id: number;
  user_id: number;
  campaign_id: number;
  lot_id: number;
  crop_id: number;
  hectares: number;
  tons_harvested: number;
  expense_type_id: number;
  provider: null | string;
  expense_date: string;
  amount: number;
  deleted_at: null;
  created_at: string;
  updated_at: string;
  expense_type_name: string;
  lotName: string;
  crop_name: string;
}

export interface Pagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

