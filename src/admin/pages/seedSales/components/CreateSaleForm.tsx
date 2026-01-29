import { Controller } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { AmountInput } from "@/components/custom/CustomAmountInput"

interface Props {
  register: any
  control: any
  errors: any
  onCancel: () => void
  onSubmit?: () => void
  commonSubmit?: (data: any) => void
  isSaving?: boolean
}

export function CreateSaleForm({
  register,
  control,
  errors,
  onCancel,
  onSubmit,
  isSaving
}: Props) {

  const isEditing = false;

  return (
    <>
      <div className="border rounded-lg p-3 md:p-4 bg-muted/30 space-y-3">
        <h4 className="font-medium text-sm">{isEditing ? "Editar Venta" : "Nueva Venta"}</h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Liquidacion primaria */}
          <div className="sm:col-span-2">
            <Label className="text-sm mb-1.5">Liquidación Primaria *</Label>
            <input
              type="text"
              placeholder="LP-2025-0001"
              {...register("primary_liquidation_number", {
                required: "La liquidación primaria es requerida",
              })}
              className="w-full px-3 py-2 border rounded-md"
            />
            {errors.primary_liquidation_number && (
              <p className="text-destructive text-xs mt-1">{errors.primary_liquidation_number.message}</p>
            )}
          </div>

          {/* Fecha */}
          <div>
            <Label className="text-sm mb-1.5">Fecha de Venta *</Label>
            <input
              type="date"
              {...register("sale_date", { required: "La fecha es requerida" })}
              className="date-standard"
            />
            {errors.delivery_date && (
              <p className="text-destructive text-xs mt-1">{errors.delivery_date.message}</p>
            )}
          </div>

          {/* Destino */}
          <div>
            <Label className="text-sm mb-1.5">Destino *</Label>
            <input
              type="text"
              {...register("destination", { required: "El destino es requerido" })}
              className="w-full px-3 py-2 border rounded-md"
            />
            {errors.destination && (
              <p className="text-destructive text-xs mt-1">{errors.destination.message}</p>
            )}
          </div>

          <div>

            <Controller
              name="tn_sold"
              control={control}
              rules={{ required: "tn vendidas es obligatorio" }}
              render={({ field, fieldState }) => (
                <AmountInput
                  label="tn a Vender *"
                  value={field.value}
                  maxDecimals={3}
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
              control={control}
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


      </div>
      <div className="w-full flex gap-2 pt-2">
        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={onCancel}
          className="w-1/2"
        >
          Cancelar
        </Button>

        <Button
          type="button"
          size="lg"
          onClick={onSubmit}
          className="w-1/2"
          disabled={isSaving}
        >
          {isEditing ? "Actualizar Venta" : "Crear Venta"}
        </Button>
      </div>
    </>
  )
}
