import { Stock } from "./stock.interface";

export interface StockResponse {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  stock: Stock[];
}

