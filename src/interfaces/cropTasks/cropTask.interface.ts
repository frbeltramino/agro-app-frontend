export interface CropTask {
  id: number;
  crop_id: number;
  task_type_id: number;
  description: string;
  provider: string;
  total_price: number;
  laborCost: number;
  date: string;
  note: null | string;
  status: string;
  created_at: string;
  updated_at: string;
  performed_at: string | null;
  type: string;
  supplies: CropTaskSupply[];
}

export interface CropTaskSupply {
  supply_id: number | null;
  master_supply_id: number;
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


