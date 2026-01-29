export interface Delivery {
  id: number | null | undefined;
  userId?: number;
  campaign_id?: number;
  campaign_name?: string;
  crop_name_id?: number;
  crop_name?: string;
  tn_sold?: number;
  tn_delivered: number;
  waybill_number?: string;
  destination: string;
  status: string;
  delivery_date: string;
  deleted_at?: string | null;
  created_at?: string;
  updated_at?: string;
}