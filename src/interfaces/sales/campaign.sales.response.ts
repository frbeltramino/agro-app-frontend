import { SeedSale } from "./seed.sale.interface";

export interface CampaignSalesResponse {
  campaigns: Campaign[];
  pagination: Pagination;
}

export interface Campaign {
  campaign_id: number;
  campaign_name: string;
  crops: Crop[];
}

export interface Crop {
  userId: number;
  campaign_id: number;
  campaign_name: string;
  crop_name_id: number;
  crop_name: string;
  seed_sales: SeedSale[];
}

export interface Delivery {
  id: number | null | undefined;
  primary_liquidation_number?: string | null;
  seed_sale_id?: number | null;
  crop_name_id?: number | null;
  created_at?: string;
  updated_at?: string;
  destination: string;
  tn_delivered: number;
  price_per_tn: number;
  delivery_date: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}



