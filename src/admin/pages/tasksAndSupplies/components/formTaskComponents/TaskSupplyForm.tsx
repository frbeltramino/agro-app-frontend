import { Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { AmountInput } from "@/components/custom/CustomAmountInput";
import { MasterSupplySelect } from "../MasterSupplySelect";
import { useLotStore } from "@/admin/store/lot.store";
import { useEffect } from "react";

interface Props {
  index: number;
  register: any;
  control: any;
  errors?: any;
  watch: any;
  setValue: any;
  stockSupplies?: any[];
  categories?: any[];
  onCancel: () => void;
  onSubmit: () => void;
  isEditing: boolean;
}

export function TaskSupplyFormComponent({
  index,
  register,
  control,
  errors,
  watch,
  setValue,
  stockSupplies,
  categories,
  onCancel,
  onSubmit,
  isEditing,
}: Props) {
  const supplyType = watch(`supplyType`) ? watch(`supplyType`) : "stock";
  const selectedStockId = watch(`stockId`);
  const selectedStock = stockSupplies?.find((s) => s.id === Number(selectedStockId));
  const { selectedLot } = useLotStore();

  useEffect(() => {
    if (supplyType === "stock" && selectedStock) {
      setValue("unit", selectedStock.unit);
    }
  }, [selectedStockId, supplyType, selectedStock, setValue]);

  useEffect(() => {
    if (supplyType !== "stock") {
      setValue("stockId", "");
    }
  }, [supplyType, setValue]);

  return (
    <div className="border rounded-lg p-4 bg-muted/30 space-y-4 w-full max-w-full">
      <h4 className="font-medium text-base text-center sm:text-left">{isEditing ? "Editar Insumo" : "Nuevo Insumo"}</h4>

      {/* Tipo de insumo */}
      <div>
        <div>
          <Label className="text-sm mb-1.5">Tipo de Insumo *</Label>
          <select
            {...register(`supplyType`, { required: "Selecciona el tipo de insumo" })}
            className="select-standard w-full"
          >
            <option value="stock">De Stock</option>
            <option value="purchase">Comprar para esta tarea</option>
          </select>
          {errors?.supplyType && (
            <p className="text-destructive text-xs mt-1">{errors.supplyType.message}</p>
          )}
        </div>

        {supplyType === "stock" ? (
          <div className="mt-2">
            <Label className="text-sm mb-1.5">Seleccionar Insumo de Stock *</Label>
            <select
              {...register(`stockId`, { required: "Selecciona un insumo de stock" })}
              className="select-standard w-full"
            >
              <option value="">Selecciona un insumo</option>
              {stockSupplies?.map((supply) => (
                <option key={supply.id} value={supply.id?.toString()}>
                  {supply.name} — {supply.quantity_available} {supply.unit} disponibles
                </option>
              ))}
            </select>
            {errors?.stockId && (
              <p className="text-destructive text-xs mt-1">{errors.stockId.message}</p>
            )}

            <div >
              <input
                type="text"
                {...register(`unit`)}
                value={watch(`unit`) || ""}
                readOnly
                className="hidden w-full rounded-md border border-input bg-muted px-3 py-2 text-sm shadow-sm cursor-default focus:outline-none"
              />
            </div>
          </div>
        ) : (
          <>
            {/* Compra de insumo */}
            <div className="space-y-2 mt-2">
              <MasterSupplySelect
                control={control}
                setValue={setValue}
                name={`master_supply_id`}
                errors={errors}
                editingSupply={index}
              />
            </div>

            <div >
              <Label className="text-sm mb-1.5 mt-1.5">Nombre del Producto *</Label>
              <input
                type="text"
                {...register(`productName`)}
                value={watch(`productName`) || ""}
                readOnly
                className="w-full rounded-md border border-input bg-muted px-3 py-2 text-sm shadow-sm cursor-default focus:outline-none"
              />
            </div>

            <div>
              <Label className="text-sm mb-1.5 mt-1.5">Categoría *</Label>
              <input
                type="text"

                value={categories?.find(c => c.id.toString() === watch(`categoryId`))?.name || ""}
                readOnly
                className="w-full rounded-md border border-input bg-muted px-3 py-2 text-sm shadow-sm cursor-default focus:outline-none"
              />
            </div>
            <div >
              <Label className="text-sm mb-1.5 mt-1.5">Unidad *</Label>
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

            <div className="space-y-2 mt-2">
              <Controller
                control={control}
                name={`pricePerUnit`}
                rules={{
                  required: "El precio es requerido",
                  min: { value: 0, message: "El precio debe ser positivo" },
                }}
                render={({ field, fieldState }) => (
                  <AmountInput
                    label={`Precio por unidad (${supplyType === "stock" ? selectedStock?.unit ?? "" : watch(`unit`) ?? "unidad"}) *`}
                    value={field.value != null && field.value !== "" ? Number(field.value) : undefined}
                    onChange={field.onChange}
                    currency="USD"
                    locale="es-AR"
                    placeholder="0,00"
                    error={fieldState.error?.message}
                  />
                )}
              />
            </div>

          </>
        )}
      </div>

      {/* Dosis y hectáreas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
        <Controller
          control={control}
          name={`dosagePerHectare`}
          rules={{
            required: "La dosis es requerida",
            min: { value: 0.01, message: "La dosis debe ser positiva" },
          }}
          render={({ field, fieldState }) => (
            <AmountInput
              label={`Dosis por Hectárea (${supplyType === "stock" ? selectedStock?.unit ?? "" : watch(`unit`) ?? "unidad"}) *`}
              value={field.value}
              onChange={field.onChange}
              error={fieldState.error?.message}
              locale="es-AR"
              placeholder="0,00"
              maxDecimals={3}
            />
          )}
        />


        <Controller
          control={control}
          name={`hectareQuantity`}
          rules={{
            required: "La cantidad de hectáreas es requerida",
            min: { value: 0.01, message: "Las hectáreas deben ser positivas" },
          }}
          render={({ field, fieldState }) => (
            <AmountInput
              label="Cantidad de Hectáreas *"
              value={field.value !== undefined ? Number(field.value) : selectedLot?.hectares ?? 0}
              onChange={field.onChange}
              error={fieldState.error?.message}
              locale="es-AR"
              placeholder="0,00"
              step={0.01} // opcional, si tu AmountInput acepta step
            />
          )}
        />

      </div>

      {/* Botones */}
      <div className="flex gap-2 pt-2 w-full">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="flex-1"
        >
          Cancelar
        </Button>

        <Button
          type="button"
          onClick={onSubmit}
          className="flex-1"
        >
          {isEditing ? "Actualizar" : "Agregar"}
        </Button>
      </div>


    </div>
  );
}
