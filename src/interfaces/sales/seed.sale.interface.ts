import { Delivery } from "./seed.sale.delivery.interface";

export interface SeedSale {
  id: number | null;
  userId?: number;
  waybill_number: string;
  sale_date: string;
  destination: string;
  tn_delivered: number;
  tn_sold: number;
  status: string;
  deleted_at: null;
  created_at?: string;
  updated_at?: string;
  crop_name_id: number;
  crop_name: string;
  deliveries: Delivery[];
}


