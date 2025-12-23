"use client"

import { forwardRef, useState, useEffect } from "react"
import { Controller, useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import { formatNumber } from "@/lib/format-number"
import { PlusCircle, Trash2, Edit2 } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { SeedSale } from "@/interfaces/sales/seed.sale.interface"
import { Crop } from "@/interfaces/crops/crop.sales.response";
import { AmountInput } from "@/components/custom/CustomAmountInput"
import { currencyFormatter } from "@/lib/currency-formatter"
import { formatKg } from "@/lib/format-kg"
import { useSeedSale } from "../hooks/useSeedSale"

interface FormValues {
  crop_id: number
  waybill_number: string
  destination: string
  date: string
  kg_delivered: number
  status: string
}

interface DeliveryFormValues {
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
  crops?: Crop[]
}

const statuses = [
  { value: "pending", label: "Pendiente" },
  { value: "completed", label: "Completado" },
  { value: "cancelled", label: "Cancelado" },
]

export const SeedSalesModal = forwardRef<HTMLDivElement, SeedSalesModalProps>(
  ({ isOpen, onClose, onSave, initialData, crops = [] }, ref) => {
    const [isSaving, setIsSaving] = useState(false)
    const [, setKgDeliveredDisplay] = useState("")

    const [isAddingDelivery, setIsAddingDelivery] = useState(false)



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
        crop_id: initialData?.crop_id || (crops.length > 0 ? crops[0].id : 0),
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
        delivery_date: new Date().toISOString().split("T")[0],
        destination: "",
        kg_delivered: undefined,
        price_per_kg: undefined,
      },
    })

    const [, setDeliveryKgDisplay] = useState("")
    const [, setDeliveryPriceDisplay] = useState("")

    const totalKgDelivered = watch("kg_delivered") || 0;
    const selectedCropId = watch("crop_id");




    const {
      createOrUpdateDeliveries,
      deliveries,
      editingDeliveryIndex,
      setDeliveries,
      setEditingDeliveryIndex
    } = useSeedSale();

    const totalKgSold = deliveries.reduce((sum, d) => sum + d.kg_delivered, 0);



    const onDeliverySubmit = (data: DeliveryFormValues) => {

      createOrUpdateDeliveries({
        data,
        deliveries,
        editingDeliveryIndex,
        initialData,
        totalKgDelivered,
        selectedCropId,
        totalKgSold
      });

      setIsAddingDelivery(false)
      resetDelivery({
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
        crop_id: Number(data.crop_id),
        waybill_number: data.waybill_number,
        sale_date: data.date,
        destination: data.destination,
        kg_delivered: Number(data.kg_delivered),
        kg_sold: totalKgSold,
        status: data.status,
        deliveries: deliveries,
        deleted_at: null,
      }
      console.log(item);
      onSave(item)
      reset()
      setDeliveries([])
      onClose()
      setIsSaving(false)
    }

    useEffect(() => {
      if (initialData) {
        setKgDeliveredDisplay(formatNumber(initialData.kg_delivered.toString()))
        setDeliveries(initialData.deliveries || [])
        reset({
          crop_id: initialData.crop_id || (crops.length > 0 ? crops[0].id : 0),
          waybill_number: initialData.waybill_number,
          destination: initialData.destination,
          date: initialData.sale_date,
          kg_delivered: initialData.kg_delivered,
          status: initialData.status,
        })
      } else {
        // si hay se leccionado un cultivo deben figurar los kg dispobibles para entregar de ese cultivo
        const selectedCropDefault = crops.find(c => c.id === Number(crops[0].id));
        const formatted = selectedCropDefault?.real_yield.toString() || "";
        setKgDeliveredDisplay(formatted);
        reset({
          crop_id: crops.length > 0 ? crops[0].id : 0,
          waybill_number: "",
          destination: "",
          date: new Date().toISOString().split("T")[0],
          kg_delivered: Number(formatted),
          status: "pending",
        })
        setDeliveries([])

      }
    }, [initialData, reset, crops, isOpen])

    useEffect(() => {
      if (!selectedCropId || !crops.length) return;

      const crop = crops.find(c => c.id === Number(selectedCropId));
      if (!crop || crop.real_yield == null) return;

      const formatted = formatNumber(crop.real_yield.toString());

      setKgDeliveredDisplay(formatted);
      setValue("kg_delivered", Number(crop.real_yield), {
        shouldValidate: true,
        shouldDirty: true,
      });

      setDeliveries([]);
    }, [selectedCropId, crops, reset]);

    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent ref={ref} className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{initialData ? "Editar Venta" : "Nueva Venta de Semillas"}</DialogTitle>
            <DialogDescription>
              {initialData
                ? "Actualiza los datos de la entrega y sus ventas"
                : "Registra una nueva entrega de semillas y sus ventas"}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Datos Generales</h3>

              <div>
                <label className="block text-sm font-medium mb-2">Cultivo *</label>
                <select
                  {...register("crop_id", {
                    required: "El cultivo es requerido",
                    valueAsNumber: true,
                  })}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                  disabled={crops.length === 0}
                >
                  {crops.map((crop) => (
                    <option key={crop.id} value={crop.id}>
                      {crop.crop_name} - {crop.campaign_name}
                    </option>
                  ))}
                </select>
                {crops.length === 0 && (
                  <p className="text-sm text-muted-foreground mt-1">No hay cultivos cocechados</p>
                )}
                {errors.crop_id && <p className="text-destructive text-sm mt-1">{errors.crop_id.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Carta de Porte *</label>
                  <input
                    type="text"
                    {...register("waybill_number", { required: "La carta de porte es requerida" })}
                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Ej: CP-2024-001"
                  />
                  {errors.waybill_number && (
                    <p className="text-destructive text-sm mt-1">{errors.waybill_number.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Destino Principal *</label>
                  <input
                    type="text"
                    {...register("destination", { required: "El destino es requerido" })}
                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Ej: Buenos Aires"
                  />
                  {errors.destination && <p className="text-destructive text-sm mt-1">{errors.destination.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Fecha *</label>
                  <input
                    type="date"
                    {...register("date", { required: "La fecha es requerida" })}
                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  {errors.date && <p className="text-destructive text-sm mt-1">{errors.date.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Estado *</label>
                  <select
                    {...register("status", { required: "El estado es requerido" })}
                    className="
                      w-full
                      px-3
                      py-2
                      border
                      rounded-md
                      bg-background
                      text-foreground
                      border-input
                      shadow-sm
                      transition-colors

                      focus:outline-none
                      focus:ring-2
                      focus:ring-ring
                      focus:border-ring

                      disabled:cursor-not-allowed
                      disabled:opacity-50
  "

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
                        label="KG Totales Entregados *"
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

              <div className="bg-muted p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-muted-foreground">KG Totales</p>
                    <p className="text-2xl font-bold">{formatKg(totalKgDelivered)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">KG Vendidos</p>
                    <p className="text-2xl font-bold text-green-600">{formatKg(totalKgSold)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">KG Disponibles</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {formatKg((totalKgDelivered - totalKgSold))}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Ventas</h3>
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
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Agregar Venta
                </Button>
              </div>

              {isAddingDelivery && (

                <div className="border rounded-lg p-4 bg-muted/50">
                  <h4 className="font-medium mb-3">
                    {editingDeliveryIndex !== null ? "Editar Venta" : "Nueva Venta"}
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Fecha de Venta *</label>
                      <input
                        type="date"
                        {...registerDelivery("delivery_date", { required: "La fecha es requerida" })}
                        className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                      {deliveryErrors.delivery_date && (
                        <p className="text-destructive text-sm mt-1">{deliveryErrors.delivery_date.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Destino *</label>
                      <input
                        type="text"
                        {...registerDelivery("destination", { required: "El destino es requerido" })}
                        className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="Cliente o destino"
                      />
                      {deliveryErrors.destination && (
                        <p className="text-destructive text-sm mt-1">{deliveryErrors.destination.message}</p>
                      )}
                    </div>

                    <div>


                      <Controller
                        name="kg_delivered"
                        control={controlDelivery}
                        rules={{
                          required: "KG vendidos es obligatorio",
                          min: { value: 0.01, message: "Debe ser mayor a 0" },
                        }}
                        render={({ field, fieldState }) => (
                          <AmountInput
                            label="KG Vendidos *"
                            value={field.value != null ? Number(field.value) : undefined}
                            onChange={field.onChange}
                            error={fieldState.error?.message}
                            locale="es-AR"
                            placeholder="0,00"
                          />
                        )}
                      />

                    </div>

                    <div>

                      <Controller
                        name="price_per_kg"
                        control={controlDelivery}
                        rules={{ required: "Precio por KG es obligatorio" }}
                        render={({ field, fieldState }) => (
                          <AmountInput
                            label="Precio por KG *"
                            value={field.value != null ? Number(field.value) : undefined}
                            onChange={field.onChange}
                            error={fieldState.error?.message}
                            currency="ARS"
                            locale="es-AR"
                            placeholder="0,00"
                          />
                        )}
                      />

                    </div>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setIsAddingDelivery(false)
                        resetDelivery({
                          delivery_date: "",
                          destination: "",
                          kg_delivered: undefined,
                          price_per_kg: undefined,
                        })
                        setDeliveryKgDisplay("")
                        setDeliveryPriceDisplay("")
                        setEditingDeliveryIndex(null)
                      }}
                    >
                      Cancelar
                    </Button>
                    <Button type="button" size="sm" onClick={handleSubmitDelivery(onDeliverySubmit)}>
                      {editingDeliveryIndex !== null ? "Actualizar" : "Agregar"}
                    </Button>
                  </div>
                </div>


              )}

              {deliveries.length > 0 && (
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Destino</TableHead>
                        <TableHead className="text-right">KG</TableHead>
                        <TableHead className="text-right">Precio/KG</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {deliveries.map((delivery, index) => (
                        <TableRow key={index}>
                          <TableCell>{new Date(delivery.delivery_date).toLocaleDateString()}</TableCell>
                          <TableCell>{delivery.destination}</TableCell>
                          <TableCell className="text-right">{formatKg(delivery.kg_delivered)}</TableCell>
                          <TableCell className="text-right">
                            {currencyFormatter(delivery.price_per_kg)}
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {currencyFormatter((delivery.kg_delivered * delivery.price_per_kg))}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex gap-1 justify-end">
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditDelivery(index)}
                                disabled={isAddingDelivery}
                              >
                                <Edit2 className="w-4 h-4" />
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteDelivery(index)}
                                disabled={isAddingDelivery}
                              >
                                <Trash2 className="w-4 h-4 text-destructive" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow className="bg-muted/50 font-semibold">
                        <TableCell colSpan={2}>Total</TableCell>
                        <TableCell className="text-right">{formatKg(totalKgSold)} kg</TableCell>
                        <TableCell></TableCell>
                        <TableCell className="text-right">
                          {currencyFormatter(
                            deliveries.reduce((sum, d) => sum + d.kg_delivered * d.price_per_kg, 0)
                          )}
                        </TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              )}

              {deliveries.length === 0 && !isAddingDelivery && (
                <div className="text-center py-8 text-muted-foreground border rounded-lg border-dashed">
                  <p>No hay ventas registradas</p>
                  <p className="text-sm">Haz clic en "Agregar Venta" para comenzar</p>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isSaving} className="flex items-center gap-2">
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
        </DialogContent>
      </Dialog>
    )
  },
)

SeedSalesModal.displayName = "SeedSalesModal"