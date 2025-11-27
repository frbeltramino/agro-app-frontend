import { agroApi } from "@/api/agroApi"
import { StockResponse } from "@/interfaces/stock/stock.response";


interface Options {
  page?: number | string;
  limit?: number | string;
  search?: string;
  categoryId?: string;
}

export const getStockAction = async (options: Options): Promise<StockResponse> => {

  const { page, limit, search, categoryId } = options;

  const { data } = await agroApi.get<StockResponse>('/stock', {
    params: {
      page,
      limit,
      search,
      category_id: categoryId
    }
  });

  return data;
}
