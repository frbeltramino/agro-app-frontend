
import { Button } from "@/components/ui/button"
import { Edit2, Trash2 } from "lucide-react"
import { Info } from "./InfoMobileTable"
import { formatDate } from "@/lib/format-date"
import { formatCurrency } from "@/lib/currency-formatter-usd";
import { formatTn } from "@/lib/format-tn";

interface VariableExpenseMobileTableProps {
  expenses: any[] // 👈 después lo tipamos mejor si querés
  onEdit: (expense: any) => void
  onDelete: (expense: any) => void
}

export const VariableExpenseMobileTable = ({
  expenses,
  onEdit,
  onDelete,
}: VariableExpenseMobileTableProps) => {
  if (!expenses.length) {
    return (
      <p className="text-sm text-muted-foreground text-center py-6">
        No hay gastos cargados
      </p>
    )
  }

  return (
    <div className="space-y-4 sm:hidden">
      {expenses.map((expense) => (
        <div
          key={expense.id}
          className="rounded-lg border bg-card p-4 space-y-3"
        >
          {/* Header */}
          <div className="flex justify-between items-start gap-2">
            <div>
              <p className="font-semibold">Lote {expense.lot_id}</p>
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
            <Info label="Hectáreas" value={`${formatTn(expense.hectares)} ha`} />
            <Info label="Tn cosechadas" value={`${formatTn(expense.tons_harvested)} tn`} />
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
  )
}
