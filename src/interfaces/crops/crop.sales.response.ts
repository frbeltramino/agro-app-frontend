export interface CropsSalesResponse {
  crops: CropSale[];
}

export interface CropSale {
  crop_name_id: number;
  crop_name: string;
  total_harvested_tn: number;
  total_sold_tn: number;
  available_tn: number;
}
