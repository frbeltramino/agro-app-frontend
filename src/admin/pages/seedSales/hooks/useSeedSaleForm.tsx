
import { CropSale } from "@/interfaces/crops/crop.sales.response";
import { SeedSale } from "@/interfaces/sales/seed.sale.interface";
import { useState } from "react"


export const useSeedSaleForm = () => {

  const [seedSales, setSeedSales] = useState<SeedSale[]>([]);
  const [editingSaleIndex, setEditingSaleIndex] = useState<number | null>(null);
  const [availableTn, setAvailableTn] = useState(0);//tn disponibles del cultivo
  const [totalTnSold, setTotalTnSold] = useState(0);//tn vendidas del cultivo
  const [totalTn, setTotalTn] = useState(0);//tn cosechadas del cultivo
  const [selectedCrop, setSelectedCrop] = useState<CropSale | null>(null);
  const [cropsData, setCropsData] = useState<CropSale[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<string | null>(null);
  const [totalTnForSale, setTotalTnForSale] = useState(0);//tn totales de la entrega
  const [availableTnForSale, setAvailableTnForSale] = useState(0);//tn disponibles de la entrega

  const getCropInfo = (selectedCropNameId: number) => {
    const crop =
      selectedCropNameId != null
        ? cropsData.find(c => c.crop_name_id === Number(selectedCropNameId))
        : cropsData[0];
    if (crop) {
      setSelectedCrop(crop)
    }
    return crop;
  }



  return {

    seedSales,
    editingSaleIndex,
    setSeedSales,
    setEditingSaleIndex,
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
    setAvailableTnForSale,
    availableTnForSale,
    totalTnForSale,
    setTotalTnForSale

  }
}
