
import { Tractor } from "lucide-react";
import { Crop } from "@/interfaces/report/report.campaign.response";
import { formatCurrency } from "@/lib/currency-formatter-usd";
import { formatTn } from "@/lib/format-tn";
import { formatDate } from "@/lib/format-date";
import { ReportEmptySection } from "./ReportEmptySection";

interface Props {
  crops: Crop[];
}

export const LaborsSection = ({ crops }: Props) => {
  const laborsAndSupplies =
    crops?.flatMap((crop) => crop.laborsAndSupplies) ?? [];

  if (laborsAndSupplies.length === 0) {
    return (
      <ReportEmptySection
        title="Labores e Insumos"
        message="No se registraron labores para esta campaña."
        icon={<Tractor className="w-4 h-4" />}
      />
    );
  }
  return (
    <section className="mb-6">
      <h2 className="report-section-title flex items-center gap-2">
        <Tractor className="w-4 h-4" /> Labores e Insumos
      </h2>

      {laborsAndSupplies.map((labor) => (
        <div key={labor.id} className="mb-4 rounded-lg border border-border overflow-hidden">
          {/* Labor header */}
          <div className="bg-secondary px-4 py-3 flex items-center justify-between">
            <div>
              <p className="font-semibold text-sm">{labor.description}</p>
              <p className="text-xs text-muted-foreground">
                {labor.type} · Proveedor: {labor.provider_name} · Fecha: {labor.performed_at ? formatDate(labor.performed_at) : "-"}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Costo total</p>
              <p className="font-bold text-primary">{formatCurrency(labor.total_price)}</p>
            </div>
          </div>

          {/* Labor cost */}
          <div className="px-4 py-2 text-sm border-b border-border bg-card">
            <span className="text-muted-foreground">Costo de labor:</span>{" "}
            <span className="font-semibold">{formatCurrency(labor.laborCost)}</span>
          </div>

          {/* Supplies table */}
          {labor.supplies.length > 0 && (
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-report-table-header text-report-header-foreground">
                  <th className="text-left px-4 py-2 font-semibold">Insumo</th>
                  <th className="text-left px-4 py-2 font-semibold">Categoría</th>
                  <th className="text-right px-4 py-2 font-semibold">Dosis/Ha</th>
                  <th className="text-right px-4 py-2 font-semibold">Has</th>
                  <th className="text-right px-4 py-2 font-semibold">Total usado</th>
                  <th className="text-right px-4 py-2 font-semibold">Precio/u</th>
                  <th className="text-right px-4 py-2 font-semibold">Subtotal</th>
                  <th className="text-center px-4 py-2 font-semibold">Stock</th>
                </tr>
              </thead>
              <tbody>
                {labor.supplies.map((s, idx) => (
                  <tr key={idx} className="even:bg-report-table-stripe">
                    <td className="px-4 py-2 font-medium">{s.supply_name}</td>
                    <td className="px-4 py-2">{s.category_name}</td>
                    <td className="px-4 py-2 text-right">
                      {formatTn(s.dose_per_ha)} {s.unit}
                    </td>
                    <td className="px-4 py-2 text-right">{formatTn(s.hectares)}</td>
                    <td className="px-4 py-2 text-right">
                      {formatTn(s.total_used)} {s.unit}
                    </td>
                    <td className="px-4 py-2 text-right">{formatCurrency(s.price_per_unit)}</td>
                    <td className="px-4 py-2 text-right font-semibold">
                      {formatCurrency(s.total_used * s.price_per_unit)}
                    </td>
                    <td className="px-4 py-2 text-center">
                      {s.from_stock ? (
                        <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                          Sí
                        </span>
                      ) : (
                        "No"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      ))}
    </section>
  );
};

