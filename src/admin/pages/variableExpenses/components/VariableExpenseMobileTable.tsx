import { Button } from "@/components/ui/button";
import { ChevronDown, Edit2, Trash2 } from "lucide-react";
import { Info } from "./InfoMobileTable";
import { formatDate } from "@/lib/format-date";
import { formatCurrency } from "@/lib/currency-formatter-usd";
import { formatTn } from "@/lib/format-tn";
import { Datum } from "@/interfaces/variableExpenses/variable.expenses.response";
import { useState } from "react";
import { CustomNoResultsCard } from "@/components/custom/CustomNoResultsCard";

interface VariableExpenseMobileTableProps {
  expensesByLot: Datum[];
  onEdit: (expense: any) => void;
  onDelete: (expense: any) => void;
}

export const VariableExpenseMobileTable = ({
  expensesByLot,
  onEdit,
  onDelete,
}: VariableExpenseMobileTableProps) => {

  const [openLots, setOpenLots] = useState<{ [lotId: number]: boolean }>(
    () => Object.fromEntries(expensesByLot.map(l => [l.lotId, false]))
  );

  const [openCrops, setOpenCrops] = useState<{
    [lotId: number]: { [cropId: number]: boolean }
  }>({});

  const toggleLot = (lotId: number) => {
    setOpenLots(prev => ({ ...prev, [lotId]: !prev[lotId] }));
  };

  const toggleCrop = (lotId: number, cropId: number) => {
    setOpenCrops(prev => {
      const lot = prev[lotId] ?? {};
      const current = lot[cropId] ?? false;

      return {
        ...prev,
        [lotId]: {
          ...lot,
          [cropId]: !current
        }
      };
    });
  };

  if (!expensesByLot.length) {
    return (
      <CustomNoResultsCard
        title="No hay gastos variables cargados para esta campaña"
        message="Necesita tener cosechas en la campaña para poder crear los gastos variables."

      />
    );
  }

  // Agrupamos por lote -> cultivo
  const groupedByLotAndCrop = expensesByLot.map(lot => {
    const cropsMap: { [cropId: number]: { cropName: string; expenses: typeof lot.expenses } } = {};
    lot.expenses.map(exp => {
      if (!cropsMap[exp.crop_id]) {
        cropsMap[exp.crop_id] = { cropName: exp.crop_name, expenses: [] };
      }
      cropsMap[exp.crop_id].expenses.push(exp);
    });
    return {
      lotId: lot.lotId,
      lotName: lot.lotName,
      crops: Object.entries(cropsMap).map(([cropId, { cropName, expenses }]) => ({
        cropId: Number(cropId),
        cropName,
        expenses
      }))
    };
  });


  return (
    <div className="sm:hidden space-y-6">
      {groupedByLotAndCrop.map(lot => {
        const isLotOpen = openLots[lot.lotId];

        return (
          <div key={lot.lotId}>
            {/* Header del lote */}
            <div
              className="flex justify-between items-center mb-2 p-2 bg-card rounded-lg cursor-pointer shadow-sm select-none"
              onClick={() => toggleLot(lot.lotId)}
            >
              <p className="font-semibold text-lg">Lote {lot.lotName}</p>
              <ChevronDown
                className={`h-4 w-4 transform transition-transform duration-300 ${isLotOpen ? "rotate-180" : "rotate-0"}`}
              />
            </div>

            {isLotOpen && (
              <div className="space-y-4 pl-2">
                {lot.crops.map(crop => {
                  const isCropOpen = openCrops[lot.lotId]?.[crop.cropId];

                  return (
                    <div key={crop.cropId}>
                      {/* Header del cultivo */}
                      <div
                        className="flex justify-between items-center mb-2 p-2  bg-card rounded-lg cursor-pointer shadow-sm select-none"
                        onClick={() => toggleCrop(lot.lotId, crop.cropId)}
                      >
                        <p className="font-semibold text-md">Cultivo: {crop.cropName}</p>
                        <ChevronDown
                          className={`h-4 w-4 transform transition-transform duration-300 ${isCropOpen ? "rotate-180" : "rotate-0"}`}
                        />
                      </div>

                      {/* Cards individuales */}
                      {isCropOpen && (
                        <div className="space-y-4 pl-2">
                          {crop.expenses.map(expense => (
                            <div
                              key={expense.id}
                              className="rounded-lg border bg-card p-4 space-y-3 shadow-sm"
                            >
                              {/* Header */}
                              <div className="flex justify-between items-start gap-2">
                                <div>
                                  <p className="font-semibold">Lote {expense.lotName}</p>
                                  <p className="text-sm text-muted-foreground">{formatDate(expense.expense_date)}</p>
                                </div>

                                <p className="font-semibold text-right whitespace-nowrap">{formatCurrency(expense.amount)}</p>
                              </div>

                              {/* Data */}
                              <div className="grid grid-cols-2 gap-2 text-sm">
                                <Info label="Hectáreas" value={`${formatTn(expense.hectares)} ha`} />
                                <Info label="Tn cosechadas" value={`${formatTn(expense.tons_harvested)} tn`} />
                                <Info label="Tipo" value={expense.expense_type_name} />
                                <Info label="Prestador" value={expense.provider || "-"} />
                              </div>

                              {/* Actions */}
                              <div className="flex justify-end gap-2 pt-2">
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEdit(expense)}>
                                  <Edit2 className="h-4 w-4" />
                                </Button>

                                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => onDelete(expense)}>
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
