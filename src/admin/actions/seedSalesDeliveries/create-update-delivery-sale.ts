import { agroApi } from "@/api/agroApi";
import { Delivery } from "@/interfaces/sales/seed.sale.delivery.interface";

export const createUpdateSaleDeliveryAction = async (deliveryItem: Delivery) => {
  const { id, seed_sale_id, crop_id, delivery_date, destination, kg_delivered, price_per_kg } = deliveryItem;
  const isCreating = !id;
  const { data } = await agroApi<Delivery>({
    url: isCreating ? "deliveries/seed/new" : `deliveries/seed/${id}`,
    method: isCreating ? "POST" : "PATCH",
    data: {
      seed_sale_id,
      crop_id,
      delivery_date,
      destination,
      kg_delivered,
      price_per_kg,
    },
  });
  return data;
};