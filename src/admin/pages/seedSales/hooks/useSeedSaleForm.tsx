
import { CropSale } from "@/interfaces/crops/crop.sales.response";
import { Delivery } from "@/interfaces/sales/seed.sale.delivery.interface"
import { useState } from "react"


export const useSeedSaleForm = () => {

  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [editingDeliveryIndex, setEditingDeliveryIndex] = useState<number | null>(null);
  const [availableTn, setAvailableTn] = useState(0);//tn disponibles del cultivo
  const [totalTnSold, setTotalTnSold] = useState(0);//tn vendidas del cultivo
  const [totalTn, setTotalTn] = useState(0);//tn cosechadas del cultivo
  const [selectedCrop, setSelectedCrop] = useState<CropSale | null>(null);
  const [cropsData, setCropsData] = useState<CropSale[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<string | null>(null);
  const [totalTnForDelivery, setTotalTnForDelivery] = useState(0);//tn totales de la entrega
  const [availableTnForDelivery, setAvailableTnForDelivery] = useState(0);//tn disponibles de la entrega
  // const [totalTnSoldForDelivery, setTotalTnSoldForDelivery] = useState(0);// tn vendidas de la entrega


  const createOrUpdateDeliveries = ({ data, deliveries, editingDeliveryIndex, initialData }: any) => {
    setAvailableTn(prev => Math.max(prev - Number(data.tn_delivered), 0));
    setTotalTnSold(prev => prev + Number(data.tn_delivered));
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
      setDeliveries(updatedDeliveries);
      setEditingDeliveryIndex(null)
    } else {
      setDeliveries([...deliveries, newDelivery])
    }
  }

  const getCropInfo = (selectedCropNameId: number) => {
    const crop =
      selectedCropNameId != null
        ? cropsData.find(c => c.crop_name_id === Number(selectedCropNameId))
        : cropsData[0];
    return crop;
  }



  return {
    createOrUpdateDeliveries,
    deliveries,
    editingDeliveryIndex,
    setDeliveries,
    setEditingDeliveryIndex,
    setAvailableTn,
    availableTn,
    setTotalTnSold,
    totalTnSold,
    selectedCrop,
    setSelectedCrop,
    getCropInfo,
    totalTn,
    setTotalTn,
    cropsData,
    setCropsData,
    selectedCampaign,
    setSelectedCampaign,
    setAvailableTnForDelivery,
    availableTnForDelivery,
    totalTnForDelivery,
    setTotalTnForDelivery

  }
}
