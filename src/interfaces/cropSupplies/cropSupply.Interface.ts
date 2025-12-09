

export interface CropSupply {
  crop_stock_id: number | null;
  crop_supply_id: number | null;
  supply_id: number | null;
  stock_id: number | null;
  supply_name: string;
  category_name: string;
  supply_unit: string;
  unit_price: number;
  total_used: number;
  dose_per_ha: number;
  hectares: number;
  from_stock: number;
  used_at: string;
}
