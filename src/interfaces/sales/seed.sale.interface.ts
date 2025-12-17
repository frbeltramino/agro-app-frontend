import { Delivery } from "./seed.sale.delivery.interface";

export interface SeedSale {
  id: number | null;
  crop_id: number;
  waybill_number: string;
  sale_date: string;
  destination: string;
  kg_delivered: number;
  kg_sold: number;
  status: string;
  deleted_at?: null;
  created_at?: string;
  updated_at?: string;
  deliveries: Delivery[];
}


