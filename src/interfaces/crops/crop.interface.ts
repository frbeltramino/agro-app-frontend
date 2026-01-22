export interface Crop {
  id: number;
  crop_name_id: number;
  start_date: string;
  end_date: string;
  campaign_id: number;
  lot_id: number;
  seed_type: string;
  expected_yield: string;
  total_estimated: string;
  real_yield: null;
  status: string;
  created_at: string;
  updated_at: string;
  crop_name: string;
}

//este modelo tiene el campo crop_name