export interface Stock {
  id: number;
  name: string;
  category_id: number;
  unit: string;
  quantity_available: number;
  price_per_unit: number;
  expiration_date: Date;
  status: string;
  created_at: Date;
  updated_at: Date;
  category_name: string;
}
