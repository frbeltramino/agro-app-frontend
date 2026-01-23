import { formatCurrency } from "@/lib/currency-formatter-usd";

export interface MobileTableProps {
  data: any[]; // Tu array de lotes
  titleKey?: string; // Qué propiedad mostrar como título (default "name")
}

export const TableSummaryMobile = ({ data, titleKey = "name" }: MobileTableProps) => {

  return (
    <div className="space-y-4">
      {data.map((item, idx) => {
        return (
          <div
            key={idx}
            className="bg-card border border-border rounded-xl p-4 shadow-sm"
          >
            {/* Título y Eficiencia */}
            <div className="flex justify-between items-center mb-2">
              <p className="font-medium text-foreground">{item[titleKey]}</p>
            </div>

            {/* Grid de datos */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-muted-foreground">
              <div>
                <span className="font-semibold">Insumos:</span> {formatCurrency(item.insumos)}
              </div>
              <div>
                <span className="font-semibold">Labores:</span> {formatCurrency(item.labores)}
              </div>
              <div>
                <span className="font-semibold">Cosecha:</span> {formatCurrency(item.cosecha)}
              </div>
              <div>
                <span className="font-semibold">Costo Var.:</span> {formatCurrency(item.costoVariable)}
              </div>
              <div className="col-span-2 font-medium text-primary">
                <span className="font-semibold">Margen Bruto:</span> {formatCurrency(item.margenBruto)}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};