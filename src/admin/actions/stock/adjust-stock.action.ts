import { agroApi } from "@/api/agroApi";
import { AdjustStockresponse } from "@/interfaces/stock/stock.adjust.response";

interface AdjustStockPayload {
  stockId: number;
  quantity: number;
}

export const adjustStockAction = async (payload: AdjustStockPayload): Promise<AdjustStockresponse> => {
  console.log({ payloadStock: payload });
  const { data } = await agroApi<any>({
    url: `/stock/${payload.stockId}/adjust`,
    method: "PATCH",
    data: {
      quantity_change: payload.quantity,
    },
  });
  return data;
};