export interface StockStatsResponse {
  total_items: number;
  total_quantity: number;
  total_value: number;
  active_count: number;
  inactive_count: number;
  expired_count: number;
  expiring_soon: number;
  categories: Category[];
}

export interface Category {
  category_id: number;
  items: number;
}
