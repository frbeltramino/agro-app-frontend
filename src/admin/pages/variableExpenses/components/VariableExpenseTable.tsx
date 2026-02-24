import { ChevronDown, Edit2, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Datum, VariableExpense } from "@/interfaces/variableExpenses/variable.expenses.response";
import { VariableExpenseMobileTable } from "./VariableExpenseMobileTable";
import { formatDate } from "@/lib/format-date"
import { formatCurrency } from "@/lib/currency-formatter-usd";
import { formatTn } from "@/lib/format-tn";
import { useState } from "react";
import { CustomNoResultsCard } from "@/components/custom/CustomNoResultsCard";




interface VariableExpenseTableProps {
  expensesByLot: Datum[];
  expensesPagination: any;
  onEdit: (expense: VariableExpense) => void;
  onDelete: (expense: VariableExpense) => void;
}

export const VariableExpenseTable = ({
  expensesByLot,
  onEdit,
  onDelete,
}: VariableExpenseTableProps) => {

  const [openLots, setOpenLots] = useState<{ [lotId: number]: boolean }>(
    () => Object.fromEntries(expensesByLot.map(l => [l.lotId, false]))
  );

  const [openCrops, setOpenCrops] = useState<{ [lotId: number]: { [cropId: number]: boolean } }>(
    () => Object.fromEntries(
      expensesByLot.map(l => [l.lotId, {}])
    )
  );

  const toggleLot = (lotId: number) => {
    setOpenLots(prev => ({ ...prev, [lotId]: !prev[lotId] }));
  };

  const toggleCrop = (lotId: number, cropId: number) => {
    setOpenCrops(prev => ({
      ...prev,
      [lotId]: {
        ...(prev[lotId] || {}),
        [cropId]: !prev[lotId]?.[cropId]
      }
    }));
  };

  if (!expensesByLot.length) {
    return (

      <CustomNoResultsCard
        title="No hay gastos variables cargados para esta campaña"
        message="Necesita tener cosechas en la campaña para poder crear los gastos variables."

      />
    );
  }

  // Agrupar gastos por lote y cultivo
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
    <>
      {groupedByLotAndCrop.map(lot => {
        const isLotOpen = openLots[lot.lotId];

        return (
          <div key={lot.lotId} className="mb-8 hidden sm:block">
            {/* Header Lote */}
            <div
              className="
                flex justify-between items-center p-3 cursor-pointer 
                rounded-t-lg shadow-sm
                bg-card  dark:bg-card 
                hover:bg-card/70 dark:hover:bg-card/70
                border border-gray-200 dark:border-gray-700
  "
              onClick={() => toggleLot(lot.lotId)}
            >
              <p className="font-semibold text-lg">Lote {lot.lotName}</p>
              <ChevronDown
                className={`h-5 w-5 transform transition-transform duration-300 ${isLotOpen ? "rotate-180" : "rotate-0"}`}
              />
            </div>

            {/* Contenedor de tabla por lote */}
            {isLotOpen && (
              <div className="overflow-hidden transition-all duration-300">
                {lot.crops.map(crop => {
                  const isCropOpen = openCrops[lot.lotId]?.[crop.cropId];

                  return (
                    <div key={crop.cropId} className="border-b last:border-b-0">
                      {/* Header cultivo */}
                      <div
                        className="
                        flex justify-between items-center p-2 cursor-pointer 
                       bg-card  dark:bg-card 
                         hover:bg-card/70 dark:hover:bg-card/70
                        shadow-sm border border-gray-300 dark:border-gray-600
                      "
                        onClick={() => toggleCrop(lot.lotId, crop.cropId)}
                      >
                        <p className="font-semibold text-md">Cultivo: {crop.cropName}</p>
                        <ChevronDown
                          className={`h-4 w-4 transform transition-transform duration-300 ${isCropOpen ? "rotate-180" : "rotate-0"}`}
                        />
                      </div>

                      {/* Tabla de gastos por cultivo */}
                      {isCropOpen && (
                        <div className="rounded-b-lg border border-t-0 bg-card">
                          <Table>
                            <TableHeader>
                              <TableRow className="bg-muted/50">
                                <TableHead className="font-semibold">Hectáreas</TableHead>
                                <TableHead className="font-semibold">Tn Cosechadas</TableHead>
                                <TableHead className="font-semibold">Tipo</TableHead>
                                <TableHead className="font-semibold">Prestador</TableHead>
                                <TableHead className="font-semibold">Fecha</TableHead>
                                <TableHead className="font-semibold text-right">USD/tn</TableHead>
                                <TableHead className="w-[100px]"></TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {crop.expenses.map(expense => (
                                <TableRow key={expense.id} className="hover:bg-muted/30">
                                  <TableCell>{formatTn(expense.hectares)} ha</TableCell>
                                  <TableCell>{formatTn(expense.tons_harvested)} tn</TableCell>
                                  <TableCell>{expense.expense_type_name}</TableCell>
                                  <TableCell>{expense.provider || "-"}</TableCell>
                                  <TableCell>{formatDate(expense.expense_date) || "-"}</TableCell>
                                  <TableCell className="text-right font-semibold">{formatCurrency(expense.amount || 0)}</TableCell>
                                  <TableCell>
                                    <div className="flex items-center gap-1 justify-end">
                                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEdit(expense)}>
                                        <Edit2 className="h-4 w-4" />
                                      </Button>
                                      <Button variant="destructive" size="icon" className="h-8 w-8 text-white hover:text-destructive" onClick={() => onDelete(expense)}>
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
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

      {/* Mobile */}
      <div className="sm:hidden">
        <VariableExpenseMobileTable
          expensesByLot={expensesByLot}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </div>
    </>
  );
};
