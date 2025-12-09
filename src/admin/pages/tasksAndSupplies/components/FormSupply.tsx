"use client"

import { forwardRef, useState } from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Category } from "@/interfaces/cropSupplies/supply.category.interface"
import { currencyFormatter } from "@/lib/currency-formatter"
import { CustomSelectWithCreate } from "@/components/custom/CustomSelectWithCreate"
import { useSupplyCategories } from "@/admin/hooks/useSupplyCategories"
import { useCropStore } from "@/admin/store/crop.store"
import { useSupply } from "@/admin/hooks/useSupply"
import { toast } from "sonner"
import { UNITS } from "@/constants/units"
import { parseAmount } from "@/lib/parse-amount"
import { useStock } from "@/admin/hooks/useStock"

interface FormValues {
  crop_id: number | string
  supplyType: "stock" | "purchase"
  stockId?: string
  name: string
  category_id: string
  unit: "lt" | "kg" | "g" | "ml"
  dose_per_ha: number
  hectares: number
  price_per_unit: number
  status: "active" | "inactive"
}

interface SupplyFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  cropId: number | string
  categories?: Category[]
}

export const SupplyForm = forwardRef<HTMLDivElement, SupplyFormProps>(
  ({ open, onOpenChange, cropId, categories = [] }, ref) => {
    const [formatedAmount, setFormatedAmount] = useState("0,00")
    const { createCategory } = useSupplyCategories()
    const { selectedCrop } = useCropStore()
    const { createSupply } = useSupply({
      cropId: selectedCrop?.id || 0,
    })

    const { data: stockData, createCropStock, adjustStock } = useStock();
    const stockSupplies = stockData?.stock || [];

    const [isSaving, setIsSaving] = useState(false)

    const {
      register,
      handleSubmit,
      formState: { errors },
      reset,
      watch,
    } = useForm<FormValues>({
      defaultValues: {
        crop_id: cropId,
        supplyType: "purchase",
        name: "",
        category_id: "",
        unit: "lt",
        dose_per_ha: 0,
        hectares: 0,
        price_per_unit: 0,
        status: "active",
      },
    })

    const supplyType = watch("supplyType")
    const selectedUnit = watch("unit")
    const stockId = watch("stockId");

    const stockSelected = stockSupplies.find(s => s.id?.toString() === stockId);

    const selectedDoseUnit =
      supplyType === "stock"
        ? stockSelected?.unit ?? ""
        : selectedUnit;

    const onFormSubmit = async (data: FormValues) => {
      setIsSaving(true)

      try {
        // ⭐ CASO A — SUMINISTRO DESDE STOCK
        if (data.supplyType === "stock") {

          if (!data.stockId) {
            toast.error("Debes seleccionar un suministro de stock")
            return
          }

          const stockSelected = stockSupplies.find(
            s => s.id?.toString() === data.stockId
          );

          const totalQuantity = data.dose_per_ha * data.hectares;

          // 1️⃣ Crear registro crop_stock
          await createCropStock.mutateAsync({
            crop_id: selectedCrop!.id,
            stock_id: Number(data.stockId),
            used_quantity: Number(totalQuantity),
            note: "Suministro agregado desde el stock",
            category_id: stockSelected?.category_id,
            unit: stockSelected?.unit,
            price_per_unit: stockSelected?.price_per_unit,
            dose_per_ha: Number(data.dose_per_ha),
            hectares: Number(data.hectares),
            status: "active"
          });

          // 2️⃣ Recién aquí restar del stock
          const quantityToSubtract = -1 * Number(totalQuantity);

          await adjustStock.mutateAsync({
            stockId: Number(data.stockId),
            quantity: quantityToSubtract,
          });

          // 3️⃣ Si ambos salieron ok → success
          toast.success("Suministro agregado desde el stock y stock actualizado")
        }

        // ⭐ CASO B — NUEVO SUMINISTRO
        if (data.supplyType === "purchase") {
          await createSupply.mutateAsync({
            crop_id: selectedCrop!.id,
            name: data.name ?? "",
            category_id: Number(data.category_id),
            unit: data.unit ?? "kg",
            dose_per_ha: Number(data.dose_per_ha),
            hectares: Number(data.hectares),
            price_per_unit: parseAmount(data.price_per_unit),
            status: "active",
          })

          toast.success("El suministro ha sido creado exitosamente")
        }

      } catch (err) {
        console.error("Error al crear suministro:", err)
        toast.error("No se pudo registrar el uso o actualizar el stock")
      } finally {
        setIsSaving(false)
        reset()
        setFormatedAmount("0,00")
        onOpenChange(false)
      }
    }


    const formatAmount = (amount: number) => {
      setFormatedAmount(currencyFormatter(amount))
    }

    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent ref={ref} className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Nuevo Suministro</DialogTitle>
            <DialogDescription>
              Carga un nuevo suministro para el cultivo
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">

            <div>
              <label className="block text-sm font-medium mb-2">
                Tipo de Suministro *
              </label>
              <select
                {...register("supplyType")}
                className="w-full px-3 py-2 border rounded-md focus:ring-2 text-sm"
              >
                <option value="stock">De Stock</option>
                <option value="purchase">Nuevo para este cultivo</option>
              </select>
            </div>


            {supplyType === "stock" && (
              <div>
                <label className="block text-sm font-medium mb-2">
                  Seleccionar Suministro de Stock *
                </label>

                <select
                  {...register("stockId", {
                    required: "Selecciona un suministro de stock",
                  })}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 text-sm"
                >
                  <option value="">Selecciona un suministro</option>
                  {stockSupplies?.map((s) => (
                    <option key={s.id} value={s.id?.toString()}>
                      {s.name} — ({s.quantity_available} {s.unit} disponibles)
                    </option>
                  ))}
                </select>

                {errors.stockId && (
                  <p className="text-destructive text-sm mt-1">
                    {errors.stockId.message}
                  </p>
                )}
              </div>
            )}
            {supplyType === "purchase" && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Nombre del Suministro *
                  </label>
                  <input
                    type="text"
                    {...register("name", {
                      required: "El nombre del suministro es requerido",
                    })}
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="Ej: Fertilizante ZZ44"
                  />
                  {errors.name && (
                    <p className="text-destructive text-sm mt-1">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <CustomSelectWithCreate
                  label="Categoría"
                  name="category_id"
                  options={categories || []}
                  register={register}
                  errors={errors}
                  onCreate={async (name: string) => {
                    await createCategory(name)
                  }}
                />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Unidad *
                    </label>
                    <select
                      {...register("unit", {
                        required: "La unidad es requerida",
                      })}
                      className="w-full px-3 py-2 border rounded-md"
                    >
                      {UNITS.map((u) => (
                        <option key={u.value} value={u.value}>
                          {u.label}
                        </option>
                      ))}
                    </select>
                    {errors.unit && (
                      <p className="text-destructive text-sm mt-1">
                        {errors.unit.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Precio por Unidad *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      {...register("price_per_unit", {
                        required: "El precio es requerido",
                        min: { value: 0, message: "Debe ser positivo" },
                      })}
                      className="w-full px-3 py-2 border rounded-md"
                      placeholder="0.00"
                      onChange={(e) => formatAmount(Number(e.target.value))}
                    />
                    <p className="text-muted-foreground text-xs">
                      {formatedAmount}
                    </p>
                    {errors.price_per_unit && (
                      <p className="text-destructive text-sm mt-1">
                        {errors.price_per_unit.message}
                      </p>
                    )}
                  </div>
                </div>


              </>
            )}
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Dosis por Hectárea ({selectedDoseUnit}) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    {...register("dose_per_ha", {
                      required: "La dosis es requerida",
                      min: { value: 0, message: "Debe ser positivo" },
                    })}
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="0.00"
                  />
                  {errors.dose_per_ha && (
                    <p className="text-destructive text-sm mt-1">
                      {errors.dose_per_ha.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Hectáreas *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    {...register("hectares", {
                      required: "Las hectáreas son requeridas",
                      min: { value: 0, message: "Debe ser positivo" },
                    })}
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="0.00"
                  />
                  {errors.hectares && (
                    <p className="text-destructive text-sm mt-1">
                      {errors.hectares.message}
                    </p>
                  )}
                </div>
              </div>
            </>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? "Guardando..." : "Guardar"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    )
  }
)

SupplyForm.displayName = "SupplyForm"
