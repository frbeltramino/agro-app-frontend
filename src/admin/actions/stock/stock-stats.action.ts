import { agroApi } from "@/api/agroApi";
import { StockStatsResponse } from "@/interfaces/stock/stock.stats.response";

export const getStockStatsAction = async (): Promise<StockStatsResponse> => {
  const { data } = await agroApi.get<StockStatsResponse>('/stats/stock', {

  });

  return data;
};