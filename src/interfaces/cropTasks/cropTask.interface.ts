export interface CropTask {
  id: number;
  crop_id: number;
  task_type_id: number;
  description: string;
  provider: string;
  total_price: number;
  laborCost: number;
  date: Date;
  note: null | string;
  status: string;
  created_at: Date;
  updated_at: Date;
  performed_at: Date | null;
  type: string;
  supplies: CropTaskSupply[];
}

export interface CropTaskSupply {
  supply_id: number | null;
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
