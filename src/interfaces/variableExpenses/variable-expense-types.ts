export interface VariableExpenseTypes {
  expenseTypes: ExpenseType[];
}

export interface ExpenseType {
  id: number;
  name: string;
  user_id: number | null;
  created_at: string;
}
