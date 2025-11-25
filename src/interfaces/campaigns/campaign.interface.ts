
export interface Campaign {
  id: number;
  name: string;
  start_date: Date;
  end_date: Date | null;
  category_id: number;
  notes: string;
  status: string;
  created_at: Date;
  updated_at: Date;
  category_name: string;
  crops_count: number;
  total_estimated_tn: number | null;
  lots: Lot[];
  crops: Crop[];
}


export interface Crop {
  id: number;
  crop_name_id: number;
  start_date: Date;
  end_date: null;
  campaign_id: number;
  lot_id: number;
  seed_type: string;
  expected_yield: number;
  total_estimated: number;
  real_yield: null;
  status: string;
  created_at: Date;
  updated_at: Date;
  lot_name: string;
}

export interface Lot {
  id: number;
  name: string;
  hectares: number;
  location: string;
  campaign_id: number;
  status: string;
  created_at: Date;
  updated_at: Date;
  crops_count: number;
}

