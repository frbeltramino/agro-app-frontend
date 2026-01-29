import { Delivery } from "./seed.sale.delivery.interface";
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
  seed_deliveries: Delivery[];
  seed_sales: SeedSale[];
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
