import { agroApi } from "@/api/agroApi";
import { Stock } from "@/interfaces/stock/stock.interface";
import { StockCreateUpdateResponse } from "@/interfaces/stock/stock.update.create.response";


export const createOrUpdateStockAction = async (stockItem: Stock): Promise<StockCreateUpdateResponse> => {

  const { id, name, category_id, unit, quantity_available, price_per_unit, expiration_date, status } = stockItem;

  const isCreating = !id

  const { data } = await agroApi<StockCreateUpdateResponse>({
    url: isCreating ? '/stock/new' : `/stock/${id}`,
    method: isCreating ? 'POST' : 'PATCH',
    data: {
      name,
      category_id,
      unit,
      quantity_available,
      price_per_unit,
      expiration_date,
      status
    }
  })
  return data;
};