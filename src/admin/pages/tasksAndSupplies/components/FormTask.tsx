"use client"

import { forwardRef, useState } from "react"
import { useForm, useFieldArray } from "react-hook-form"
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
import { currencyFormatter } from "@/lib/currency-formatter"
import { useTasks } from "@/admin/hooks/useTasks"
import { parseAmount } from "@/lib/parse-amount"
import { toast } from "sonner"

interface TaskSupply {
  supplyType: "stock" | "purchase"
  stockId?: string // Para suministros de stock
  productName?: string // Para suministros comprados
  categoryId?: string
  unit?: "lt" | "kg"
  pricePerUnit?: number | string | undefined | null
  dosagePerHectare: number
  hectareQuantity: number
}

interface FormValues {
  id?: number | string | null
  task_type_id: string; // <- aquí va el id del tipo de tarea
  description: string
  provider: string
  date: string
  note?: string
  laborCost?: number
  supplies: TaskSupply[]
}

interface TaskFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void

  stock: Stock[] | undefined// Lista de suministros disponibles
  // supplies?: Supply[] // Lista de suministros disponibles
  taskTypes?: string[] // Tipos de tarea disponibles
}

export const TaskForm = forwardRef<HTMLDivElement, TaskFormProps>(
  (
    {
      open,
      onOpenChange,
      stock
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
    const [formatedAmount, setFormatedAmount] = useState("0,00");
    const [formatedLaborCost, setFormatedLaborCost] = useState("0,00");
    const [isSaving, setIsSaving] = useState(false);


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
        dosagePerHectare: 0,
        hectareQuantity: 0,
      })
    }

    const createArrayOfSupplies = async (data: FormValues) => {
      const stockSupplies = data.supplies.filter((s) => s.supplyType === "stock");
      const purchaseSupplies = data.supplies.filter((s) => s.supplyType === "purchase");
      // me creo los array donde voy a poner los ids de las suministros creadas y editados en caso de stock
      const createdSupplies: { supply_id: number | null; stock_id: number | null; dose_per_ha: number; hectares: number }[] = [];
      const usedStocks: { supply_id: number | null; stock_id: number | null; dose_per_ha: number; hectares: number }[] = [];

      // Primero los supplies comprados
      for (const s of purchaseSupplies) {
        const result = await createSupply.mutateAsync({
          crop_id: selectedCrop!.id,
          name: s.productName ?? "",
          category_id: Number(s.categoryId),
          unit: s.unit ?? "kg",
          dose_per_ha: Number(s.dosagePerHectare),
          hectares: Number(s.hectareQuantity),
          price_per_unit: parseAmount(s.pricePerUnit),
          status: "active",
        });

        // Guardamos el id del supply creado
        createdSupplies.push({
          supply_id: result.supply.id,
          stock_id: null,
          dose_per_ha: Number(s.dosagePerHectare),
          hectares: Number(s.hectareQuantity),
        });
      }

      // Luego los supplies de stock
      for (const s of stockSupplies) {
        const quantityToSubtract = -1 * Number(s.dosagePerHectare) * Number(s.hectareQuantity);

        const resultStock = await adjustStock.mutateAsync({
          stockId: s.stockId ? Number(s.stockId) : 0,
          quantity: quantityToSubtract,
        });

        // Guardamos el stock usado
        usedStocks.push({
          supply_id: null,
          stock_id: Number(resultStock.id),
          dose_per_ha: Number(s.dosagePerHectare),
          hectares: Number(s.hectareQuantity),
        });
      }

      // Juntamos ambos arrays para enviar al servicio de creación de task
      return [...createdSupplies, ...usedStocks];

    }

    const onFormSubmit = async (data: FormValues) => {
      setIsSaving(true); // loading ON

      try {
        // 1. Esperar al procesamiento de supplies y stock
        const taskSupplies = await createArrayOfSupplies(data);

        // 2. Armar el payload de la task
        const dataForTask = {
          task_id: null,
          crop_id: selectedCrop?.id,
          task_type_id: data.task_type_id ? Number(data.task_type_id) : undefined,
          description: data.description ?? undefined,
          provider: data.provider ?? undefined,
          performed_at: data.date ?? null,
          note: data.note ?? null,
          laborCost: data.laborCost ? parseAmount(data.laborCost) : undefined,
          supplies: taskSupplies.length > 0 ? taskSupplies : [],
        };

        console.log("Datos para la tarea:", dataForTask);

        // 3. Crear la task esperando a que termine
        await createTaskMutation(dataForTask);

        // 4. Reset y cierre
        reset();
        onOpenChange(false);
        setFormatedAmount("0,00");
        setFormatedLaborCost("0,00");
        toast.success("La tarea ha sido creada exitosamente");

      } catch (err) {
        console.error("Error al crear la tarea:", err);
      } finally {
        setIsSaving(false); // loading OFF SIEMPRE
      }
    };

    const formattedTaskTypes = taskTypesData?.taskTypes.map((t: any) =>
      typeof t === "string" ? { id: t, name: t } : t
    );

    const formatAmount = (amount: number) => {
      setFormatedAmount(
        currencyFormatter(amount)
      );
    };

    const formatLaborCost = (laborCost: number) => {
      setFormatedLaborCost(
        currencyFormatter(laborCost)
      );
    };

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
              <label className="block text-sm font-medium mb-2">Descripción *</label>
              <textarea
                {...register("description", { required: "La descripción es requerida" })}
                rows={2}
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                placeholder="Describe los detalles de la tarea..."
              />
              {errors.description && <p className="text-destructive text-sm mt-1">{errors.description.message}</p>}
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
              <label className="block text-sm font-medium mb-2">Costo de Mano de Obra (opcional)</label>
              <input
                type="number"
                step="0.01"
                {...register("laborCost", {
                  min: { value: 0, message: "El costo debe ser positivo" },
                })}
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="0.00"
                onChange={(e) => { formatLaborCost(Number(e.target.value)) }}
              />
              <p className="text-muted-foreground text-xs">{formatedLaborCost}</p>
              {errors.laborCost && <p className="text-destructive text-sm mt-1">{errors.laborCost.message}</p>}
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
                {fields.map((field, index) => {
                  const supplyType = watchSupplies[index]?.supplyType
                  const stockSupplies = stock
                  //const purchaseSupplies = supplies.filter((s) => s.type === "purchase")

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

                            <div>
                              <label className="block text-sm font-medium mb-2">Precio por Unidad *</label>
                              <input
                                type="number"
                                step="0.01"
                                {...register(`supplies.${index}.pricePerUnit`, {
                                  required: "El precio es requerido",
                                  min: { value: 0, message: "El precio debe ser positivo" },
                                })}
                                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                                placeholder="0.00"
                                onChange={(e) => { formatAmount(Number(e.target.value)) }}
                              />
                              {errors.supplies?.[index]?.pricePerUnit && (
                                <p className="text-destructive text-sm mt-1">
                                  {errors.supplies[index]?.pricePerUnit?.message}
                                </p>
                              )}
                              <p className="text-muted-foreground text-xs">{formatedAmount}</p>
                            </div>
                          </div>
                        </>
                      )}

                      {/* Dosis por Hectárea y Cantidad de Hectáreas */}
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Dosis por Hectárea ({watchSupplies[index]?.unit || "unidad"}) *
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            {...register(`supplies.${index}.dosagePerHectare`, {
                              required: "La dosis es requerida",
                              min: { value: 0, message: "La dosis debe ser positiva" },
                            })}
                            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                            placeholder="0.00"
                          />
                          {errors.supplies?.[index]?.dosagePerHectare && (
                            <p className="text-destructive text-sm mt-1">
                              {errors.supplies[index]?.dosagePerHectare?.message}
                            </p>
                          )}
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
