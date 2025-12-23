"use client"

import { forwardRef, useState, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useSupplyCategories } from "@/admin/hooks/useSupplyCategories";
import { Stock } from "@/interfaces/stock/stock.interface";
import { UNITS } from "@/constants/units";
import { CustomSelectWithCreate } from "@/components/custom/CustomSelectWithCreate";
import { toast } from "sonner";
import { formatNumber } from "@/lib/format-number";
import { AmountInput } from "@/components/custom/CustomAmountInput";


interface FormValues {
  name: string
  category_id: number
  unit: string
  quantity_available: number | undefined
  price_per_unit: number | undefined
  expiration_date: string
  status: string
}

interface StockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: Stock) => void;
  initialData: Stock | null;
}


export const StockModal = forwardRef<HTMLDivElement, StockModalProps>(
  ({ isOpen, onClose, onSave, initialData }, ref) => {
    const [isSaving, setIsSaving] = useState(false)
    const { data: categoriesData, createCategory } = useSupplyCategories();
    const categories = categoriesData?.categories || [];
    const [, setQuantityDisplay] = useState("");



    const {
      register,
      handleSubmit,
      formState: { errors },
      reset,
      watch,
      control
    } = useForm<FormValues>({
      defaultValues: {
        name: initialData?.name || "",
        category_id: initialData?.category_id || 0,
        unit: initialData?.unit || "lt",
        quantity_available: initialData?.quantity_available || undefined,
        price_per_unit: initialData?.price_per_unit || undefined,
        expiration_date: initialData?.expiration_date || "",
        status: "active",
      },
    });

    useEffect(() => {
      if (initialData) {
        reset({
          name: initialData.name,
          category_id: initialData.category_id,
          unit: initialData.unit,
          quantity_available: initialData.quantity_available ?? undefined,
          price_per_unit: initialData.price_per_unit ?? undefined,
          expiration_date: initialData.expiration_date,
          status: initialData.status,

        });
        setQuantityDisplay(formatNumber(initialData.quantity_available.toString()));
      } else {
        reset({
          name: "",
          category_id: 0,
          unit: "lt",
          quantity_available: undefined,
          price_per_unit: undefined,
          expiration_date: "",
          status: "active",
        });
        setQuantityDisplay("");
      }
    }, [initialData, reset]);

    const onFormSubmit = async (data: FormValues) => {
      setIsSaving(true)
      try {
        const item: Stock = {
          id: initialData?.id || null,
          name: data.name,
          category_id: data.category_id,
          unit: data.unit,
          quantity_available: Number(data.quantity_available),
          price_per_unit: Number(data.price_per_unit),
          expiration_date: data.expiration_date,
          status: data.status
        }
        onSave(item)
        reset()
        onClose()
      } catch (err) {
        console.error("Error al guardar el suministro:", err)
        toast.error("Error al guardar el suministro")
      } finally {
        setIsSaving(false)
      }
    }

    const unitValue = watch("unit");

    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent ref={ref} className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{initialData ? "Editar Suministro" : "Nuevo Suministro"}</DialogTitle>
            <DialogDescription>
              {initialData ? "Actualiza los datos del suministro" : "Agrega un nuevo suministro a tu inventario"}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Nombre del Suministro *</label>
              <input
                type="text"
                {...register("name", { required: "El nombre del suministro es requerido" })}
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Ej: Funguicida Tebuconazole"
              />
              {errors.name && <p className="text-destructive text-sm mt-1">{errors.name.message}</p>}
            </div>


            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">

                <CustomSelectWithCreate
                  label="Categoría"
                  name="category_id"
                  options={categories || []}
                  register={register}
                  errors={"error en categoria"}
                  onCreate={async (name: string) => {
                    await createCategory(name);
                  }}
                  mb="0"
                  selectHeight="h-10"
                  placeholder="Nueva categoría"
                />
              </div>


              <div>
                <label className="block text-sm font-medium mb-1 mt-1">Unidad *</label>
                <select
                  {...register("unit", { required: "La unidad es requerida" })}
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
                  <option value="" className="bg-background text-foreground">
                    Selecciona una unidad
                  </option>
                  {UNITS.map((unit) => (
                    <option
                      key={unit.value}
                      value={unit.value}
                      className="bg-background text-foreground"
                    >
                      {unit.label}
                    </option>
                  ))}
                </select>
              </div>

            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Controller
                  control={control}
                  name="quantity_available"
                  defaultValue={initialData?.quantity_available ?? undefined}
                  rules={{
                    required: "La cantidad es requerida",
                    min: { value: 0, message: "La cantidad debe ser positiva" },
                  }}
                  render={({ field, fieldState }) => (
                    <AmountInput
                      label={`Cantidad Disponible (${unitValue}) *`}
                      value={field.value}
                      onChange={field.onChange}
                      error={fieldState.error?.message}
                      locale="es-AR"
                      placeholder="0"
                    />
                  )}
                />
              </div>


              <div className="space-y-2">
                <Controller
                  name="price_per_unit"
                  control={control}
                  defaultValue={undefined}
                  rules={{
                    required: "El precio es requerido",
                    min: { value: 0, message: "El precio debe ser positivo" },
                  }}
                  render={({ field, fieldState }) => (
                    <AmountInput
                      label="Precio por Unidad *"
                      value={field.value}
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

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium mb-2">Fecha de Vencimiento *</label>
                <input
                  type="date"
                  {...register("expiration_date", { required: "La fecha de vencimiento es requerida" })}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent dark:[color-scheme:dark]"
                />
                {errors.expiration_date && (
                  <p className="text-destructive text-sm mt-1">{errors.expiration_date.message}</p>
                )}
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isSaving}
                className="flex items-center gap-2"
              >
                {isSaving ? (
                  <>
                    Guardando...
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-accent border-t-transparent" />
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
    );
  },
)

StockModal.displayName = "StockModal"
