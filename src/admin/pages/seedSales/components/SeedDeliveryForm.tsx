import { SidePanel } from "@/admin/components/SidePanel";
import { Stepper } from "@/components/custom/StepIndicator";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { DeliveryStep1 } from "./DeliveryStep1";
import { useCampaignsForSale } from "@/admin/hooks/useCampaignsForSale";
import { Campaign } from "@/interfaces/campaigns/campaigns-for-sale.response"
import { useCropsToSale } from "@/admin/hooks/useCropsToSale";
import { useSeedSaleForm } from "../hooks/useSeedSaleForm";
import { DeliveryStep2 } from "./DeliveryStep2";
import { useSeedSaleDelivery } from "@/admin/hooks/useSeedSaleDelivery";
import { Delivery } from "@/interfaces/sales/seed.sale.delivery.interface";
import { toast } from "sonner";
import { InfoIcon, Truck } from "lucide-react";
import { SaleSummary } from "./SaleSummary";
import { FormSection } from "@/admin/helpers/formSectionHelper";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface seedSalesFormProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenChange: (open: boolean) => void;
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

export const SeedDeliveryForm = ({ isOpen, onClose }: seedSalesFormProps) => {

  const [step, setStep] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const { data: campaignsForSale } = useCampaignsForSale();

  const {
    setSeedSales,
    setAvailableTn,
    setTotalTnSold,
    setSelectedCrop,
    selectedCrop,
    getCropInfo,
    setTotalTn,
    setCropsData,
    cropsData,
    selectedCampaign,
    setSelectedCampaign
  } = useSeedSaleForm();

  const campaignsData: Campaign[] = campaignsForSale?.campaigns || [];

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

  const {
    mutation: mutationDelivery,
  } = useSeedSaleDelivery()

  const selectedCropNameId = watch("crop_name_id");
  const selectedCampaignId = watch("campaign_id");

  const {
    data: cropsToSale,
    isLoading: cropsCampaignLoading,
    error: cropsCampaignError,
  } = useCropsToSale({
    campaignId: selectedCampaignId ?? 0,
    enabled: !!selectedCampaignId,
  });


  const onFormSubmit = (data: FormValues) => {
    console.log(data);
    setIsSaving(true)

    const item: Delivery = {
      id: null,
      campaign_id: Number(data.campaign_id),
      crop_name_id: Number(data.crop_name_id),
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


    reset()
    onClose()
    setIsSaving(false)
  }

  const handleCampaignChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = Number(e.target.value);
    const campaign = campaignsData.find(c => c.id === selectedId);
    setSelectedCampaign(campaign?.name || "");
  };

  useEffect(() => {
    if (!isOpen) return;

    setStep(1);


    reset({
      campaign_id: 0,
      crop_name_id: 0,
      waybill_number: "",
      destination: "",
      delivery_date: new Date().toISOString().split("T")[0] + "Z",
      tn_delivered: 0,
      status: "pending",

    });

    setSeedSales([]);
    setSelectedCrop(null);
    setCropsData([]);
    setTotalTn(0);
    setTotalTnSold(0);
    setAvailableTn(0);

  }, [isOpen]);

  useEffect(() => {
    if (!selectedCampaignId) return;

    // Solo limpiamos el cultivo, no reseteamos todo
    setValue("crop_name_id", 0);  // react-hook-form
    setSelectedCrop(null);
    setCropsData([]);
    setTotalTn(0);
    setTotalTnSold(0);
    setAvailableTn(0);
    setSeedSales([]);
  }, [selectedCampaignId, setValue]);

  useEffect(() => {
    if (!cropsToSale?.crops) {
      setCropsData([]);
      return;
    }

    setCropsData(cropsToSale.crops);
    setSelectedCrop(null); // no autoseleccionamos
  }, [cropsToSale]);

  useEffect(() => {
    if (!selectedCropNameId || !cropsData.length) return;

    const crop = getCropInfo(selectedCropNameId);
    if (!crop) return;

    setSelectedCrop(crop);
    setAvailableTn(crop.total_harvested_tn - crop.total_delivered_tn || 0);
    setTotalTn(crop.total_harvested_tn || 0);
    setTotalTnSold(0);
  }, [selectedCropNameId, cropsData]);


  return (
    <SidePanel
      isOpen={isOpen}
      onClose={onClose}
      title={"Nueva Entrega de Semillas"}
      width="lg"
      icon={Truck}
      iconColor="text-green-500"
    >
      <Stepper step={step} steps={["Selecciona el cultivo", "Datos De la entrega"]} />

      <form
        id="seed-sale-form"
        onSubmit={handleSubmit(onFormSubmit)}
        className="space-y-4 md:space-y-6 mt-2"
      >
        <div className="space-y-4">
          <h3 className="text-base md:text-lg font-semibold">
            {
              step === 1 ? "Selecciona el cultivo" : "Datos De la entrega"
            }
          </h3>
          {
            step === 1 && (
              <>

                <Alert variant="info">
                  <InfoIcon />
                  <AlertTitle>Cultivos!</AlertTitle>
                  <AlertDescription>
                    Los cultivos solo aparecerán si tienen fecha y toneladas cosechadas registradas en la sección de "Cultivos".
                  </AlertDescription>
                </Alert>
                <DeliveryStep1
                  register={register}
                  trigger={trigger}
                  clearErrors={clearErrors}
                  onClose={onClose}
                  setStep={setStep}
                  campaignsData={campaignsData}
                  cropsData={cropsData}
                  cropsCampaignLoading={cropsCampaignLoading}
                  cropsCampaignError={cropsCampaignError}
                  handleCampaignChange={handleCampaignChange}
                />
              </>
            )
          }

          {
            step === 2 && (
              <>
                <FormSection>
                  <SaleSummary
                    showContext={true}
                    selectedCampaign={selectedCampaign}
                    cropName={selectedCrop?.crop_name}
                    cropTotalHervested={selectedCrop?.total_harvested_tn}
                    cropTotalDelivered={selectedCrop?.total_delivered_tn}
                    contextOpenValue={true}
                  />
                </FormSection>

                <DeliveryStep2
                  register={register}
                  errors={errors}
                  trigger={trigger}
                  clearErrors={clearErrors}
                  selectedCrop={selectedCrop}
                  selectedCampaign={selectedCampaign}
                  onErrorClick={() => setStep(1)}
                  onCancelClick={() => setStep(1)}
                  controlSale={control}
                  watch={watch}
                  setValue={setValue}
                  onSubmit={handleSubmit(onFormSubmit)}
                  isSaving={isSaving}
                />

              </>

            )
          }
        </div>
      </form>
    </SidePanel>
  )
}
