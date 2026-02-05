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

  const toggleLot = (lotId: number) => {
    setOpenLots(prev => ({
      ...prev,
      [lotId]: !prev[lotId],
    }));
  };

  if (!expensesByLot.length) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>No hay gastos variables para esta campaña</p>
      </div>
    );
  }

  return (
    <>
      {expensesByLot.map((lot) => {
        const isOpen = openLots[lot.lotId]; // 🔹 ya no usamos ?? true

        return (
          <div key={lot.lotId} className="mb-8 hidden sm:block">
            {/* Header con toggle */}
            <div
              className="flex justify-between items-center p-3 cursor-pointer bg-muted/20 rounded-t-lg shadow-sm"
              onClick={() => toggleLot(lot.lotId)}
            >
              <p className="font-semibold text-lg">Lote {lot.lotName}</p>
              <ChevronDown
                className={`h-5 w-5 transform transition-transform duration-300 ${isOpen ? "rotate-180" : "rotate-0"
                  }`}
              />
            </div>

            {/* Contenedor de la tabla con transición de altura */}
            <div
              className={`overflow-hidden transition-all duration-300 ${isOpen ? "max-h-[2000px]" : "max-h-0"
                }`}
            >
              <div className="rounded-b-lg border border-t-0 bg-card">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="font-semibold">Hectáreas</TableHead>
                      <TableHead className="font-semibold">Tn Cosechadas</TableHead>
                      <TableHead className="font-semibold">Tipo</TableHead>
                      <TableHead className="font-semibold">Prestador</TableHead>
                      <TableHead className="font-semibold">Fecha</TableHead>
                      <TableHead className="font-semibold text-right">Monto</TableHead>
                      <TableHead className="w-[100px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {lot.expenses.map((expense) => (
                      <TableRow key={expense.id} className="hover:bg-muted/30">
                        <TableCell>{formatTn(expense.hectares)} ha</TableCell>
                        <TableCell>{formatTn(expense.tons_harvested)} tn</TableCell>
                        <TableCell>{expense.expense_type_name}</TableCell>
                        <TableCell>{expense.provider || "-"}</TableCell>
                        <TableCell>{formatDate(expense.expense_date) || "-"}</TableCell>
                        <TableCell className="text-right font-semibold">
                          {formatCurrency(expense.amount || 0)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 justify-end">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-primary"
                              onClick={() => onEdit(expense)}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="icon"
                              className="h-8 w-8 text-white hover:text-destructive"
                              onClick={() => onDelete(expense)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        );
      })}
      <div className="sm:hidden">
        {/* Mobile */}
        <VariableExpenseMobileTable
          expensesByLot={expensesByLot}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </div>
    </>
  );
};
