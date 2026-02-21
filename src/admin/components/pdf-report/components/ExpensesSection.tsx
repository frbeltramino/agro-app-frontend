
import { DollarSign } from "lucide-react";
import { Crop } from "@/interfaces/report/report.campaign.response";
import { ReportEmptySection } from "./ReportEmptySection";
import { formatCurrency } from "@/lib/currency-formatter-usd";
import { formatDate } from "@/lib/format-date";

interface Props {
  crops: Crop[];
}

export const ExpensesSection = ({ crops }: Props) => {

  const variableExpenses = crops?.flatMap((crop) => crop.variableExpenses) ?? [];

  // Si no hay gastos, mostramos la sección de vacío
  if (variableExpenses.length === 0) {
    return (
      <ReportEmptySection
        title="Gastos Variables"
        message="No se registraron gastos variables para esta campaña."
        icon={<DollarSign className="w-4 h-4" />}
      />
    );
  }

  // Total de gastos
  const totalExpenses = variableExpenses.reduce(
    (sum, exp) => sum + exp.amount,
    0
  );

  return (
    <section className="mb-6">
      <h2 className="report-section-title flex items-center gap-2">
        <DollarSign className="w-4 h-4" /> Gastos Variables
      </h2>
      <div className="overflow-hidden rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-report-table-header text-report-header-foreground">
              <th className="text-left px-4 py-2.5 font-semibold">Lote</th>
              <th className="text-left px-4 py-2.5 font-semibold">Cultivo</th>
              <th className="text-left px-4 py-2.5 font-semibold">Tipo</th>
              <th className="text-left px-4 py-2.5 font-semibold">Proveedor</th>
              <th className="text-left px-4 py-2.5 font-semibold">Fecha</th>
              <th className="text-right px-4 py-2.5 font-semibold">Monto (USD)</th>
            </tr>
          </thead>
          <tbody>
            {variableExpenses.map((exp) => (
              <tr key={exp.id} className="even:bg-report-table-stripe">
                <td className="px-4 py-2.5">{exp.lotName}</td>
                <td className="px-4 py-2.5">{exp.crop_name}</td>
                <td className="px-4 py-2.5">{exp.expense_type_name}</td>
                <td className="px-4 py-2.5">{exp.provider}</td>
                <td className="px-4 py-2.5">{exp.expense_date ? formatDate(exp.expense_date) : "-"}</td>
                <td className="px-4 py-2.5 text-right font-semibold">
                  {formatCurrency(exp.amount)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-secondary font-bold">
              <td colSpan={5} className="px-4 py-2.5 text-right">Total US$/ha</td>
              <td className="px-4 py-2.5 text-right text-primary">
                {formatCurrency(totalExpenses)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </section>
  );
};

