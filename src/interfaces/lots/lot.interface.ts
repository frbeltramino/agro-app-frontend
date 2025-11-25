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