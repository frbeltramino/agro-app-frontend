"use client"

import { forwardRef, useEffect, useState } from "react"
import { useForm, useFieldArray, Controller } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Trash2, Plus } from "lucide-react"
import { Stock } from "@/interfaces/stock/stock.interface"
import { useSupplyCategories } from "@/admin/hooks/useSupplyCategories"
import { UNITS } from "@/constants/units";
import { useTaskTypes } from "@/admin/hooks/useTaskTypes"
import { CustomSelectWithCreate } from "@/components/custom/CustomSelectWithCreate"
import { useCropStore } from "@/admin/store/crop.store"
import { useSupply } from "@/admin/hooks/useSupply"
import { useStock } from "@/admin/hooks/useStock"
import { useTasks } from "@/admin/hooks/useTasks"
import { parseAmount } from "@/lib/parse-amount"
import { toast } from "sonner"
import { AmountInput } from "@/components/custom/CustomAmountInput"
import { useLotStore } from "@/admin/store/lot.store";

interface TaskSupplyForm {
  supplyType: "stock" | "purchase";
  supply_id?: number | string | null;
  stockId?: string;
  productName?: string;
  categoryId?: string;
  unit?: string;
  pricePerUnit?: number | string | null;
  dosagePerHectare: number | undefined;
  hectareQuantity: number;
}

interface TaskSupplyEdit {
  supply_id: number | null;
  stock_id: number | null;
  supply_name: string;
  category_id?: number;
  category_name: string;
  unit: string;
  price_per_unit: number | null | undefined | string;
  dose_per_ha: number;
  hectares: number;
  total_used: number;
  from_stock: boolean;
}

interface FormValues {
  id?: number | string | null;
  task_type_id: string;
  description: string;
  provider: string;
  date: string;
  note?: string;
  laborCost?: number | undefined;
  supplies: TaskSupplyForm[];
}

interface TaskFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void

  stock: Stock[] | undefined

  taskTypes?: string[]

  taskToEdit?: {
    id: number
    crop_id: number
    task_type_id: number
    description?: string
    provider: string
    total_price: number
    date: string
    note?: string
    laborCost?: number
    status: string
    created_at: string
    updated_at: string
    performed_at: string
    type: string
    supplies: TaskSupplyEdit[]
  }
}

export const TaskForm = forwardRef<HTMLDivElement, TaskFormProps>(
  (
    {
      open,
      onOpenChange,
      stock,
      taskToEdit
    },
    ref,
  ) => {

    const { data: categoriesData, createCategory } = useSupplyCategories();
    const { data: taskTypesData, createTaskTypeMutation } = useTaskTypes();

    const { selectedCrop } = useCropStore();
    const { createSupply } = useSupply({ cropId: selectedCrop?.id || 0 });
    const { createTaskMutation } = useTasks({ cropId: selectedCrop?.id || 0 });
    const { adjustStock } = useStock();
    const categories = categoriesData?.categories || [];
    const [, setFormatedAmount] = useState("0,00");
    const [, setFormatedLaborCost] = useState("0,00");
    const [isSaving, setIsSaving] = useState(false);
    const { selectedLot } = useLotStore();

    const {
      register,
      handleSubmit,
      formState: { errors },
      reset,
      control,
      watch,
    } = useForm<FormValues>({
      defaultValues: {
        task_type_id: "",
        description: "",
        provider: "",
        date: "",
        note: "",
        laborCost: undefined,
        supplies: [],
      },
    })

    const { fields, append, remove } = useFieldArray({
      control,
      name: "supplies",
    })

    const watchSupplies = watch("supplies");
    const handleAddSupply = () => {
      append({
        supplyType: "stock",
        dosagePerHectare: undefined,
        hectareQuantity: selectedLot?.hectares ?? 0,
      })
    }

    const createArrayOfSupplies = async (data: FormValues, taskToEdit?: any) => {
      const stockSupplies = data.supplies.filter((s) => s.supplyType === "stock");
      const purchaseSupplies = data.supplies.filter((s) => s.supplyType === "purchase");

      const suppliesResult: { supply_id: number | null; stock_id: number | null; dose_per_ha: number; hectares: number; price_per_unit: number }[] = [];

      // 1️⃣ Manejo de suministros de compra (igual que antes)
      for (const s of purchaseSupplies) {
        const existingSupply = taskToEdit?.supplies.find(
          (supply: TaskSupplyEdit) => supply.supply_id === s.supply_id
        );

        const payload = {
          id: existingSupply?.supply_id ?? null,
          crop_id: selectedCrop!.id,
          name: s.productName ?? "",
          category_id: Number(s.categoryId),
          unit: s.unit ?? "kg",
          dose_per_ha: Number(s.dosagePerHectare),
          hectares: Number(s.hectareQuantity),
          price_per_unit: parseAmount(s.pricePerUnit),
          status: "active",
        };

        const result = await createSupply.mutateAsync(payload);

        suppliesResult.push({
          supply_id: result.supply.id,
          stock_id: null,
          dose_per_ha: Number(s.dosagePerHectare),
          hectares: Number(s.hectareQuantity),
          price_per_unit: parseAmount(s.pricePerUnit),
        });
      }

      // 2️⃣ Manejo de stock (optimizado)
      const oldStockSupplies = taskToEdit?.supplies.filter((s: TaskSupplyEdit) => s.from_stock) || [];

      // Map para búsqueda rápida de stock actual
      const newStockMap = new Map<number, typeof stockSupplies[0]>();
      stockSupplies.forEach((s) => newStockMap.set(Number(s.stockId), s));

      for (const oldS of oldStockSupplies) {
        const oldUsedQuantity = oldS.dose_per_ha * oldS.hectares;
        const newS = newStockMap.get(oldS.stock_id!);

        let quantityToAdjust = 0;

        if (newS) {
          // Suministro actualizado → calcular diferencia
          const newUsedQuantity = Number(newS.dosagePerHectare) * Number(newS.hectareQuantity);
          quantityToAdjust = oldUsedQuantity - newUsedQuantity;

          // Ya procesado → lo eliminamos del map para detectar nuevos al final
          newStockMap.delete(oldS.stock_id!);
        } else {
          // Suministro eliminado → devolver stock completo
          quantityToAdjust = oldUsedQuantity;
        }

        try {
          const resultStock = await adjustStock.mutateAsync({
            stockId: oldS.stock_id!,
            quantity: quantityToAdjust,
          });

          // Solo agregamos al array si aún existe en la edición
          if (newS) {
            const selectedStock = stock?.find((itemStock) => itemStock.id === Number(newS.stockId)) ?? null;
            suppliesResult.push({
              supply_id: null,
              stock_id: Number(resultStock.id),
              dose_per_ha: Number(newS.dosagePerHectare),
              hectares: Number(newS.hectareQuantity),
              price_per_unit: parseAmount(selectedStock?.price_per_unit),
            });
          }
        } catch (error: any) {
          const message =
            error?.response?.data?.message || error?.message || "Error desconocido al ajustar el stock";
          throw new Error(message);
        }
      }

      // 🔹 Manejo de nuevos suministros de stock que no existían antes
      for (const s of newStockMap.values()) {
        const newUsedQuantity = Number(s.dosagePerHectare) * Number(s.hectareQuantity);

        try {
          const resultStock = await adjustStock.mutateAsync({
            stockId: Number(s.stockId!),
            quantity: -newUsedQuantity, // negativo → restar del stock
          });

          const selectedStock = stock?.find((itemStock) => itemStock.id === Number(s.stockId)) ?? null;
          suppliesResult.push({
            supply_id: null,
            stock_id: Number(resultStock.id),
            dose_per_ha: Number(s.dosagePerHectare),
            hectares: Number(s.hectareQuantity),
            price_per_unit: parseAmount(selectedStock?.price_per_unit),
          });
        } catch (error: any) {
          const message =
            error?.response?.data?.message || error?.message || "Error desconocido al ajustar el stock";
          throw new Error(message);
        }
      }

      return suppliesResult;
    };

    const onFormSubmit = async (data: FormValues) => {
      setIsSaving(true);

      try {

        const taskSupplies = await createArrayOfSupplies(data, taskToEdit);

        const dataForTask = {
          task_id: taskToEdit?.id || null,
          crop_id: selectedCrop?.id,
          task_type_id: data.task_type_id ? Number(data.task_type_id) : undefined,
          description: data.description?.trim() !== "" ? data.description : null,
          provider: data.provider ?? undefined,
          performed_at: data.date ?? null,
          note: data.note ?? null,
          laborCost: data.laborCost ? parseAmount(data.laborCost) : undefined,
          supplies: taskSupplies.length > 0 ? taskSupplies : [],
        };

        const response = await createTaskMutation(dataForTask);

        reset();
        onOpenChange(false);
        setFormatedAmount("0,00");
        setFormatedLaborCost("0,00");
        toast.success(response.message || "La tarea ha sido creada exitosamente");

      } catch (err: any) {
        const errorMessage = err?.message || "Error al crear la tarea";
        toast.error(errorMessage);
      } finally {
        setIsSaving(false); // loading OFF SIEMPRE
      }
    };

    const formattedTaskTypes = taskTypesData?.taskTypes.map((t: any) =>
      typeof t === "string" ? { id: t, name: t } : t
    );


    const findCategoryId = (name: string) => {
      const category = categoriesData?.categories.find((c) => c.name === name);
      return category?.id || 0;
    };

    const mapTaskSupplyToForm = (s: TaskSupplyEdit): TaskSupplyForm => (
      {
        supplyType: s.from_stock ? "stock" : "purchase",
        supply_id: s.supply_id || "",
        stockId: s.stock_id?.toString() || "",
        productName: s.supply_name || "",
        categoryId: s.category_name ? findCategoryId(s.category_name).toString() : "0",
        unit: s.unit || "",
        pricePerUnit: s.price_per_unit ?? 0,
        dosagePerHectare: s.dose_per_ha,
        hectareQuantity: s.hectares,
      });

    useEffect(() => {
      if (taskToEdit) {
        reset({
          id: taskToEdit.id,
          task_type_id: taskToEdit.task_type_id?.toString() || "",
          description: taskToEdit.description || "",
          provider: taskToEdit.provider || "",
          date: taskToEdit.date || taskToEdit.performed_at || "",
          note: taskToEdit.note || "",
          laborCost: taskToEdit?.laborCost ?? undefined,
          supplies: taskToEdit.supplies?.map(mapTaskSupplyToForm) || [],
        });
      } else {
        reset({
          task_type_id: "",
          description: "",
          provider: "",
          date: "",
          note: "",
          laborCost: undefined,
          supplies: [],
        });
      }
    }, [taskToEdit, reset]);

    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent ref={ref} className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Nueva Tarea de Cultivo</DialogTitle>
            <DialogDescription>
              Completa los datos de la tarea y selecciona los suministros necesarios
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
            {/* Tipo de Tarea */}
            <CustomSelectWithCreate
              label="Tipo de tarea"
              name="task_type_id"
              options={formattedTaskTypes || []}
              register={register}
              errors={errors}
              onCreate={async (name: string) => {
                await createTaskTypeMutation.mutateAsync(name);
                // opcional: actualizar estado local si lo necesitas
              }}
            />


            {/* Descripción */}
            <div>
              <label className="block text-sm font-medium mb-2">Descripción</label>
              <textarea
                {...register("description")}
                required={false}
                rows={2}
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                placeholder="Describe los detalles de la tarea..."
              />
            </div>

            {/* Proveedor y Fecha */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Proveedor</label>
                <input
                  type="text"
                  {...register("provider")}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Nombre del proveedor"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Fecha *</label>
                <input
                  type="date"
                  {...register("date", { required: "La fecha es requerida" })}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                {errors.date && <p className="text-destructive text-sm mt-1">{errors.date.message}</p>}
              </div>
            </div>

            {/* Nota */}
            <div>
              <label className="block text-sm font-medium mb-2">Nota (opcional)</label>
              <textarea
                {...register("note")}
                rows={2}
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                placeholder="Agrega notas adicionales..."
              />
            </div>

            {/* Costo de Mano de Obra */}
            <div>
              <Controller
                name="laborCost"
                control={control}

                rules={{
                  min: { value: 0, message: "El costo debe ser positivo" },
                }}
                render={({ field, fieldState }) => (
                  <AmountInput
                    label="Costo de Mano de Obra (opcional)"
                    value={field.value}           // RHF controla el valor numérico
                    onChange={field.onChange}     // RHF actualiza su estado
                    error={fieldState.error?.message}
                    currency="ARS"
                    locale="es-AR"
                    placeholder="0,00"
                  />
                )}
              />
            </div>

            {/* Suministros */}
            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-4">
                <label className="text-sm font-medium">Suministros</label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddSupply}
                  className="gap-2 bg-transparent"
                >
                  <Plus className="w-4 h-4" />
                  Agregar Suministro
                </Button>
              </div>

              {fields.length === 0 && (
                <p className="text-sm text-muted-foreground mb-4">
                  No hay suministros agregados. Haz clic en "Agregar Suministro" para comenzar.
                </p>
              )}

              <div className="space-y-4">
                {fields.map((field: any, index) => {
                  const supplyType = watchSupplies[index]?.supplyType
                  const selectedStockId = watch(`supplies.${index}.stockId`);
                  const selectedStock = stock?.find((s) => s.id === Number(selectedStockId));
                  const stockSupplies = stock

                  return (
                    <div key={field.id} className="border rounded-lg p-4 bg-secondary/5 space-y-3">
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium text-sm">Suministro {index + 1}</h4>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => remove(index)}
                          className="text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>

                      {/* Tipo de Suministro */}
                      <div>
                        <label className="block text-sm font-medium mb-2">Tipo de Suministro *</label>
                        <select
                          {...register(`supplies.${index}.supplyType`, {
                            required: "Selecciona el tipo de suministro",
                          })}
                          className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                        >
                          <option value="stock">De Stock</option>
                          <option value="purchase">Comprar para esta tarea</option>
                        </select>
                      </div>

                      {supplyType === "stock" ? (
                        <div>
                          <label className="block text-sm font-medium mb-2">Seleccionar Suministro de Stock *</label>
                          <select
                            {...register(`supplies.${index}.stockId`, {
                              required: "Selecciona un suministro de stock",
                            })}
                            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                          >
                            <option value="">Selecciona un suministro</option>
                            {stockSupplies?.map((supply) => (
                              <option key={supply.id} value={supply.id?.toString()}>
                                {supply.name} — <span>({supply.quantity_available} {supply.unit} disponibles)</span>
                              </option>
                            ))}
                          </select>
                          {errors.supplies?.[index]?.stockId && (
                            <p className="text-destructive text-sm mt-1">{errors.supplies[index]?.stockId?.message}</p>
                          )}
                        </div>
                      ) : (
                        <>
                          <div>
                            <label className="block text-sm font-medium mb-2">Nombre del Producto *</label>
                            <input
                              type="text"
                              {...register(`supplies.${index}.productName`, {
                                required: "El nombre del producto es requerido",
                              })}
                              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                              placeholder="Ej: Fertilizante NPK 10-20-20"
                            />
                            {errors.supplies?.[index]?.productName && (
                              <p className="text-destructive text-sm mt-1">
                                {errors.supplies[index]?.productName?.message}
                              </p>
                            )}
                          </div>

                          <div>
                            <CustomSelectWithCreate
                              label="Categoría"
                              name={`supplies.${index}.categoryId`}
                              options={categories || []}
                              register={register}
                              errors={errors}
                              onCreate={async (name: string) => {
                                await createCategory(name);
                                // opcional: actualizar estado local si lo necesitas
                              }}


                            />
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-sm font-medium mb-2">Unidad *</label>
                              <select
                                {...register(`supplies.${index}.unit`, {
                                  required: "La unidad es requerida",
                                })}
                                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                              >
                                <option value="">Selecciona una unidad</option>

                                {UNITS.map((u) => (
                                  <option key={u.value} value={u.value}>
                                    {u.label}
                                  </option>
                                ))}
                              </select>
                              {errors.supplies?.[index]?.unit && (
                                <p className="text-destructive text-sm mt-1">{errors.supplies[index]?.unit?.message}</p>
                              )}
                            </div>

                            <Controller
                              control={control}
                              name={`supplies.${index}.pricePerUnit`}
                              rules={{
                                required: "El precio es requerido",
                                min: { value: 0, message: "El precio debe ser positivo" },
                              }}
                              render={({ field, fieldState }) => (
                                <AmountInput
                                  label="Precio por Unidad *"
                                  value={field.value != null && field.value !== "" ? Number(field.value) : undefined}
                                  onChange={field.onChange}
                                  currency="ARS"
                                  locale="es-AR"
                                  placeholder="0,00"
                                  error={fieldState.error?.message}
                                />
                              )}
                            />
                          </div>
                        </>
                      )}

                      {/* Dosis por Hectárea y Cantidad de Hectáreas */}
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Controller
                            control={control}
                            name={`supplies.${index}.dosagePerHectare`}
                            rules={{
                              required: "La dosis es requerida",
                              min: { value: 0.01, message: "La dosis debe ser positiva" },
                            }}
                            render={({ field, fieldState }) => (
                              <AmountInput
                                label={`Dosis por Hectárea (${supplyType === "stock"
                                  ? selectedStock?.unit ?? "unidad"
                                  : watchSupplies[index]?.unit ?? "unidad"
                                  }) *`}
                                value={field.value}
                                onChange={field.onChange}
                                error={fieldState.error?.message}
                                locale="es-AR"
                                placeholder="0,00"
                              />
                            )}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">Cantidad de Hectáreas *</label>
                          <input
                            type="number"
                            step="0.01"
                            {...register(`supplies.${index}.hectareQuantity`, {
                              required: "La cantidad de hectáreas es requerida",
                              min: { value: 0, message: "Las hectáreas deben ser positivas" },
                            })}
                            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                            placeholder="0.00"
                          />
                          {errors.supplies?.[index]?.hectareQuantity && (
                            <p className="text-destructive text-sm mt-1">
                              {errors.supplies[index]?.hectareQuantity?.message}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
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

TaskForm.displayName = "TaskForm"
