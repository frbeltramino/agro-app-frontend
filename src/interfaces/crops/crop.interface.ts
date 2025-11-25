export interface Crop {
  id: number;
  crop_name_id: number;
  start_date: Date;
  end_date: Date;
  campaign_id: number;
  lot_id: number;
  seed_type: string;
  expected_yield: string;
  total_estimated: string;
  real_yield: null;
  status: string;
  created_at: Date;
  updated_at: Date;
  crop_name: string;
}

//este modelo tiene el campo crop_name