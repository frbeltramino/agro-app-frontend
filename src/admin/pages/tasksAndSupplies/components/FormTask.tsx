"use client"

import { forwardRef, useEffect, useState } from "react"
import { useForm, useFieldArray, Controller } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { Stock } from "@/interfaces/stock/stock.interface"
import { useSupplyCategories } from "@/admin/hooks/useSupplyCategories"
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
import { TaskSuppliesTable } from "./formTaskComponents/TaskSuppliesTable"
import { TaskSupplyFormComponent } from "./formTaskComponents/TaskSupplyForm"

import { Stepper } from "@/components/custom/StepIndicator";
import { useTaskForm } from "../hooks/useTaskForm"
import { SidePanel } from "@/admin/components/SidePanel"
import { useProviders } from "@/admin/hooks/useProviders"

interface TaskSupplyForm {
  supplyType: "stock" | "purchase";
  supply_id?: number | string | null;
  master_supply_id?: number | null;
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
  master_supply_id?: number | null;
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
  provider_id: string;
  master_supply_id: number | null;
  description: string;
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
    provider_id: number
    description?: string
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
    }
  ) => {

    const { data: categoriesData } = useSupplyCategories();
    const { data: taskTypesData, createTaskTypeMutation } = useTaskTypes();
    const { data: providersData, createProviderMutation } = useProviders();

    const { selectedCrop } = useCropStore();
    const { createSupply } = useSupply({ cropId: selectedCrop?.id || 0 });
    const { createTaskMutation } = useTasks({ cropId: selectedCrop?.id || 0 });
    const { adjustStock } = useStock();
    const categories = categoriesData?.categories || [];
    const { selectedLot } = useLotStore();
    const [createNewSupply, setCreateNewSupply] = useState(false);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);

    const { setStep, step, isSaving, setIsSaving, createPurchaseSupply, updateStockSupply, createNewStockSupply } = useTaskForm({
      selectedLot,
      stock,
      taskToEdit,
      createSupply,
      adjustStock,
      selectedCrop,
    });

    const {
      register,
      handleSubmit,
      formState: { errors },
      reset,
      control,
      watch,
      trigger,
      setValue
    } = useForm<FormValues>({
      defaultValues: {
        task_type_id: "",
        provider_id: "",
        description: "",
        date: "",
        note: "",
        laborCost: undefined,
        supplies: [],
      },
    })

    const { append, remove } = useFieldArray({
      control,
      name: "supplies",
    })

    const supplyForm = useForm<TaskSupplyForm>({
      defaultValues: {
        supplyType: "stock",
        hectareQuantity: selectedLot?.hectares ?? 0,
      },
    });

    const handleConfirmSupply = () => {
      const newSupply = supplyForm.getValues();
      if (newSupply.stockId && stock) {
        const foundStock = stock.find(s => s.id === Number(newSupply.stockId));
        if (foundStock) {
          newSupply.productName = foundStock.name;
        }
      }
      if (editingIndex !== null) {
        const updatedSupplies = [...watchSupplies];
        updatedSupplies[editingIndex] = newSupply;

        setValue("supplies", updatedSupplies, { shouldDirty: true });
        setEditingIndex(null);
      } else {
        // agregar nuevo insumos
        append(newSupply);
      }

      supplyForm.reset({
        supplyType: "stock",
        hectareQuantity: selectedLot?.hectares ?? 0,
      });
      setCreateNewSupply(false);
    };

    const handleDeleteSupply = (index: number) => {
      remove(index); // remove de useFieldArray
    };
    const watchSupplies = watch("supplies");

    const handleOpenAddSupply = () => {
      setEditingIndex(null);
      supplyForm.reset({
        supplyType: "stock",
        hectareQuantity: selectedLot?.hectares ?? 0,
      });
      setCreateNewSupply(true)
    }

    const handleEditSupply = (index: number) => {
      const supply = watchSupplies[index];
      supplyForm.reset(supply); // precarga datos en el formulario
      setEditingIndex(index);
      setCreateNewSupply(true); // abre el formulario
    };

    const createArrayOfSupplies = async (data: FormValues, taskToEdit?: any) => {
      const stockSupplies = data.supplies.filter((s) => s.supplyType === "stock");
      const purchaseSupplies = data.supplies.filter((s) => s.supplyType === "purchase");

      const suppliesResult: { supply_id: number | null; stock_id: number | null; dose_per_ha: number; hectares: number; price_per_unit: number; }[] = [];

      // 1️⃣ Manejo de insumos de compra (igual que antes)
      for (const s of purchaseSupplies) {
        const result = await createPurchaseSupply(taskToEdit, selectedCrop, s);
        suppliesResult.push(result);
      }

      // 2️⃣ Manejo de stock (optimizado)
      const oldStockSupplies = taskToEdit?.supplies.filter((s: TaskSupplyEdit) => s.from_stock) || [];

      // Map para búsqueda rápida de stock actual
      const newStockMap = new Map<number, typeof stockSupplies[0]>();
      stockSupplies.forEach((s) => newStockMap.set(Number(s.stockId), s));

      for (const oldS of oldStockSupplies) {
        const stockSupply = await updateStockSupply(oldS, newStockMap, stock);
        if (stockSupply) {
          suppliesResult.push(stockSupply);
        }

      }

      // 🔹 Manejo de nuevos Insumo de stock que no existían antes
      for (const s of newStockMap.values()) {
        const newSupplyStockResult = await createNewStockSupply(s, stock);
        if (newSupplyStockResult) {
          suppliesResult.push(newSupplyStockResult);
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
          provider_id: data.provider_id ? Number(data.provider_id) : undefined,
          description: data.description?.trim() !== "" ? data.description : null,
          performed_at: data.date ?? null,
          note: data.note ?? null,
          laborCost: data.laborCost ? parseAmount(data.laborCost) : undefined,
          supplies: taskSupplies.length > 0 ? taskSupplies : [],
        };

        const response = await createTaskMutation(dataForTask);

        reset();
        handleOpenChange(false);
        toast.success(response.message || "La labor ha sido creada exitosamente");

      } catch (err: any) {
        const errorMessage = err?.message || "Error al crear la labor";
        toast.error(errorMessage);
      } finally {
        setIsSaving(false); // loading OFF SIEMPRE
      }
    };

    const formattedTaskTypes = taskTypesData?.taskTypes.map((t: any) =>
      typeof t === "string" ? { id: t, name: t } : t
    );

    const formattedProviders = providersData?.providers.map((p: any) =>
      typeof p === "string" ? { id: p, name: p } : p
    );

    const findCategoryId = (name: string) => {
      const category = categoriesData?.categories.find((c) => c.name === name);
      return category?.id || 0;
    };

    const mapTaskSupplyToForm = (s: TaskSupplyEdit): TaskSupplyForm => (
      {
        supplyType: s.from_stock ? "stock" : "purchase",
        supply_id: s.supply_id || "",
        master_supply_id: s.master_supply_id || null,
        stockId: s.stock_id?.toString() || "",
        productName: s.supply_name || "",
        categoryId: s.category_name ? findCategoryId(s.category_name).toString() : "0",
        unit: s.unit || "",
        pricePerUnit: s.price_per_unit ?? 0,
        dosagePerHectare: s.dose_per_ha,
        hectareQuantity: s.hectares,
      });

    useEffect(() => {
      setStep(1)
      if (taskToEdit) {
        reset({
          id: taskToEdit.id,
          task_type_id: taskToEdit.task_type_id?.toString() || "",
          provider_id: taskToEdit.provider_id?.toString() || "",
          description: taskToEdit.description || "",
          date: taskToEdit.date || taskToEdit.performed_at || "",
          note: taskToEdit.note || "",
          laborCost: taskToEdit?.laborCost ?? undefined,
          supplies: taskToEdit.supplies?.map(mapTaskSupplyToForm) || [],
        });
      } else {
        reset({
          task_type_id: "",
          provider_id: "",
          description: "",
          date: "",
          note: "",
          laborCost: undefined,
          supplies: [],
        });
      }
    }, [taskToEdit, reset]);

    const handleOpenChange = (open: boolean) => {
      if (!open) {
        // Limpiar formulario principal
        reset({
          task_type_id: "",
          provider_id: "",
          description: "",
          date: "",
          note: "",
          laborCost: undefined,   // o undefined si querés
          supplies: [],
        }, { keepDefaultValues: false });

        // Limpiar formulario de insumos
        supplyForm.reset({
          supplyType: "stock",
          hectareQuantity: selectedLot?.hectares ?? 0,
        });

        setCreateNewSupply(false);
        setEditingIndex(null);
      }

      setStep(1);
      onOpenChange(open);
    };

    const handleNextStep = async () => {
      const isValid = await trigger(["task_type_id", "date"]);

      if (isValid) {
        setStep(2);
      }
    };

    return (
      <SidePanel
        isOpen={open}
        onClose={() => handleOpenChange(false)}
        title={step === 1 ? "Detalles de la Labor" : "Agregar Insumos"}
        width="lg"
      >
        <form onSubmit={handleSubmit(onFormSubmit)} className="flex flex-col flex-1 h-full">

          <div className="shrink-0 border-b bg-background px-4 py-4 sm:px-6 sm:py-5">
            <p className="text-sm text-muted-foreground mt-1">
              {step === 1
                ? "Completa los datos generales de la labor"
                : "Selecciona y configura los insumos necesarios para esta labor"}
            </p>
          </div>
          <div className="shrink-0 border-b bg-background p-2 sm:p-4">
            <Stepper step={step} steps={["Detalles de la labor", "Agregar Insumos"]} />

          </div>

          <div className="flex-1 overflow-y-auto overscroll-contain p-2 sm:p-4 space-y-4 ">

            {
              step === 1 && (
                <>

                  {/* Tipo de labor */}
                  <CustomSelectWithCreate
                    label="Tipo de labor *"
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
                    <label className="block text-sm font-medium mb-1 sm:mb-2">Descripción</label>
                    <textarea
                      {...register("description")}
                      required={false}
                      rows={2}
                      className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                      placeholder="Describe los detalles de la labor..."
                    />
                  </div>

                  {/* Proveedor y Fecha */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>

                      <CustomSelectWithCreate
                        label="Proveedor"
                        name="provider_id"
                        options={formattedProviders || []}
                        register={register}
                        errors={errors}
                        onCreate={async (name: string) => {
                          await createProviderMutation.mutateAsync(name);
                        }}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mt-1 mb-1 sm:mb-2">Fecha *</label>
                      <input
                        type="date"
                        {...register("date", { required: "La fecha es requerida" })}
                        className="w-full min-w-0 appearance-none mt-1 px-3 py-2 sm:py-2 border rounded-md text-sm sm:text-base focus:ring-2 focus:ring-primary focus:border-transparent dark:scheme-dark"
                      />
                      {errors.date && <p className="text-destructive text-sm mt-1">{errors.date.message}</p>}
                    </div>
                  </div>

                  {/* Nota */}
                  <div>
                    <label className="block text-sm font-medium mb-1 sm:mb-2">Nota (opcional)</label>
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
                          currency="USD"
                          locale="es-AR"
                          placeholder="0,00"
                        />
                      )}
                    />
                  </div>
                </>
              )
            }

            {
              step === 2 && (
                <>
                  <div className=" pt-4">
                    <div className="flex justify-between items-center mb-4">
                      <label className="text-sm font-medium">Insumos</label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.preventDefault();
                          handleOpenAddSupply();
                        }}
                        className="gap-2 bg-transparent"
                      >
                        <Plus className="w-4 h-4" />
                        Crear Insumo
                      </Button>
                    </div>

                    {watchSupplies.length === 0 && (
                      <p className="text-sm text-muted-foreground mb-4">
                        No hay Insumos agregados. Haz clic en "Crear Insumo" para comenzar.
                      </p>
                    )}

                    {createNewSupply &&
                      <TaskSupplyFormComponent
                        index={0}
                        register={supplyForm.register}
                        control={supplyForm.control}
                        errors={supplyForm.formState.errors}
                        watch={supplyForm.watch}
                        setValue={supplyForm.setValue}
                        stockSupplies={stock}
                        categories={categories}
                        onCancel={() => {
                          supplyForm.reset();
                          setCreateNewSupply(false);
                        }}
                        onSubmit={handleConfirmSupply}
                        isEditing={false}
                      />
                    }
                    {watchSupplies.length > 0 && (
                      <div className="mt-2">
                        <TaskSuppliesTable
                          supplies={watchSupplies}
                          isAddingSupply={createNewSupply}
                          onEdit={handleEditSupply}
                          onDelete={handleDeleteSupply}
                        />
                      </div>
                    )}



                  </div>
                </>
              )
            }

            {/* insumos */}

          </div>

          <div className="shrink-0 border-t bg-background px-4 py-4 sm:px-6">
            <div className="flex gap-2">
              {step === 1 && (
                <>
                  <Button
                    type="button"
                    disabled={isSaving || createNewSupply}
                    variant="outline"
                    className="flex-1"
                    onClick={() => handleOpenChange(false)}
                  >
                    Cerrar
                  </Button>

                  <Button
                    type="button"
                    className="flex-1"
                    onClick={handleNextStep}
                  >
                    Siguiente
                  </Button>
                </>
              )}

              {step === 2 && (
                <>
                  <Button
                    type="button"
                    disabled={isSaving || createNewSupply}
                    variant="outline"
                    className="flex-1"
                    onClick={() => setStep(1)}
                  >
                    Volver
                  </Button>

                  <Button
                    type="submit"
                    disabled={isSaving || createNewSupply}
                    className="flex-1"
                  >
                    {isSaving ? "Guardando..." : "Guardar"}
                  </Button>
                </>
              )}
            </div>
          </div>
        </form>


      </SidePanel>
    )
  },
)

TaskForm.displayName = "TaskForm"
