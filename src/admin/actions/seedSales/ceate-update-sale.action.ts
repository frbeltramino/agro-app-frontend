import { agroApi } from "@/api/agroApi";
import { SeedSaleCreateResponse } from "@/interfaces/sales/seed.sale.create-update.response";
import { SeedSale } from "@/interfaces/sales/seed.sale.interface";


export const createUpdateSaleAction = async (seedSaleItem: SeedSale): Promise<SeedSaleCreateResponse> => {
  const { id, waybill_number, sale_date, destination, kg_delivered, kg_sold, status } = seedSaleItem;
  const isCreating = !id
  const { data } = await agroApi<SeedSaleCreateResponse>({
    url: isCreating ? '/seed/sales/new' : `/seed/sales/${id}`,
    method: isCreating ? 'POST' : 'PATCH',
    data: {
      waybill_number,
      sale_date,
      destination,
      kg_delivered,
      kg_sold,
      status
    }
  })
  return data;




}