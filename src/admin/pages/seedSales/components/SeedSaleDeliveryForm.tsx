import { Controller } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { AmountInput } from "@/components/custom/CustomAmountInput"

interface Props {
  registerDelivery: any
  controlDelivery: any
  deliveryErrors: any
  onCancel: () => void
  onSubmit?: () => void
  isEditing: boolean
  commonSubmit?: (data: any) => void
}

export function SeedSaleDeliveryForm({
  registerDelivery,
  controlDelivery,
  deliveryErrors,
  onCancel,
  onSubmit,
  isEditing
}: Props) {
  return (
    <div className="border rounded-lg p-3 md:p-4 bg-muted/30 space-y-3">
      <h4 className="font-medium text-sm">{isEditing ? "Editar Venta" : "Nueva Venta"}</h4>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Liquidacion primaria */}
        <div className="sm:col-span-2">
          <Label className="text-sm mb-1.5">Liquidación Primaria *</Label>
          <input
            type="text"
            placeholder="LP-2025-0001"
            {...registerDelivery("primary_liquidation_number", {
              required: "La liquidación primaria es requerida",
            })}
            className="w-full px-3 py-2 border rounded-md"
          />
          {deliveryErrors.primary_liquidation_number && (
            <p className="text-destructive text-xs mt-1">{deliveryErrors.primary_liquidation_number.message}</p>
          )}
        </div>

        {/* Fecha */}
        <div>
          <Label className="text-sm mb-1.5">Fecha de Venta *</Label>
          <input
            type="date"
            {...registerDelivery("delivery_date", { required: "La fecha es requerida" })}
            className="date-standard"
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

        <div>

          <Controller
            name="tn_delivered"
            control={controlDelivery}
            rules={{ required: "tn vendidas es obligatorio" }}
            render={({ field, fieldState }) => (
              <AmountInput
                label="tn a Vender *"
                value={field.value}
                onChange={field.onChange}
                error={fieldState.error?.message}
              />
            )}
          />
        </div>

        {/* Precio */}
        <div>
          <Controller
            name="price_per_tn"
            control={controlDelivery}
            rules={{ required: "Precio por tn es obligatorio" }}
            render={({ field, fieldState }) => (
              <AmountInput
                label="Precio por tn *"
                value={field.value}
                onChange={field.onChange}
                error={fieldState.error?.message}
                currency="ARS"
              />
            )}
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:justify-end gap-2 pt-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onCancel}
          className="w-full sm:w-auto"
        >
          Cancelar
        </Button>

        <Button
          type="button"
          size="sm"
          onClick={onSubmit}
          className="w-full sm:w-auto"
        >
          {isEditing ? "Actualizar" : "Agregar"}
        </Button>


      </div>
    </div>
  )
}
