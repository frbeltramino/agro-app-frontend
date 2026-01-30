"use client"

import { forwardRef, useState, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";


import { useSupplyCategories } from "@/admin/hooks/useSupplyCategories";
import { Stock } from "@/interfaces/stock/stock.interface";
import { toast } from "sonner";
import { formatNumber } from "@/lib/format-number";
import { AmountInput } from "@/components/custom/CustomAmountInput";
import { MasterSupplySelect } from "../../tasksAndSupplies/components/MasterSupplySelect";
import { SidePanel } from "@/admin/components/SidePanel";


interface FormValues {
  productName: string
  categoryId: number
  unit: string
  quantity_available: number | undefined
  price_per_unit: number | undefined
  expiration_date: string
  status: string
  master_supply_id: number | undefined
}

interface StockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: Stock) => void;
  initialData: Stock | null;
}


export const StockModal = forwardRef<HTMLDivElement, StockModalProps>(
  ({ isOpen, onClose, onSave, initialData }) => {
    const [isSaving, setIsSaving] = useState(false)
    const { data: categoriesData } = useSupplyCategories();
    const categories = categoriesData?.categories || [];
    const [, setQuantityDisplay] = useState("");



    const {
      register,
      handleSubmit,
      formState: { errors },
      reset,
      watch,
      control,
      setValue
    } = useForm<FormValues>({
      defaultValues: {
        productName: initialData?.name || "",
        categoryId: initialData?.category_id || 0,
        unit: initialData?.unit || "lt",
        master_supply_id: initialData?.master_supply_id || undefined,
        quantity_available: initialData?.quantity_available || undefined,
        price_per_unit: initialData?.price_per_unit || undefined,
        expiration_date: initialData?.expiration_date || "",
        status: "active",
      },
    });

    useEffect(() => {
      if (initialData) {
        reset({
          productName: initialData.name,
          categoryId: initialData.category_id,
          unit: initialData.unit,
          quantity_available: initialData.quantity_available ?? undefined,
          master_supply_id: initialData.master_supply_id ?? undefined,
          price_per_unit: initialData.price_per_unit ?? undefined,
          expiration_date: initialData.expiration_date,
          status: initialData.status,

        });
        setQuantityDisplay(formatNumber(initialData.quantity_available.toString()));
      } else {
        reset({
          productName: "",
          categoryId: 0,
          unit: "lt",
          master_supply_id: undefined,
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
          name: data.productName,
          category_id: data.categoryId,
          unit: data.unit,
          master_supply_id: data.master_supply_id,
          quantity_available: Number(data.quantity_available),
          price_per_unit: Number(data.price_per_unit),
          expiration_date: data.expiration_date,
          status: data.status
        }
        onSave(item)
        reset()
        onClose()
      } catch (err) {
        console.error("Error al guardar el insumo:", err)
        toast.error("Error al guardar el insumo")
      } finally {
        setIsSaving(false)
      }
    }

    const unitValue = watch("unit");

    return (
      <SidePanel
        isOpen={isOpen}
        onClose={onClose}
        title={initialData ? "Editar Insumo" : "Nuevo Insumo"}
      >

        <div className="border-b pb-4">
          <p>
            {initialData ? "Actualiza los datos del insumo" : "Agrega un nuevo insumo a tu inventario"}
          </p>


        </div>
        <div className="w-full max-w-full overflow-x-hidden pt-4">
          <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">

            <div className="space-y-2">
              <MasterSupplySelect
                control={control}
                setValue={setValue}
                name={`master_supply_id`}
                errors={errors}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Nombre del Insumo *</label>
              <input
                type="text"
                {...register(`productName`)}
                value={watch(`productName`) || ""}
                readOnly
                className="w-full rounded-md border border-input bg-muted px-3 py-2 text-sm shadow-sm cursor-default focus:outline-none"
              />
            </div>


            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">

                <label className="block text-sm font-medium mb-2">Categoría *</label>
                <input
                  type="text"

                  value={categories?.find(c => c.id.toString() === watch(`categoryId`).toString())?.name || ""}
                  readOnly
                  className="w-full rounded-md border border-input bg-muted px-3 py-2 text-sm shadow-sm cursor-default focus:outline-none"
                />
              </div>


              <div>
                <label className="block text-sm font-medium mb-1 mt-1">Unidad *</label>
                <input
                  type="text"
                  {...register(`unit`)}
                  value={watch(`unit`) || ""}
                  readOnly
                  className="w-full rounded-md border border-input bg-muted px-3 py-2 text-sm shadow-sm cursor-default focus:outline-none"
                />
                {errors?.unit && (
                  <p className="text-destructive text-xs mt-1">{errors.unit.message}</p>
                )}
              </div>
              <input
                type="hidden"
                {...register(`master_supply_id`)}
                value={watch(`master_supply_id`) || ""}
              />


            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      currency="USD"
                      placeholder="0,000"
                      maxDecimals={3}
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium mb-2">Fecha de Vencimiento *</label>
                <input
                  type="date"
                  {...register("expiration_date", { required: "La fecha de vencimiento es requerida" })}
                  className="date-standard"
                />
                {errors.expiration_date && (
                  <p className="text-destructive text-sm mt-1">{errors.expiration_date.message}</p>
                )}
              </div>
            </div>

            <div className="flex pt-4 gap-2 border-t bg-background mt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={onClose}
              >
                Cancelar
              </Button>

              <Button
                type="submit"
                disabled={isSaving}
                className="flex-1"
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
            </div>
          </form>
        </div>

      </SidePanel>
    );
  },
)

StockModal.displayName = "StockModal"
