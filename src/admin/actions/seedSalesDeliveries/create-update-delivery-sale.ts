import { agroApi } from "@/api/agroApi";
import { Delivery } from "@/interfaces/sales/seed.sale.delivery.interface";

export const createUpdateSaleDeliveryAction = async (deliveryItem: Delivery) => {
  const { id, waybill_number, seed_sale_id, crop_name_id, delivery_date, destination, tn_delivered, price_per_tn } = deliveryItem;
  const isCreating = !id;
  const { data } = await agroApi<Delivery>({
    url: isCreating ? "deliveries/seed/new" : `deliveries/seed/${id}`,
    method: isCreating ? "POST" : "PATCH",
    data: {
      seed_sale_id,
      waybill_number,
      crop_name_id,
      delivery_date,
      destination,
      tn_delivered,
      price_per_tn,
    },
  });
  return data;
};