import { CropSupply } from "./cropSupply.Interface";

export interface CropSupplyResponse {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  supplies: CropSupply[];
}


