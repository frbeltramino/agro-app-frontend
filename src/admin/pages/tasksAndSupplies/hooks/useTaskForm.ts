import { useStock } from "@/admin/hooks/useStock";
import { useSupply } from "@/admin/hooks/useSupply";
import { useCropStore } from "@/admin/store/crop.store";
import { parseAmount } from "@/lib/parse-amount";
import { useState } from "react";

export function useTaskForm({

}: any) {

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

  const [step, setStep] = useState(1);
  const [isSaving, setIsSaving] = useState(false);

  const { selectedCrop } = useCropStore();
  const { createSupply } = useSupply({ cropId: selectedCrop?.id || 0 });
  const { adjustStock } = useStock();


  const createPurchaseSupply = async (taskToEdit: any, selectedCrop: any, supply: TaskSupplyForm) => {


    const existingSupply = taskToEdit?.supplies.find(
      (s: TaskSupplyEdit) => s.supply_id === supply.supply_id
    );

    const payload = {
      id: existingSupply?.supply_id ?? null,
      crop_id: selectedCrop!.id,
      master_supply_id: supply.master_supply_id ? Number(supply.master_supply_id) : null,
      name: supply.productName ?? "",
      category_id: Number(supply.categoryId),
      unit: supply.unit ?? "kg",
      dose_per_ha: Number(supply.dosagePerHectare),
      hectares: Number(supply.hectareQuantity),
      price_per_unit: parseAmount(supply.pricePerUnit),
      status: "active",
    };

    const result = await createSupply.mutateAsync(payload);

    return ({
      supply_id: result.supply.id,
      stock_id: null,
      dose_per_ha: Number(supply.dosagePerHectare),
      hectares: Number(supply.hectareQuantity),
      price_per_unit: parseAmount(supply.pricePerUnit),
    });



  }

  const updateStockSupply = async (oldStockSupply: TaskSupplyEdit, newStockMap: Map<number, any>, stock: any) => {
    const oldUsedQuantity = oldStockSupply.dose_per_ha * oldStockSupply.hectares;
    const newS = newStockMap.get(oldStockSupply.stock_id!);

    let quantityToAdjust = 0;

    if (newS) {
      // Suministro actualizado → calcular diferencia
      const newUsedQuantity = Number(newS.dosagePerHectare) * Number(newS.hectareQuantity);
      quantityToAdjust = oldUsedQuantity - newUsedQuantity;

      // Ya procesado → lo eliminamos del map para detectar nuevos al final
      newStockMap.delete(oldStockSupply.stock_id!);
    } else {
      // Suministro eliminado → devolver stock completo
      quantityToAdjust = oldUsedQuantity;
    }

    try {
      const resultStock = await adjustStock.mutateAsync({
        stockId: oldStockSupply.stock_id!,
        quantity: quantityToAdjust,
      });

      // Solo agregamos al array si aún existe en la edición
      if (newS) {
        const selectedStock = stock?.find((itemStock: any) => itemStock.id === Number(newS.stockId)) ?? null;
        return ({
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

  const createNewStockSupply = async (stockSupply: any, stock: any) => {
    const newUsedQuantity = Number(stockSupply.dosagePerHectare) * Number(stockSupply.hectareQuantity);

    try {
      const resultStock = await adjustStock.mutateAsync({
        stockId: Number(stockSupply.stockId!),
        quantity: -newUsedQuantity, // negativo → restar del stock
      });

      const selectedStock = stock?.find((itemStock: any) => itemStock.id === Number(stockSupply.stockId)) ?? null;
      return ({
        supply_id: null,
        stock_id: Number(resultStock.id),
        dose_per_ha: Number(stockSupply.dosagePerHectare),
        hectares: Number(stockSupply.hectareQuantity),
        price_per_unit: parseAmount(selectedStock?.price_per_unit),
      });
    } catch (error: any) {
      const message =
        error?.response?.data?.message || error?.message || "Error desconocido al ajustar el stock";
      throw new Error(message);
    }

    // const newUsedQuantity = Number(s.dosagePerHectare) * Number(s.hectareQuantity);

    // try {
    //   const resultStock = await adjustStock.mutateAsync({
    //     stockId: Number(s.stockId!),
    //     quantity: -newUsedQuantity, // negativo → restar del stock
    //   });

    //   const selectedStock = stock?.find((itemStock) => itemStock.id === Number(s.stockId)) ?? null;
    //   suppliesResult.push({
    //     supply_id: null,
    //     stock_id: Number(resultStock.id),
    //     dose_per_ha: Number(s.dosagePerHectare),
    //     hectares: Number(s.hectareQuantity),
    //     price_per_unit: parseAmount(selectedStock?.price_per_unit),
    //   });
    // } catch (error: any) {
    //   const message =
    //     error?.response?.data?.message || error?.message || "Error desconocido al ajustar el stock";
    //   throw new Error(message);
    // }
  }



  return {
    step,
    setStep,
    isSaving,
    setIsSaving,
    createPurchaseSupply,
    updateStockSupply,
    createNewStockSupply
  };
}
