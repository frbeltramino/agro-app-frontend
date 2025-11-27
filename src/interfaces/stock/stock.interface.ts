export interface Stock {
  id: number | null;
  name: string;
  category_id: number;
  unit: string;
  quantity_available: number;
  price_per_unit: number;
  expiration_date: string;
  status: string;
  created_at?: string;
  updated_at?: string;
  category_name?: string;
}
