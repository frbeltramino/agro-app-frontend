import { Delivery } from '@/interfaces/sales/seed.sale.delivery.interface';
import { useState } from 'react'

export const useSeedSaleEditForm = () => {


  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [editingDeliveryIndex, setEditingDeliveryIndex] = useState<number | null>(null);
  const [availableTn, setAvailableTn] = useState(0);//tn disponibles del cultivo
  const [totalTnSold, setTotalTnSold] = useState(0);//tn vendidas del cultivo
  const [totalTn, setTotalTn] = useState(0);//tn cosechadas del cultivo

  const createOrUpdateDeliveries = ({ data, deliveries, editingDeliveryIndex, initialData }: any) => {

    const newDelivery: Delivery = {
      id: editingDeliveryIndex !== null ? deliveries[editingDeliveryIndex].id : null,
      primary_liquidation_number: data.primary_liquidation_number,
      seed_sale_id: initialData?.id || null,
      crop_name_id: initialData?.crop_name_id || null,
      delivery_date: data.delivery_date,
      destination: data.destination,
      tn_delivered: Number(data.tn_delivered || 0),
      price_per_tn: Number(data.price_per_tn),
    }

    if (editingDeliveryIndex !== null) {
      const updatedDeliveries = [...deliveries]
      updatedDeliveries[editingDeliveryIndex] = newDelivery
      setDeliveries(updatedDeliveries)
      calculateAvailableTnForDelivery(updatedDeliveries)
      setEditingDeliveryIndex(null)
    } else {
      const arrDeliveries = [...deliveries, newDelivery]
      setDeliveries(arrDeliveries)
      calculateAvailableTnForDelivery(arrDeliveries)

    }
  }

  const calculateAvailableTnForDelivery = (deliveries: Delivery[]) => {
    const totalTnDeliveries = deliveries.reduce((sum, d) => sum + d.tn_delivered, 0);
    setTotalTnSold(totalTnDeliveries);
    setAvailableTn(totalTn - totalTnDeliveries);
  }


  return {
    deliveries,
    editingDeliveryIndex,
    setDeliveries,
    setEditingDeliveryIndex,
    setAvailableTn,
    availableTn,
    setTotalTnSold,
    totalTnSold,
    totalTn,
    setTotalTn,
    createOrUpdateDeliveries
  }


}
