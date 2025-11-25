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
import { UNITS } from "@/constants/units";
import { parseAmount } from "@/lib/parse-amount"

interface FormValues {
  crop_id: number | string
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
    const [formatedAmount, setFormatedAmount] = useState("0,00");
    const { createCategory } = useSupplyCategories();
    const { selectedCrop } = useCropStore();
    const { createSupply } = useSupply({ cropId: selectedCrop?.id || 0 });
    const [isSaving, setIsSaving] = useState(false);
    const {
      register,
      handleSubmit,
      formState: { errors },
      reset,
      watch,
    } = useForm<FormValues>({
      defaultValues: {
        crop_id: cropId,
        name: "",
        category_id: "",
        unit: "lt",
        dose_per_ha: 0,
        hectares: 0,
        price_per_unit: 0,
        status: "active",
      },
    })

    const selectedUnit = watch("unit")

    const onFormSubmit = async (data: FormValues) => {
      console.log(data);
      setIsSaving(true); // loading ON
      try {
        await createSupply.mutateAsync({
          crop_id: selectedCrop!.id,
          name: data.name ?? "",
          category_id: Number(data.category_id),
          unit: data.unit ?? "kg",
          dose_per_ha: Number(data.dose_per_ha),
          hectares: Number(data.hectares),
          price_per_unit: parseAmount(data.price_per_unit),
          status: "active",
        });
        toast.success("El suministro ha sido creado exitosamente");
      } catch (err) {
        console.error("Error al crear la tarea:", err);

      } finally {
        setIsSaving(false); // loading OFF SIEMPRE
        reset();
        setFormatedAmount("0,00");
        onOpenChange(false)
      }


    }

    const formatAmount = (amount: number) => {
      setFormatedAmount(
        currencyFormatter(amount)
      );
    };

    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent ref={ref} className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Nuevo Suministro</DialogTitle>
            <DialogDescription>Carga un nuevo suministro para el cultivo</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
            {/* Nombre del Suministro */}
            <div>
              <label className="block text-sm font-medium mb-2">Nombre del Suministro *</label>
              <input
                type="text"
                {...register("name", { required: "El nombre del suministro es requerido" })}
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Ej: Fertilizante ZZ44"
              />
              {errors.name && <p className="text-destructive text-sm mt-1">{errors.name.message}</p>}
            </div>

            <div>

              <CustomSelectWithCreate
                label="Categoría"
                name="category_id"
                options={categories || []}
                register={register}
                errors={errors}
                onCreate={async (name: string) => {
                  await createCategory(name);
                  // opcional: actualizar estado local si lo necesitas
                }}
              />
            </div>

            {/* Unidad y Precio por Unidad */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Unidad *</label>
                <select
                  {...register("unit", { required: "La unidad es requerida" })}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  {
                    UNITS.map((u) => (
                      <option key={u.value} value={u.value}>
                        {u.label}
                      </option>
                    ))
                  }
                </select>
                {errors.unit && <p className="text-destructive text-sm mt-1">{errors.unit.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Precio por Unidad *</label>
                <input
                  type="number"
                  step="0.01"
                  {...register("price_per_unit", {
                    required: "El precio es requerido",
                    min: { value: 0, message: "El precio debe ser positivo" },
                  })}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="0.00"
                  onChange={(e) => { formatAmount(Number(e.target.value)) }}
                />
                <p className="text-muted-foreground text-xs">{formatedAmount}</p>
                {errors.price_per_unit && (
                  <p className="text-destructive text-sm mt-1">{errors.price_per_unit.message}</p>
                )}
              </div>
            </div>

            {/* Dosis por Hectárea y Hectáreas */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Dosis por Hectárea ({selectedUnit}) *</label>
                <input
                  type="number"
                  step="0.01"
                  {...register("dose_per_ha", {
                    required: "La dosis es requerida",
                    min: { value: 0, message: "La dosis debe ser positiva" },
                  })}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="0.00"
                />
                {errors.dose_per_ha && <p className="text-destructive text-sm mt-1">{errors.dose_per_ha.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Hectáreas *</label>
                <input
                  type="number"
                  step="0.01"
                  {...register("hectares", {
                    required: "La cantidad de hectáreas es requerida",
                    min: { value: 0, message: "Las hectáreas deben ser positivas" },
                  })}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="0.00"
                />
                {errors.hectares && <p className="text-destructive text-sm mt-1">{errors.hectares.message}</p>}
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isSaving} className="flex items-center gap-2">
                {isSaving ? (
                  <>
                    Guardando...
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                  </>
                ) : (
                  "Guardar"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    )
  },
)

SupplyForm.displayName = "SupplyForm"
