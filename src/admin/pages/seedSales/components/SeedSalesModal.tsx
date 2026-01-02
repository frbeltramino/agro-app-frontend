"use client"

import { forwardRef, useState, useEffect } from "react"
import { Controller, useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import { formatNumber } from "@/lib/format-number"
import { PlusCircle } from "lucide-react"
import { SeedSale } from "@/interfaces/sales/seed.sale.interface"
import { CropSale } from "@/interfaces/crops/crop.sales.response";
import { AmountInput } from "@/components/custom/CustomAmountInput"
import { formatKg } from "@/lib/format-kg"
import { useSeedSaleForm } from "../hooks/useSeedSaleForm"
import { SeedSaleDeliveryForm } from "./SeedSaleDeliveryForm"
import { SeedSaleDeliveriesTable } from "./SeedSaleDeliveriesTable"
import { Label } from "@/components/ui/label"
import { BaseModal } from "@/admin/components/BaseModal"


interface FormValues {
  crop_name_id: number
  waybill_number: string
  destination: string
  date: string
  kg_delivered: number
  status: string
}

interface DeliveryFormValues {
  waybill_delivery_number: string | undefined | null
  delivery_date: string
  destination: string
  kg_delivered: number | undefined
  price_per_kg: number | undefined
}

interface SeedSalesModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (item: SeedSale) => void
  initialData: SeedSale | null
  crops?: CropSale[]
}

const statuses = [
  { value: "pending", label: "Pendiente" },
  { value: "completed", label: "Completado" },
  { value: "cancelled", label: "Cancelado" },
]

export const SeedSalesModal = forwardRef<HTMLDivElement, SeedSalesModalProps>(
  ({ isOpen, onClose, onSave, initialData, crops }) => {
    const [isSaving, setIsSaving] = useState(false)
    const [, setKgDeliveredDisplay] = useState("")

    const [isAddingDelivery, setIsAddingDelivery] = useState(false);

    const cropsData: CropSale[] = crops || [];

    const {
      register,
      handleSubmit,
      formState: { errors },
      reset,
      setValue,
      control: controlSale,
      watch
    } = useForm<FormValues>({
      defaultValues: {
        crop_name_id: initialData?.crop_name_id || (cropsData.length > 0 ? cropsData[0].crop_name_id : 0),
        waybill_number: initialData?.waybill_number || "",
        destination: initialData?.destination || "",
        date: initialData?.sale_date || new Date().toISOString().split("T")[0],
        kg_delivered: initialData?.kg_delivered || 0,
        status: initialData?.status || "pending",
      },
    })

    const {
      register: registerDelivery,
      handleSubmit: handleSubmitDelivery,
      formState: { errors: deliveryErrors },
      reset: resetDelivery,
      control: controlDelivery,
    } = useForm<DeliveryFormValues>({
      defaultValues: {
        waybill_delivery_number: "",
        delivery_date: new Date().toISOString().split("T")[0],
        destination: "",
        kg_delivered: undefined,
        price_per_kg: undefined,
      },
    })

    const [, setDeliveryKgDisplay] = useState("")
    const [, setDeliveryPriceDisplay] = useState("")

    const totalKgDelivered = watch("kg_delivered") || 0;
    const selectedCropNameId = watch("crop_name_id");

    const {
      createOrUpdateDeliveries,
      deliveries,
      editingDeliveryIndex,
      setDeliveries,
      setEditingDeliveryIndex
    } = useSeedSaleForm();

    const selectedCrop = crops?.find(c => c.crop_name_id === selectedCropNameId);
    const totalKgSold = selectedCrop?.total_sold_kg || 0;

    const onDeliverySubmit = (data: DeliveryFormValues) => {

      createOrUpdateDeliveries({
        data,
        deliveries,
        editingDeliveryIndex,
        initialData,
        totalKgDelivered,
        selectedCropNameId,
        totalKgSold
      });

      setIsAddingDelivery(false)
      resetDelivery({
        waybill_delivery_number: "",
        delivery_date: "",
        destination: "",
        kg_delivered: undefined,
        price_per_kg: undefined,
      })
      setDeliveryKgDisplay("")
      setDeliveryPriceDisplay("")
    }

    const handleDeleteDelivery = (index: number) => {
      const updatedDeliveries = deliveries.filter((_, deliveryIndex) => deliveryIndex !== index);
      setDeliveries(updatedDeliveries)
    }

    const handleEditDelivery = (index: number) => {
      const delivery = deliveries[index]
      setEditingDeliveryIndex(index)
      setIsAddingDelivery(true)
      setDeliveryKgDisplay(formatNumber(delivery.kg_delivered.toString()))
      setDeliveryPriceDisplay(formatNumber(delivery.price_per_kg.toString()))
      resetDelivery({
        waybill_delivery_number: delivery.waybill_number,
        delivery_date: delivery.delivery_date,
        destination: delivery.destination,
        kg_delivered: delivery.kg_delivered,
        price_per_kg: delivery.price_per_kg,
      })
    }

    const onFormSubmit = (data: FormValues) => {
      setIsSaving(true)

      if (totalKgSold > Number(data.kg_delivered)) {
        toast.error("Los kg de las entregas no pueden exceder los kg entregados totales")
        setIsSaving(false)
        return
      }

      const item: SeedSale = {
        id: initialData?.id || null,
        crop_name_id: Number(data.crop_name_id),
        waybill_number: data.waybill_number,
        sale_date: data.date,
        destination: data.destination,
        kg_delivered: Number(data.kg_delivered),
        kg_sold: totalKgSold,
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

      if (initialData) {
        setKgDeliveredDisplay(formatNumber(initialData.kg_delivered.toString()))
        setDeliveries(initialData.deliveries || []) // ✅ acá seteamos el hook
        reset({
          crop_name_id: initialData.crop_name_id || (cropsData.length > 0 ? cropsData[0].crop_name_id : 0),
          waybill_number: initialData.waybill_number,
          destination: initialData.destination,
          date: initialData.sale_date,
          kg_delivered: initialData.kg_delivered,
          status: initialData.status,
        })
      } else if (cropsData.length > 0) {
        const selectedCropDefault = cropsData.find(c => c.crop_name_id === Number(cropsData[0].crop_name_id));
        const formatted = selectedCropDefault?.total_harvested_kg.toString() || "";
        setKgDeliveredDisplay(formatted);
        reset({
          crop_name_id: cropsData[0].crop_name_id,
          waybill_number: "",
          destination: "",
          date: new Date().toISOString().split("T")[0],
          kg_delivered: Number(formatted),
          status: "pending",
        })
        setDeliveries([]) // solo al crear nueva venta
      }
    }, [initialData, reset, cropsData, isOpen, setDeliveries])

    useEffect(() => {
      if (!selectedCropNameId || !cropsData.length) return;

      const crop = cropsData.find(c => c.crop_name_id === Number(selectedCropNameId));
      if (!crop || crop.total_harvested_kg == null) return;

      const formatted = formatNumber(crop.total_harvested_kg.toString());
      setKgDeliveredDisplay(formatted);
      setValue("kg_delivered", Number(crop.total_harvested_kg), {
        shouldValidate: true,
        shouldDirty: true,
      });

      // 🔹 Solo limpiar deliveries si estamos creando nueva venta
      if (!initialData) setDeliveries([]);
    }, [selectedCropNameId, cropsData, setValue, initialData, setDeliveries])

    return (
      <BaseModal isOpen={isOpen} onClose={onClose}>
        <DialogHeader>
          <DialogTitle className="text-lg md:text-xl">{initialData ? "Editar Venta" : "Nueva Venta de Semillas"}</DialogTitle>
          <DialogDescription className="text-sm">
            {initialData
              ? "Actualiza los datos de la entrega y sus ventas"
              : "Registra una nueva entrega de semillas y sus ventas"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4 md:space-y-6">
          <div className="space-y-4">
            <h3 className="text-base md:text-lg font-semibold">Datos Generales</h3>

            <div>
              <Label className="text-sm">Cultivo *</Label>
              <select
                {...register("crop_name_id", {
                  required: "El cultivo es requerido",
                  valueAsNumber: true,
                })}
                className="mt-1.5 w-full px-3 py-2 border rounded-md bg-background text-sm"
                disabled={cropsData.length === 0}
              >
                {cropsData.map((crop) => (
                  <option key={crop.crop_name_id} value={crop.crop_name_id}>
                    {crop.crop_name}
                  </option>
                ))}
              </select>
              {cropsData.length === 0 && (
                <p className="text-sm text-muted-foreground mt-1">No hay cultivos cocechados</p>
              )}
              {errors.crop_name_id && <p className="text-destructive text-xs mt-1">{errors.crop_name_id.message}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label className="text-sm mb-1.5">Carta de Porte *</Label>
                <input
                  type="text"
                  {...register("waybill_number", { required: "La carta de porte es requerida" })}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
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
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Ej: Buenos Aires"
                />
                {errors.destination && <p className="text-destructive text-xs mt-1">{errors.destination.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <Label className="text-sm mb-1.5">Fecha *</Label>
                <input
                  type="date"
                  {...register("date", { required: "La fecha es requerida" })}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent dark:[color-scheme:dark]"
                />
                {errors.date && <p className="text-destructive text-sm mt-1">{errors.date.message}</p>}
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
                  name="kg_delivered"
                  control={controlSale}
                  rules={{
                    required: "KG totales entregados es obligatorio",
                    min: { value: 0.01, message: "Debe ser mayor a 0" },
                  }}
                  render={({ field, fieldState }) => (
                    <AmountInput
                      label="KG Entregados *"
                      value={field.value}
                      onChange={field.onChange}
                      error={fieldState.error?.message}
                      locale="es-AR"
                      placeholder="0,00"
                    />
                  )}
                />
              </div>
            </div>

            <div className="bg-muted p-3 md:p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs text-muted-foreground">KG Totales</p>
                  <p className="text-lg md:text-2xl font-bold">{formatKg(totalKgDelivered)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">KG Vendidos</p>
                  <p className="text-lg md:text-2xl font-bold text-green-600">{formatKg(totalKgSold)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">KG Disponibles</p>
                  <p className="text-lg md:text-2xl font-bold text-blue-600">
                    {formatKg((totalKgDelivered - totalKgSold))}
                  </p>
                </div>
              </div>
            </div>
          </div>

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
                  resetDelivery()
                }}
                disabled={isAddingDelivery || totalKgDelivered === 0}
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
                  resetDelivery()
                  setEditingDeliveryIndex(null)
                }}
              />

            )}

            {deliveries.length > 0 && (
              <SeedSaleDeliveriesTable
                deliveries={deliveries}
                totalKgSold={totalKgSold}
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

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSaving} className="w-full sm:w-auto">
              {isSaving ? (
                <>
                  Guardando...
                  <div className="h-4 w-4 animate-spin rounded-full border-2  border-t-transparent" />
                </>
              ) : initialData ? (
                "Actualizar"
              ) : (
                "Crear"
              )}
            </Button>
          </DialogFooter>
        </form>
      </BaseModal>
    )
  },
)

SeedSalesModal.displayName = "SeedSalesModal"