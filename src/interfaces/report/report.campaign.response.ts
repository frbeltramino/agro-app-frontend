export interface ReportCampaignResponse {
  lot_id: number;
  lot_name: string;
  hectares: number;
  crops: Crop[];
}

export interface Crop {
  crop_id: number;
  crop_name: string;
  seed_type: null | string;
  real_yield: number;
  start_date: string;
  end_date: string;
  laborsAndSupplies: LaborsAndSupply[];
  variableExpenses: VariableExpense[];
  deliveries: any[];
  sales: any[];
}

export interface LaborsAndSupply {
  id: number;
  crop_id: number;
  task_type_id: number;
  provider_id: number;
  description: null | string;
  total_price: number;
  laborCost: number;
  date: string;
  status: string;
  note: null;
  created_at: string;
  updated_at: string;
  performed_at: string;
  type: string;
  provider_name: string;
  supplies: Supply[];
}

export interface Supply {
  supply_id: number | null;
  master_supply_id: number | null;
  stock_id: number | null;
  supply_name: string;
  category_name: string;
  unit: string;
  price_per_unit: number;
  dose_per_ha: number;
  hectares: number;
  total_used: number;
  from_stock: boolean;
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
  provider: string;
  expense_date: string;
  amount: number;
  deleted_at: null;
  created_at: string;
  updated_at: string;
  expense_type_name: string;
  crop_name: string;
  lotName: string;
}
