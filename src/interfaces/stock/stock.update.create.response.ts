export interface StockCreateUpdateResponse {
  success: boolean;
  message: string;
  stock: StockCreateUpdateItem;
}

interface StockCreateUpdateItem {
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
}
