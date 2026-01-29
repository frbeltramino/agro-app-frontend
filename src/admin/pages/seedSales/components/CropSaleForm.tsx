import { SidePanel } from "@/admin/components/SidePanel";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSeedSales } from "@/admin/hooks/useSeedSale";
import { toast } from "sonner";
import { SeedSale } from "@/interfaces/sales/seed.sale.interface";
import { Button } from "@/components/ui/button";
import { SaleSummary } from "./SaleSummary";
import { CreateSaleForm } from "./CreateSaleForm";
import { useSaleFormStore } from "../store/useSaleForm.store";
import { useCropSaleAvailability } from "@/admin/hooks/useCropSaleAvailability";
import { CustomErrorSection } from "@/components/custom/CustomErrorSection";
import { SeedSaleTotals } from "./SeedSaleTotals";
import { DollarSign } from "lucide-react";

interface seedSalesFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface FormValues {
  primary_liquidation_number: string
  sale_date: string
  destination: string
  tn_sold: number | undefined
  price_per_tn: number | undefined
  crop_name_id: number | null
  campaign_id: number | null
}

export const CropSaleForm = ({ isOpen, onClose }: seedSalesFormProps) => {

  const [isSaving, setIsSaving] = useState(false);
  const { newSaleData, setNewSaleData } = useSaleFormStore();

  const campaignId = newSaleData?.campaignId ?? null;
  const cropNameId = newSaleData?.cropNameId ?? null;

  const {
    data: availabilityData,
    isLoading,
    isError,
  } = useCropSaleAvailability({
    campaignId,
    cropNameId
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control

  } = useForm<FormValues>({
    defaultValues: {
      primary_liquidation_number: "",
      sale_date: new Date().toISOString().split("T")[0],
      destination: "",
      tn_sold: undefined,
      price_per_tn: undefined,
    },
  })

  const {
    mutation: mutationSale
  } = useSeedSales({
    waybill_number: "",
    destination: "",
    start_date: "",
    end_date: "",
  })

  const onFormSubmit = (data: FormValues) => {
    setIsSaving(true);

    const item: SeedSale = {
      id: null,
      primary_liquidation_number: data.primary_liquidation_number,
      crop_name_id: newSaleData?.cropNameId ?? null,
      sale_date: data.sale_date,
      destination: data.destination,
      tn_sold: Number(data.tn_sold),
      price_per_tn: Number(data.price_per_tn),
      campaign_id: newSaleData?.campaignId ?? null,
      crop_name: newSaleData?.cropName || "",
    }

    if (Number(data.tn_sold) > availabilityData?.total_delivered_tn) {
      toast.error("Las tn de las entregas no pueden exceder las tn entregados totales")
      setIsSaving(false)
      return
    }

    mutationSale.mutateAsync(item, {
      onSuccess: () => {
        toast.success("Venta de semillas guardada correctamente");
      },
      onError: (error) => {
        console.log(error);
        toast.error("Error al crear la venta", { position: 'top-right' });
      }
    });
    setNewSaleData(null);
    reset()
    onClose()
    setIsSaving(false)
  }

  useEffect(() => {
    if (!isOpen) return;

    reset({
      campaign_id: 0,
      crop_name_id: 0,
      primary_liquidation_number: "",
      destination: "",
      sale_date: new Date().toISOString().split("T")[0],
      tn_sold: 0,

    });

  }, [isOpen]);

  const getAvailableTnToSale = () => {
    if (!availabilityData) return 0;
    return (availabilityData.total_delivered_tn || 0) - (availabilityData.total_sold_tn || 0);
  }



  return (
    <SidePanel
      isOpen={isOpen}
      onClose={onClose}
      title={"Nueva Venta de Semillas"}
      width="lg"
      icon={DollarSign}
      iconColor="text-yellow-500"

    >
      {isError ? (
        <CustomErrorSection
          message="No se pudo obtener la información de este cultivo. Intenta recargar o contacta al soporte."
          onClose={onClose}
          showButton={true} // o false si no quieres mostrar el botón
        />
      ) : (
        <form
          id="seed-sale-form"
          onSubmit={handleSubmit(onFormSubmit)}
          className="space-y-4 md:space-y-6 mt-2"
        >
          <div className="space-y-4">
            <h3 className="text-base md:text-lg font-semibold">
              Datos De la Venta
            </h3>

            <>
              <SaleSummary
                showContext
                selectedCampaign={newSaleData?.campaignName || ""}
                cropName={newSaleData?.cropName || ""}
                cropTotalDelivered={availabilityData?.total_delivered_tn}
                cropTotalSold={availabilityData?.total_sold_tn}
                contextOpenValue={true}
                loading={isLoading}
              />
              {
                !isLoading && (
                  <>

                    <SeedSaleTotals
                      totalTnLabel1="tn Totales entregadas"
                      totalTnLabel2="tn vendidas"
                      totalTn1={availabilityData?.total_delivered_tn || 0}
                      totalTn2={availabilityData?.total_sold_tn || 0}
                      availableTn={getAvailableTnToSale()}
                    />

                    <div className="space-y-3">
                      {
                        availabilityData && availabilityData.total_delivered_tn <= 0 ? (
                          <>
                            <div className="text-center py-6 text-destructive border border-destructive rounded-lg border-dashed bg-destructive/10">
                              <p className="text-sm font-medium">No hay entregas registradas para éste cultivo</p>
                              <p className="text-xs">Haz clic en "Nueva Entrega" para crear una y luego poder crear una venta</p>
                            </div>
                            <Button
                              className="w-full"
                              size="lg"
                              onClick={() => {
                                setNewSaleData(null);
                                onClose();
                              }}
                              variant="outline"
                            >
                              Cerrar
                            </Button>
                          </>
                        ) : (

                          <CreateSaleForm
                            register={register}
                            control={control}
                            errors={errors}
                            onSubmit={handleSubmit(onFormSubmit)}
                            onCancel={() => {
                              onClose();
                              reset({
                                primary_liquidation_number: "",
                                sale_date: "",
                                destination: "",
                                tn_sold: undefined,
                                price_per_tn: undefined,
                              })
                            }}
                            isSaving={isSaving}
                          />

                        )
                      }

                    </div>
                  </>
                )
              }
            </>
          </div>
        </form>
      )}
    </SidePanel>
  )
}
