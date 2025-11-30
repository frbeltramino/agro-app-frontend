import { agroApi } from "@/api/agroApi";
import { SeedSalesResponse } from "@/interfaces/sales/seed.sales.response";

interface Options {
  page?: number | string;
  limit?: number | string;
  waybill_number?: string,
  destination?: string,
  start_date?: string,
  end_date?: string,
}

export const getSeedSalesAction = async (options: Options): Promise<SeedSalesResponse> => {

  const { page, limit } = options;

  const response = await agroApi.get<SeedSalesResponse>('/sales/seed', {
    params: {
      page,
      limit,
      ...options
    }
  });
  return response.data;
};