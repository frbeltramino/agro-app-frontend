export interface CreateSupply {
  id: number;
  crop_id: number;
  name: string;
  category_id: number;
  unit: string;
  price_per_unit: number;
  dose_per_ha: number;
  hectares: number;
  status: string;
  created_at: Date;
  updated_at: Date;
  category_name: string;
}