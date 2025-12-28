export interface CropsSalesResponse {
  crops: CropSale[];
}

export interface CropSale {
  crop_name_id: number;
  crop_name: string;
  total_harvested_kg: number;
  total_sold_kg: number;
  available_kg: number;
}
