import { agroApi } from "@/api/agroApi";
import { Delivery } from "@/interfaces/sales/seed.sale.delivery.interface";

export const createUpdateSaleDeliveryAction = async (deliveryItem: Delivery) => {
  const { crop_name_id, id, waybill_number, delivery_date, destination, tn_delivered, status, campaign_id } = deliveryItem;
  const isCreating = !id;
  const { data } = await agroApi<Delivery>({
    url: isCreating ? "deliveries/seed/new" : `deliveries/seed/${id}`,
    method: isCreating ? "POST" : "PATCH",
    data: {
      crop_name_id,
      waybill_number,
      delivery_date,
      destination,
      tn_delivered,
      campaign_id,
      status
    },
  });
  return data;
};