import { Controller } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { AmountInput } from "@/components/custom/CustomAmountInput"

interface Props {
  registerDelivery: any
  controlDelivery: any
  deliveryErrors: any
  onCancel: () => void
  onSubmit: () => void
  isEditing: boolean
}

export function SeedSaleDeliveryForm({
  registerDelivery,
  controlDelivery,
  deliveryErrors,
  onCancel,
  onSubmit,
  isEditing,
}: Props) {
  return (
    <div className="border rounded-lg p-3 md:p-4 bg-muted/30 space-y-3">
      <h4 className="font-medium text-sm">{isEditing ? "Editar Venta" : "Nueva Venta"}</h4>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Carta de Porte */}
        <div className="sm:col-span-2">
          <Label className="text-sm">Carta de Porte *</Label>
          <input
            type="text"
            placeholder="CP-2025"
            {...registerDelivery("waybill_delivery_number", {
              required: "La carta de porte es requerida",
            })}
            className="w-full px-3 py-2 border rounded-md"
          />
          {deliveryErrors.waybill_delivery_number && (
            <p className="text-destructive text-xs mt-1">{deliveryErrors.waybill_delivery_number.message}</p>
          )}
        </div>

        {/* Fecha */}
        <div>
          <Label className="text-sm mb-1.5">Fecha de Venta *</Label>
          <input
            type="date"
            {...registerDelivery("delivery_date", { required: "La fecha es requerida" })}
            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent dark:[color-scheme:dark]"
          />
          {deliveryErrors.delivery_date && (
            <p className="text-destructive text-xs mt-1">{deliveryErrors.delivery_date.message}</p>
          )}
        </div>

        {/* Destino */}
        <div>
          <Label className="text-sm mb-1.5">Destino *</Label>
          <input
            type="text"
            {...registerDelivery("destination", { required: "El destino es requerido" })}
            className="w-full px-3 py-2 border rounded-md"
          />
          {deliveryErrors.destination && (
            <p className="text-destructive text-xs mt-1">{deliveryErrors.destination.message}</p>
          )}
        </div>

        {/* KG */}
        <div>

          <Controller
            name="kg_delivered"
            control={controlDelivery}
            rules={{ required: "KG vendidos es obligatorio" }}
            render={({ field, fieldState }) => (
              <AmountInput
                label="KG Vendidos *"
                value={field.value}
                onChange={field.onChange}
                error={fieldState.error?.message}
              />
            )}
          />
          {deliveryErrors.kg_delivered && (
            <p className="text-destructive text-xs mt-1">{deliveryErrors.kg_delivered.message}</p>
          )}
        </div>

        {/* Precio */}
        <div>
          <Controller
            name="price_per_kg"
            control={controlDelivery}
            rules={{ required: "Precio por KG es obligatorio" }}
            render={({ field, fieldState }) => (
              <AmountInput
                label="Precio por KG *"
                value={field.value}
                onChange={field.onChange}
                error={fieldState.error?.message}
                currency="ARS"
              />
            )}
          />
          {deliveryErrors.price_per_kg && (
            <p className="text-destructive text-xs mt-1">{deliveryErrors.price_per_kg.message}</p>
          )}
        </div>
      </div>

      <div className="flex gap-2 pt-2">
        <Button type="button" variant="outline" size="sm" onClick={onCancel} className="flex-1 sm:flex-none">
          Cancelar
        </Button>
        <Button type="button" size="sm" onClick={onSubmit} className="flex-1 sm:flex-none">
          {isEditing ? "Actualizar" : "Agregar"}
        </Button>
      </div>
    </div>
  )
}
