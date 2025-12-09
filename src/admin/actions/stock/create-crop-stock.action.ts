import { agroApi } from "@/api/agroApi";
import { CreateCropStockResponse } from "@/interfaces/stock/crop.stock.create.response";

interface CreateCropStockRequest {
  crop_id: number
  stock_id: number
  used_quantity: number
  note?: string
  category_id: number
  unit: string
  price_per_unit: number
  dose_per_ha: number
  hectares: number
  status: string
}

export const createCropStockAction = async (payload: CreateCropStockRequest): Promise<CreateCropStockResponse> => {

  const { data } = await agroApi<CreateCropStockResponse>({
    url: 'crop/stock/register',
    method: 'POST',
    data: payload
  })

  return data;

};