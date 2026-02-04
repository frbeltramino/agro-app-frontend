import { Edit2, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { VariableExpense } from "@/interfaces/variableExpenses/variable.expenses.response";
import { VariableExpenseMobileTable } from "./VariableExpenseMobileTable";
import { formatDate } from "@/lib/format-date"
import { formatCurrency } from "@/lib/currency-formatter-usd";
import { formatTn } from "@/lib/format-tn";




interface VariableExpenseTableProps {
  expenses: VariableExpense[];
  expensesPagination: any;
  onEdit: (expense: VariableExpense) => void;
  onDelete: (expense: VariableExpense) => void;
}

export const VariableExpenseTable = ({
  expenses,
  onEdit,
  onDelete,
}: VariableExpenseTableProps) => {



  if (expenses.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>No hay gastos variables para esta campaña</p>
      </div>
    );
  }

  return (
    <>
      <div className="hidden sm:block rounded-lg border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="font-semibold">Lote</TableHead>
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
            {expenses.map((expense) => (
              <TableRow key={expense.id} className="hover:bg-muted/30">
                <TableCell className="font-medium">
                  Lote {expense.lot_id}
                </TableCell>
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
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
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
      </div >

      <VariableExpenseMobileTable
        expenses={expenses}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </>

  );
};
