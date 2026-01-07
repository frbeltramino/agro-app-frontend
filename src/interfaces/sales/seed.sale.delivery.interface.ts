export interface Delivery {
  id: number | null | undefined;
  waybill_number?: string | null;
  seed_sale_id?: number | null;
  crop_name_id?: number | null;
  created_at?: string;
  updated_at?: string;
  destination: string;
  tn_delivered: number;
  price_per_tn: number;
  delivery_date: string;


}
