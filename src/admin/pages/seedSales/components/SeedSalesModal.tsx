"use client"

import { forwardRef, useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"

import { toast } from "sonner"
import { formatNumber } from "@/lib/format-number"
import { PlusCircle } from "lucide-react"
import { SeedSale } from "@/interfaces/sales/seed.sale.interface"

import { useSeedSaleForm } from "../hooks/useSeedSaleForm"
import { SeedSaleDeliveryForm } from "./SeedSaleDeliveryForm"
import { SeedSaleDeliveriesTable } from "./SeedSaleDeliveriesTable"
import { SidePanel } from "@/admin/components/SidePanel"
import { useCampaignsForSale } from "@/admin/hooks/useCampaignsForSale"
import { Campaign } from "@/interfaces/campaigns/campaigns-for-sale.response"
import { Stepper } from "@/components/custom/StepIndicator"
import { useCropsToSale } from "@/admin/hooks/useCropsToSale"
import { SaleStep1 } from "./SaleStep1"
import { SeleStep2 } from "./SaleStep2"
import { SaleSummary } from "./SaleSummary"



export interface FormValues {
  campaign_id: number
  crop_name_id: number
  waybill_number: string
  destination: string
  date: string
  tn_delivered: number
  status: string
}

interface DeliveryFormValues {
  primary_liquidation_number: string | undefined | null
  delivery_date: string
  destination: string
  tn_delivered: number | undefined
  price_per_tn: number | undefined
}

interface SeedSalesModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (item: SeedSale) => void
}


export const SeedSalesModal = forwardRef<HTMLDivElement, SeedSalesModalProps>(
  ({ isOpen, onClose, onSave }) => {
    const [isSaving, setIsSaving] = useState(false);

    const [isAddingDelivery, setIsAddingDelivery] = useState(false);

    const { data: campaignsForSale } = useCampaignsForSale();

    const campaignsData: Campaign[] = campaignsForSale?.campaigns || [];

    const [step, setStep] = useState(1);

    const {
      createOrUpdateDeliveries,
      deliveries,
      editingDeliveryIndex,
      setDeliveries,
      setEditingDeliveryIndex,
      setAvailableTn,
      availableTn,
      setTotalTnSold,
      totalTnSold,
      setSelectedCrop,
      selectedCrop,
      getCropInfo,
      setTotalTn,
      setCropsData,
      cropsData,
      selectedCampaign,
      setSelectedCampaign
    } = useSeedSaleForm();

    const {
      register,
      handleSubmit,
      formState: { errors },
      reset,
      control: controlSale,
      watch,
      trigger,
      clearErrors,
      setValue
    } = useForm<FormValues>({
      defaultValues: {
        campaign_id: 0,
        crop_name_id: 0,
        waybill_number: "",
        destination: "",
        date: new Date().toISOString().split("T")[0] + "Z",
        tn_delivered: 0,
        status: "pending",
      },
    });

    const {
      register: registerDelivery,
      handleSubmit: handleSubmitDelivery,
      formState: { errors: deliveryErrors },
      reset: resetDelivery,
      control: controlDelivery,
    } = useForm<DeliveryFormValues>({
      defaultValues: {
        primary_liquidation_number: "",
        delivery_date: new Date().toISOString().split("T")[0],
        destination: "",
        tn_delivered: undefined,
        price_per_tn: undefined,
      },
    })

    const totalTnDelivered = watch("tn_delivered") || 0;
    const selectedCropNameId = watch("crop_name_id");
    const selectedCampaignId = watch("campaign_id");
    const summaryValues = watch([
      "waybill_number",
      "destination",
      "date",
      "status",
      "tn_delivered",
    ]);


    const handleCampaignChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const selectedId = Number(e.target.value);
      const campaign = campaignsData.find(c => c.id === selectedId);
      setSelectedCampaign(campaign?.name || "");
    };

    const {
      data: cropsToSale,
      isLoading: cropsCampaignLoading,
      error: cropsCampaignError,
    } = useCropsToSale({
      campaignId: selectedCampaignId ?? 0,
      enabled: !!selectedCampaignId,
    });

    const onDeliverySubmit = (data: DeliveryFormValues) => {

      const tnTotalAvailable = summaryValues[4] || 0;

      if (data.tn_delivered !== undefined && data.tn_delivered > tnTotalAvailable) {
        toast.error(`Solo hay ${formatNumber(tnTotalAvailable.toString())} tn disponibles`)
        return
      }

      createOrUpdateDeliveries({
        data,
        deliveries,
        editingDeliveryIndex,
        selectedCropNameId,
      });

      setIsAddingDelivery(false)
      resetDelivery({
        primary_liquidation_number: "",
        delivery_date: "",
        destination: "",
        tn_delivered: undefined,
        price_per_tn: undefined,
      })
    }

    const handleDeleteDelivery = (index: number) => {
      const delivery = deliveries[index];
      const updateTotalTnSold = totalTnSold - Number(delivery.tn_delivered);
      const updateAvilableTn = availableTn + Number(delivery.tn_delivered);
      setTotalTnSold(updateTotalTnSold);
      setAvailableTn(updateAvilableTn);
      const updatedDeliveries = deliveries.filter((_, deliveryIndex) => deliveryIndex !== index);
      setDeliveries(updatedDeliveries)
    }

    const handleEditDelivery = (index: number) => {
      const delivery = deliveries[index]
      setEditingDeliveryIndex(index)
      setIsAddingDelivery(true)
      resetDelivery({
        primary_liquidation_number: delivery.primary_liquidation_number,
        delivery_date: delivery.delivery_date,
        destination: delivery.destination,
        tn_delivered: delivery.tn_delivered,
        price_per_tn: delivery.price_per_tn,
      })
    }

    const onFormSubmit = (data: FormValues) => {
      setIsSaving(true)

      if (totalTnSold > Number(data.tn_delivered)) {
        toast.error("Las tn de las entregas no pueden exceder las tn entregados totales")
        setIsSaving(false)
        return
      }

      const item: SeedSale = {
        id: null,
        campaign_id: Number(data.campaign_id),
        crop_name_id: Number(data.crop_name_id),
        waybill_number: data.waybill_number,
        sale_date: data.date,
        destination: data.destination,
        tn_delivered: Number(data.tn_delivered),
        tn_sold: totalTnSold,
        status: data.status,
        deliveries: deliveries,
        deleted_at: null,
        crop_name: cropsData.find(c => c.crop_name_id === Number(data.crop_name_id))?.crop_name || "",
      }
      console.log(item);
      onSave(item)
      reset()
      setDeliveries([])
      onClose()
      setIsSaving(false)
    }

    useEffect(() => {
      if (!isOpen) return;

      setStep(1);


      reset({
        campaign_id: 0,
        crop_name_id: 0,
        waybill_number: "",
        destination: "",
        date: new Date().toISOString().split("T")[0],
        tn_delivered: 0,
        status: "pending",
      });

      setDeliveries([]);
      setSelectedCrop(null);
      setCropsData([]);
      setTotalTn(0);
      setTotalTnSold(0);
      setAvailableTn(0);

    }, [isOpen]);

    // useEffect(() => {
    //   reset({
    //     ...watch(),
    //     crop_name_id: 0,
    //   });

    //   setSelectedCrop(null);
    //   setCropsData([]);
    // }, [selectedCampaignId]);

    // useEffect(() => {
    //   if (!isOpen || !initialData) return;
    //   setStep(1);
    //   const available =
    //     Number(initialData.tn_delivered) - Number(initialData.tn_sold);

    //   setTotalTnSold(Number(initialData.tn_sold));
    //   setAvailableTn(Math.max(available, 0));
    //   setTotalTn(Number(initialData.tn_delivered) || 0);
    //   setDeliveries(initialData.deliveries || []);

    //   reset({
    //     campaign_id: initialData.campaign_id,
    //     crop_name_id: initialData.crop_name_id,
    //     waybill_number: initialData.waybill_number,
    //     destination: initialData.destination,
    //     date: initialData.sale_date,
    //     tn_delivered: initialData.tn_delivered,
    //     status: initialData.status,
    //   });
    // }, [isOpen, initialData]);

    useEffect(() => {
      if (!selectedCampaignId) return;

      // Solo limpiamos el cultivo, no reseteamos todo
      setValue("crop_name_id", 0);  // react-hook-form
      setSelectedCrop(null);
      setCropsData([]);
      setTotalTn(0);
      setTotalTnSold(0);
      setAvailableTn(0);
      setDeliveries([]);
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
      >
        <Stepper step={step} steps={["Selecciona el cultivo", "Datos De la entrega", "Agregar Ventas"]} />

        <form
          id="seed-sale-form"
          onSubmit={handleSubmit(onFormSubmit)}
          className="space-y-4 md:space-y-6 mt-2"
        >
          <div className="space-y-4">
            <h3 className="text-base md:text-lg font-semibold">
              {
                step === 1 ? "Selecciona el cultivo" : step === 2 ? "Datos De la entrega" : "Agregar Ventas"
              }
            </h3>
            {
              step === 1 && (
                <>
                  <SaleStep1
                    register={register}
                    errors={errors}
                    trigger={trigger}
                    clearErrors={clearErrors}
                    campaignsData={campaignsData}
                    cropsData={cropsData}
                    cropsCampaignLoading={cropsCampaignLoading}
                    cropsCampaignError={cropsCampaignError}
                    handleCampaignChange={handleCampaignChange}
                    onClose={onClose}
                    setStep={setStep}
                    isAddingDelivery={isAddingDelivery}
                  />
                </>
              )
            }

            {
              step === 2 && (
                <>
                  <SeleStep2
                    register={register}
                    errors={errors}
                    trigger={trigger}
                    clearErrors={clearErrors}
                    cropsData={cropsData}
                    selectedCrop={selectedCrop}
                    selectedCampaign={selectedCampaign}
                    setStep={setStep}
                    isAddingDelivery={isAddingDelivery}
                    controlSale={controlSale}
                    watch={watch}
                    setValue={setValue}
                  />
                </>

              )
            }

          </div>

          {
            step === 3 && (
              <>
                <SaleSummary
                  showContext
                  showDelivery
                  formValues={{
                    waybill_number: summaryValues[0],
                    destination: summaryValues[1],
                    date: summaryValues[2],
                    status: summaryValues[3],
                    tn_delivered: summaryValues[4],
                  }}
                  cropsData={cropsData}
                  selectedCampaign={selectedCampaign}
                  selectedCrop={selectedCrop}
                  contextOpenValue={false}
                  deliveryOpenValue={true}
                />
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <h3 className="text-base md:text-lg font-semibold">Ventas</h3>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setIsAddingDelivery(true)
                        setEditingDeliveryIndex(null)
                        resetDelivery({
                          primary_liquidation_number: "",
                          delivery_date: "",
                          destination: "",
                          tn_delivered: undefined,
                          price_per_tn: undefined,
                        })
                      }}
                      disabled={isAddingDelivery || totalTnDelivered === 0}
                    >
                      <PlusCircle className="w-4 h-4 mr-1.5" />
                      <span className="hidden sm:inline">Agregar Venta</span>
                      <span className="sm:hidden">Agregar</span>
                    </Button>
                  </div>

                  {isAddingDelivery && (

                    <SeedSaleDeliveryForm
                      registerDelivery={registerDelivery}
                      controlDelivery={controlDelivery}
                      deliveryErrors={deliveryErrors}
                      isEditing={editingDeliveryIndex !== null}
                      onSubmit={handleSubmitDelivery(onDeliverySubmit)}
                      onCancel={() => {
                        setIsAddingDelivery(false)
                        resetDelivery({
                          primary_liquidation_number: "",
                          delivery_date: "",
                          destination: "",
                          tn_delivered: undefined,
                          price_per_tn: undefined,
                        })
                        setEditingDeliveryIndex(null)
                      }}
                    />

                  )}

                  {deliveries.length > 0 && (
                    <SeedSaleDeliveriesTable
                      deliveries={deliveries}
                      isAddingDelivery={isAddingDelivery}
                      onEdit={handleEditDelivery}
                      onDelete={handleDeleteDelivery}
                    />
                  )}

                  {deliveries.length === 0 && !isAddingDelivery && (
                    <div className="text-center py-6 text-muted-foreground border rounded-lg border-dashed">
                      <p className="text-sm">No hay ventas registradas</p>
                      <p className="text-xs">Haz clic en "Agregar Venta" para comenzar</p>
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(2)}
                    className="w-full"
                    disabled={isAddingDelivery}
                  >
                    Volver
                  </Button>
                  <Button
                    type="submit"
                    form="seed-sale-form"
                    disabled={isSaving || isAddingDelivery}
                    className="w-full"
                  >
                    {isSaving ? (
                      <>
                        Guardando...
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-t-transparent" />
                      </>
                    ) :
                      "Crear"
                    }
                  </Button>
                </div>
              </>
            )
          }



        </form>

      </SidePanel>
    )
  },
)

SeedSalesModal.displayName = "SeedSalesModal"