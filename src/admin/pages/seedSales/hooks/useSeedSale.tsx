import { Delivery } from "@/interfaces/sales/seed.sale.delivery.interface"
import { formatNumber } from "@/lib/format-number"
import { useState } from "react"
import { toast } from "sonner"


export const useSeedSale = () => {

  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [editingDeliveryIndex, setEditingDeliveryIndex] = useState<number | null>(null);

  const createOrUpdateDeliveries = ({ data, deliveries, editingDeliveryIndex, initialData, totalKgDelivered, selectedCropId, totalKgSold }: any) => {
    const availableKg =
      totalKgDelivered -
      (totalKgSold - (editingDeliveryIndex !== null ? deliveries[editingDeliveryIndex].kg_delivered : 0))

    if (data.kg_delivered !== undefined && data.kg_delivered > availableKg) {
      toast.error(`Solo hay ${formatNumber(availableKg.toString())} kg disponibles`)
      return
    }

    const newDelivery: Delivery = {
      id: editingDeliveryIndex !== null ? deliveries[editingDeliveryIndex].id : null,
      seed_sale_id: initialData?.id || null,
      crop_id: selectedCropId,
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
