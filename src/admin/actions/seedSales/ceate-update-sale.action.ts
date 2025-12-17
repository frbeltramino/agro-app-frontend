import { agroApi } from "@/api/agroApi";
import { SeedSaleCreateResponse } from "@/interfaces/sales/seed.sale.create-update.response";
import { SeedSale } from "@/interfaces/sales/seed.sale.interface";


export const createUpdateSaleAction = async (seedSaleItem: SeedSale): Promise<SeedSaleCreateResponse> => {
  const { crop_id, id, waybill_number, sale_date, destination, kg_delivered, kg_sold, status } = seedSaleItem;
  const isCreating = !id
  const { data } = await agroApi<SeedSaleCreateResponse>({
    url: isCreating ? 'sales/seed/new' : `sales/seed/${id}`,
    method: isCreating ? 'POST' : 'PATCH',
    data: {
      crop_id,
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