export interface MasterSupplyResponse {
  master_supplies: MasterSupply[];
}

export interface MasterSupply {
  id: number;
  name: string;
  unit: string;
  category_id: number;
  category_name: string;
}
