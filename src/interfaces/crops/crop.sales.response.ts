export interface CropsSalesResponse {
  crops: Crop[];
}

export interface Crop {
  id: number;
  crop_name_id: number;
  start_date: string;
  end_date: string;
  campaign_id: number;
  lot_id: number;
  seed_type: string;
  expected_yield: null;
  total_estimated: null;
  real_yield: number;
  status: string;
  created_at: string;
  updated_at: string;
  crop_name: string;
  campaign_name: string;
  lot_name: string;
  hectares: number;
}
