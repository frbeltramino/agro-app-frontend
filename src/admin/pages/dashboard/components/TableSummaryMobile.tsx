import { formatCurrency } from "@/lib/currency-formatter-usd";
import { formatTn } from "@/lib/format-tn";

export interface MobileTableProps {
  data: any[]; // Tu array de lotes
  titleKey?: string; // Qué propiedad mostrar como título (default "name")
}

export const TableSummaryMobile = ({ data }: MobileTableProps) => {
  return (
    <div className="space-y-4">
      {data.flatMap((lote) =>
        lote.cultivos.map((cultivo: any) => {
          const superficie = lote.superficieHa || 1;

          const perHa = (value: number) => superficie > 0 ? value / superficie : 0;

          const insumosPorHa = perHa(cultivo.insumos);
          const laboresPorHa = perHa(cultivo.labores);
          const cosechaPorHa = perHa(cultivo.cosecha);
          const costoVariablePorHa = perHa(cultivo.costoVariable);

          // Ingresos por ha = cosecha/ha * precio promedio por tonelada
          const ingresosPorHa = cosechaPorHa * (cultivo.precioPromedioPonderado || 0);

          // Margen bruto por ha
          const margenBrutoPorHa = ingresosPorHa - insumosPorHa - laboresPorHa - costoVariablePorHa;

          return (
            <div key={`${lote.id}-${cultivo.cropId}`} className="bg-card border border-border rounded-xl p-4 shadow-sm">
              <p className="font-medium text-foreground mb-2">{lote.lote} - {cultivo.cropName}</p>

              <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                <div className="flex flex-col">
                  <span className="font-semibold">Superficie (ha)</span>
                  <span className="text-foreground">{formatTn(superficie)}</span>
                </div>

                <div className="flex flex-col">
                  <span className="font-semibold">Insumos (U$S/ha)</span>
                  <span className="text-foreground">{formatCurrency(insumosPorHa)}</span>
                </div>

                <div className="flex flex-col">
                  <span className="font-semibold">Labores (U$S/ha)</span>
                  <span className="text-foreground">{formatCurrency(laboresPorHa)}</span>
                </div>

                <div className="flex flex-col">
                  <span className="font-semibold">Cosecha (tn/ha)</span>
                  <span className="text-foreground">{formatTn(cosechaPorHa)}</span>
                </div>

                <div className="flex flex-col">
                  <span className="font-semibold">Precio Promedio (U$S/tn)</span>
                  <span className="text-foreground">{cultivo.precioPromedioPonderado ? formatCurrency(cultivo.precioPromedioPonderado) : "—"}</span>
                </div>

                <div className="flex flex-col">
                  <span className="font-semibold">Costo Variable (U$S/ha)</span>
                  <span className="text-foreground">{formatCurrency(costoVariablePorHa)}</span>
                </div>

                <div className="col-span-2 flex flex-col">
                  <span className="font-semibold">Margen Bruto (U$S/ha)</span>
                  <span className="text-primary font-medium">{margenBrutoPorHa !== 0 ? formatCurrency(margenBrutoPorHa) : "—"}</span>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};