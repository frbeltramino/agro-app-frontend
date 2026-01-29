export interface SeedSale {
  id: number | null;
  userId?: number;
  campaign_id: number | null;
  campaign_name?: string;
  crop_name_id: number | null;
  crop_name?: string;
  primary_liquidation_number: string;
  destination: string;
  tn_sold: number;
  price_per_tn: number;
  sale_date: string;
  deleted_at?: string | null;
  created_at?: string;
  updated_at?: string;
}


