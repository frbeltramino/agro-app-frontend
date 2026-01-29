import { SidePanel } from "@/admin/components/SidePanel"
import { Truck } from "lucide-react"
import { useForm } from "react-hook-form";
import { DeliveryStep2 } from "./DeliveryStep2";
import { useState } from "react";
import { SaleSummary } from "./SaleSummary";
import { useDeliveryFormStore } from "../store/useDeliveryFormStore";
import { useCropSaleAvailability } from "@/admin/hooks/useCropSaleAvailability";
import { useSeedSaleDelivery } from "@/admin/hooks/useSeedSaleDelivery";
import { Delivery } from "@/interfaces/sales/seed.sale.delivery.interface";
import { toast } from "sonner";
import { CustomErrorSection } from "@/components/custom/CustomErrorSection";
import { CustomLoadingCard } from "@/components/custom/CustomLoadingCard";

interface seedSalesFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface FormValues {
  id?: number | string | null;
  waybill_number: string
  delivery_date: string
  destination: string
  status: string
  crop_name_id: number | null
  campaign_id: number | null
  tn_delivered: number | undefined
}


export const CropDeliveryForm = ({ isOpen, onClose }: seedSalesFormProps) => {

  const [isSaving, setIsSaving] = useState(false);
  const { newDeliveryData, closeDeliveryForm } = useDeliveryFormStore();


  const campaignId = newDeliveryData?.campaignId ?? null;
  const cropNameId = newDeliveryData?.cropNameId ?? null;

  const {
    data: availabilityData,
    isLoading,
    isError,
  } = useCropSaleAvailability({
    campaignId,
    cropNameId
  });

  const {
    mutation: mutationDelivery,
  } = useSeedSaleDelivery()

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
    watch,
    trigger,
    clearErrors,
    setValue
  } = useForm<FormValues>({
    defaultValues: {
      campaign_id: null,
      crop_name_id: null,
      waybill_number: "",
      destination: "",
      delivery_date: new Date().toISOString().split("T")[0] + "Z",
      tn_delivered: 0,
      status: "pending",
    },
  });

  const getAvailableTnToDeliver = () => {
    if (!availabilityData) return 0;
    return (availabilityData.total_harvested_tn || 0) - (availabilityData.total_delivered_tn || 0);

  }


  const onFormSubmit = (data: FormValues) => {
    console.log(data);
    setIsSaving(true)
    const availableTnToDeliver = getAvailableTnToDeliver();
    if (Number(data.tn_delivered) > availableTnToDeliver) {
      toast.error("Las tn a entregar no pueden exceder las tn cosechadas")
      setIsSaving(false)
      return
    }
    if (!newDeliveryData?.campaignId || !newDeliveryData?.cropNameId) {
      toast.error("Debes seleccionar un cultivo y campaña para poder crear una entrega")
      setIsSaving(false)
      return
    }
    const item: Delivery = {
      id: null,
      campaign_id: newDeliveryData?.campaignId,
      crop_name_id: newDeliveryData?.cropNameId,
      tn_delivered: Number(data.tn_delivered),
      waybill_number: data.waybill_number,
      destination: data.destination,
      status: data.status,
      delivery_date: data.delivery_date,
    }

    mutationDelivery.mutateAsync(item, {
      onSuccess: () => {
        toast.success("Entrega de semillas guardada correctamente");
      },
      onError: (error) => {
        console.log(error);
        toast.error("Error al crear la entrega", { position: 'top-right' });
      }
    });

    setIsSaving(false)
    closeDeliveryForm()
    reset()
  }



  return (
    <SidePanel
      isOpen={isOpen}
      onClose={onClose}
      title={"Nueva Entrega de Semillas"}
      width="lg"
      icon={Truck}
      iconColor="text-green-500"
    >
      {
        isError && (
          <CustomErrorSection
            message="No se pudo obtener la información de este cultivo. Intenta recargar o contacta al soporte."
            onClose={onClose}
            showButton={true}
          />
        )
      }
      {
        isLoading && (
          <CustomLoadingCard />
        )
      }
      {
        !isLoading && !isError && (
          <>

            <SaleSummary
              showContext={true}
              selectedCampaign={newDeliveryData?.campaignName || ""}
              cropName={newDeliveryData?.cropName || ""}
              cropTotalHervested={availabilityData?.total_harvested_tn}
              cropTotalDelivered={availabilityData?.total_delivered_tn}
              contextOpenValue={true}
            />

            <DeliveryStep2
              register={register}
              errors={errors}
              trigger={trigger}
              clearErrors={clearErrors}
              selectedCrop={{
                crop_name_id: newDeliveryData?.cropNameId || 0,
                crop_name: newDeliveryData?.cropName || "",
                campaign_id: newDeliveryData?.campaignId || 0,
                total_harvested_tn: availabilityData?.total_harvested_tn,
                total_delivered_tn: availabilityData?.total_delivered_tn,
                total_sold_tn: availabilityData?.total_sold_tn,
              }}
              selectedCampaign={newDeliveryData?.campaignName || ""}
              onCancelClick={closeDeliveryForm}
              onErrorClick={closeDeliveryForm}
              controlSale={control}
              watch={watch}
              setValue={setValue}
              onSubmit={handleSubmit(onFormSubmit)}
              isSaving={isSaving}


            />

          </>
        )
      }



    </SidePanel>
  )
}

