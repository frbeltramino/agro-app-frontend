export interface SupplyMasterCreateResponse {
  message: string;
  master_supply: MasterSupply;
}

export interface MasterSupply {
  id: number;
  name: string;
  category_id: number | null | undefined;
  unit: string;
}
