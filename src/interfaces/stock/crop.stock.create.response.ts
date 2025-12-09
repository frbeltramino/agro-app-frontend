export interface CreateCropStockResponse {
  ok: boolean;
  msg: string;
  cropStock: CropStock;
}

export interface CropStock {
  id: number;
  crop_id: number;
  stock_id: number;
  used_quantity: number;
  used_at: string;
  note: string;
  category_id: number;
  unit: string;
  price_per_unit: number;
  dose_per_ha: number;
  hectares: number;
  status: string;
  created_at: string;
  updated_at: string;
  stock_name: string;
  stock_unit: string;
}
