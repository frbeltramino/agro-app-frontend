import { agroApi } from "@/api/agroApi"
import { StockResponse } from "@/interfaces/stock/stock.response";


interface Options {
  page?: number | string;
  limit?: number | string;
  search?: string;
}

export const getStockAction = async (options: Options): Promise<StockResponse> => {

  const { page, limit, search } = options;

  const { data } = await agroApi.get<StockResponse>('/stock', {
    params: {
      page,
      limit,
      search
    }
  });

  return data;
}
