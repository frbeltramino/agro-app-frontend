import { Button } from "@/components/ui/button";
import { ChevronDown, Edit2, Trash2 } from "lucide-react";
import { Info } from "./InfoMobileTable";
import { formatDate } from "@/lib/format-date";
import { formatCurrency } from "@/lib/currency-formatter-usd";
import { formatTn } from "@/lib/format-tn";
import { Datum } from "@/interfaces/variableExpenses/variable.expenses.response";
import { useState } from "react";

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

  const toggleLot = (lotId: number) => {
    setOpenLots((prev) => ({
      ...prev,
      [lotId]: !prev[lotId] && prev[lotId] !== false ? false : !prev[lotId],
    }));
  };

  if (!expensesByLot.length) {
    return (
      <p className="text-sm text-muted-foreground text-center py-6">
        No hay gastos cargados
      </p>
    );
  }

  return (
    <div className="sm:hidden space-y-6">
      {expensesByLot.map((lot) => {
        const isOpen = openLots[lot.lotId]; // 🔹 ahora ya no usamos ?? true

        return (
          <div key={lot.lotId}>
            {/* Header del lote */}
            <div
              className="flex justify-between items-center mb-2 p-2 bg-card rounded-lg cursor-pointer shadow-sm select-none"
              onClick={() => toggleLot(lot.lotId)}
            >
              <p className="font-semibold text-lg">Lote {lot.lotName}</p>
              <ChevronDown
                className={`h-4 w-4 transform transition-transform duration-300 ${isOpen ? "rotate-180" : "rotate-0"
                  }`}
              />
            </div>

            {/* Cards individuales */}
            {isOpen && (
              <div className="space-y-4">
                {lot.expenses.map((expense) => (
                  <div
                    key={expense.id}
                    className="rounded-lg border bg-card p-4 space-y-3 shadow-sm"
                  >
                    {/* Header */}
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <p className="font-semibold">Lote {expense.lotName}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(expense.expense_date)}
                        </p>
                      </div>

                      <p className="font-semibold text-right whitespace-nowrap">
                        {formatCurrency(expense.amount)}
                      </p>
                    </div>

                    {/* Data */}
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <Info
                        label="Hectáreas"
                        value={`${formatTn(expense.hectares)} ha`}
                      />
                      <Info
                        label="Tn cosechadas"
                        value={`${formatTn(expense.tons_harvested)} tn`}
                      />
                      <Info label="Tipo" value={expense.expense_type_name} />
                      <Info label="Prestador" value={expense.provider || "-"} />
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-2 pt-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => onEdit(expense)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive"
                        onClick={() => onDelete(expense)}
                      >
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
  );
};
