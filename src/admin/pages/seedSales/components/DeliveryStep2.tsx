import {
  FieldErrors,
  UseFormRegister,
  UseFormTrigger,
  UseFormClearErrors,
  Controller,
  UseFormWatch,
  UseFormSetValue
} from "react-hook-form";

import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CropSale } from "@/interfaces/crops/crop.sales.response";
import { AmountInput } from "@/components/custom/CustomAmountInput";
import { cn } from "@/lib/utils";
import { useEffect } from "react";
import { SeedSaleTotals } from "./SeedSaleTotals";
import { FormValues } from "./SeedDeliveryForm"
import { FormSection } from "@/admin/helpers/formSectionHelper";



interface seedSaleStep2Props {
  register: UseFormRegister<FormValues>;
  errors: FieldErrors<FormValues>;
  trigger: UseFormTrigger<FormValues>;
  watch: UseFormWatch<FormValues>;
  clearErrors: UseFormClearErrors<FormValues>;
  setValue: UseFormSetValue<FormValues>;
  controlSale: any;

  selectedCrop: CropSale | null;
  selectedCampaign: string | null;
  setStep?: (step: number) => void;
  onErrorClick?: () => void
  onCancelClick?: () => void
  onSubmit?: () => void
  isSaving?: boolean;
}

const statuses = [
  { value: "pending", label: "Pendiente" },
  { value: "completed", label: "Completado" },
  { value: "cancelled", label: "Cancelado" },
]


export const DeliveryStep2 = ({ register, errors, selectedCrop, selectedCampaign, onErrorClick, onCancelClick, controlSale, clearErrors, watch, onSubmit, isSaving }: seedSaleStep2Props) => {


  const isValidTnToDeliver = (tnToSale: number) => {
    //Si las toneladas a disponibles son mayores a las toneladas a entregar, mostrar un error
    const availableTn = getAvailableTnToDeliver();
    return (availableTn >= tnToSale)
  }

  useEffect(() => {
    if (!selectedCrop) return;

  }, [selectedCrop]);

  const getAvailableTnToDeliver = () => {
    if (!selectedCrop) return 0;

    return (selectedCrop.total_harvested_tn || 0) - (selectedCrop.total_delivered_tn || 0);
  }

  return (
    <>


      <FormSection>
        <SeedSaleTotals
          totalTnLabel1="tn Totales cosechadas"
          totalTnLabel2="tn entregadas"
          totalTn1={selectedCrop?.total_harvested_tn || 0}
          totalTn2={selectedCrop?.total_delivered_tn || 0}
          availableTn={getAvailableTnToDeliver()}
        />
      </FormSection>

      {/* {isInitialized && availableTn <= 0 && ( */}
      {getAvailableTnToDeliver() <= 0 && (
        <>

          <div className="mt-3 rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm">
            <p className="font-medium text-destructive">
              No es posible registrar una nueva entrega
            </p>
            <p className="mt-1 text-destructive/80">
              Ya se entregaron todas las toneladas cosechadas para el cultivo
              <strong> {selectedCrop?.crop_name}</strong> en la campaña
              <strong> {selectedCampaign}</strong>.
            </p>
            <p className="mt-2 text-destructive/70 text-xs">
              Podés revisar o editar entregas existentes, o seleccionar otro cultivo.
            </p>

          </div>
          <FormSection>
            <Button
              variant="outline"
              className="mt-3 w-full"
              onClick={onErrorClick}
            >
              Cambiar cultivo o campaña
            </Button>
          </FormSection>

        </>
      )}

      {
        getAvailableTnToDeliver() > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-5">
              <div>
                <Label className="text-sm mb-1.5">Carta de Porte *</Label>
                <input
                  type="text"
                  {...register("waybill_number", { required: "La carta de porte es requerida" })}
                  onChange={(e) => {
                    register("waybill_number").onChange(e);
                    clearErrors("waybill_number");
                  }}
                  className={cn("w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent", errors.waybill_number && "border-destructive")}
                  placeholder="Ej: CP-2024-001"
                />
                {errors.waybill_number && (
                  <p className="text-destructive text-xs mt-1">{errors.waybill_number.message}</p>
                )}
              </div>

              <div>
                <Label className="text-sm mb-1.5">Destino Principal *</Label>
                <input
                  type="text"
                  {...register("destination", { required: "El destino es requerido" })}
                  onChange={(e) => {
                    register("destination").onChange(e);
                    clearErrors("destination");
                  }}
                  className={cn("w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent", errors.destination && "border-destructive")}
                  placeholder="Ej: Buenos Aires"
                />
                {errors.destination && <p className="text-destructive text-xs mt-1">{errors.destination.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-3 gap-y-5 mt-3">
              <div>
                <Label className="text-sm mb-1.5">Fecha *</Label>
                <input
                  type="date"
                  {...register("delivery_date", { required: "La fecha es requerida" })}
                  className="date-standard"
                />

                {errors.delivery_date && <p className="text-destructive text-sm mt-1">{errors.delivery_date.message}</p>}
              </div>

              <div>
                <Label className="text-sm mb-1.5">Estado *</Label>
                <select
                  {...register("status", { required: "El estado es requerido" })}
                  className="w-full px-3 py-2 border rounded-md bg-background text-md"
                >
                  {statuses.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
                {errors.status && <p className="text-destructive text-sm mt-1">{errors.status.message}</p>}
              </div>

              <div>
                <Controller
                  name="tn_delivered"
                  control={controlSale}
                  rules={{
                    required: "tn totales entregadas es obligatorio",
                    min: { value: 0.01, message: "Debe ser mayor a 0" },
                  }}
                  defaultValue={100}
                  render={({ field, fieldState }) => (
                    <AmountInput
                      label="tn a Entregar *"
                      value={field.value}
                      onChange={(val) => {
                        const tn = Number(val) || 0;
                        field.onChange(tn)
                        // setTotalTn(Number(tn) || 0)
                        // setAvailableLocalTn(availableTnBase - tn);
                      }}
                      error={fieldState.error?.message}
                      locale="es-AR"
                      placeholder="0,000"
                      maxDecimals={3}
                    />
                  )}
                />
                {
                  !isValidTnToDeliver(Number(watch("tn_delivered"))) && <p className="text-destructive text-xs mt-1">Las tn a entregar no pueden exceder las disponibles</p>
                }
              </div>


            </div>

            <FormSection>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancelClick}
                  className="w-full"
                >
                  Volver
                </Button>

                <Button
                  type="button"
                  form="seed-sale-form"
                  className="w-full"
                  onClick={onSubmit}
                  disabled={isSaving}
                >
                  Crear Entrega
                </Button>
              </div>
            </FormSection>
          </>
        )
      }
    </>
  )
}
