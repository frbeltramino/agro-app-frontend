export interface CropsSalesResponse {
  crops: CropSale[];
}

export interface CropSale {
  crop_name_id: number;
  crop_name: string;
  campaign_id: number;
  total_harvested_tn: number;
  total_delivered_tn: number;
  total_sold_tn: number;
}


