import { Delivery } from "@/interfaces/sales/seed.sale.delivery.interface"
import { formatNumber } from "@/lib/format-number"
import { useState } from "react"
import { toast } from "sonner"


export const useSeedSaleForm = () => {

  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [editingDeliveryIndex, setEditingDeliveryIndex] = useState<number | null>(null);

  const createOrUpdateDeliveries = ({ data, deliveries, editingDeliveryIndex, initialData, totalKgDelivered, totalKgSold }: any) => {
    const availableKg =
      totalKgDelivered -
      (totalKgSold - (editingDeliveryIndex !== null ? deliveries[editingDeliveryIndex].kg_delivered : 0))

    if (data.kg_delivered !== undefined && data.kg_delivered > availableKg) {
      toast.error(`Solo hay ${formatNumber(availableKg.toString())} kg disponibles`)
      return
    }

    const newDelivery: Delivery = {
      id: editingDeliveryIndex !== null ? deliveries[editingDeliveryIndex].id : null,
      waybill_number: data.waybill_delivery_number,
      seed_sale_id: initialData?.id || null,
      crop_name_id: initialData?.crop_name_id || null,
      delivery_date: data.delivery_date,
      destination: data.destination,
      kg_delivered: Number(data.kg_delivered || 0),
      price_per_kg: Number(data.price_per_kg),
    }

    if (editingDeliveryIndex !== null) {
      const updatedDeliveries = [...deliveries]
      updatedDeliveries[editingDeliveryIndex] = newDelivery
      setDeliveries(updatedDeliveries)
      setEditingDeliveryIndex(null)
    } else {
      setDeliveries([...deliveries, newDelivery])
    }
  }


  return {
    createOrUpdateDeliveries,
    deliveries,
    editingDeliveryIndex,
    setDeliveries,
    setEditingDeliveryIndex
  }
}
