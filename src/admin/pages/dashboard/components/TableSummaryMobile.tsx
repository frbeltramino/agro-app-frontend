import { formatCurrency } from "@/lib/currency-formatter-usd";
import { formatTn } from "@/lib/format-tn";

export interface MobileTableProps {
  data: any[]; // Tu array de lotes
  titleKey?: string; // Qué propiedad mostrar como título (default "name")
}

export const TableSummaryMobile = ({ data, titleKey = "name" }: MobileTableProps) => {

  console.log(data)
  return (
    <div className="space-y-4">
      {data.map((item, idx) => {
        const insumosPorHa = item.insumos / item.superficieHa;
        const laboresPorHa = item.labores / item.superficieHa;
        const cosechaPorHa = item.cosecha / item.superficieHa;
        const ingresosPorHa = cosechaPorHa * (item.precioPromedio ? item.precioPromedio : 0);
        const costoVariablePorHa = 0;
        let margenBrutoPorHa = 0;
        if (item.precioPromedio > 0 && cosechaPorHa > 0) {//si hay al menos una venta en el lote se saca margen brutno sino no
          margenBrutoPorHa =
            (ingresosPorHa || 0) - (insumosPorHa || 0) - (laboresPorHa || 0) - (costoVariablePorHa || 0);
        }

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
            <div className="grid grid-cols-2 gap-x-4 gap-y-4 text-sm text-muted-foreground">
              <div className="flex flex-col items-start">
                <span className="font-semibold">Superficie (ha)</span>
                <span className="text-foreground">{formatTn(item.superficieHa)} ha</span>
              </div>
              <div className="flex flex-col items-start">
                <span className="font-semibold">Insumos (U$S/ha)</span>
                <span className="text-foreground">{formatCurrency(insumosPorHa)}</span>
              </div>
              <div className="flex flex-col items-start">
                <span className="font-semibold">Labores (U$S/ha)</span>
                <span className="text-foreground">{formatCurrency(laboresPorHa)}</span>
              </div>
              <div className="flex flex-col items-start">
                <span className="font-semibold">Cosecha (tn/ha)</span>
                <span className="text-foreground">{formatTn(cosechaPorHa)} tn</span>
              </div>
              <div className="flex flex-col items-start">
                <span className="font-semibold">Costo Var. (U$S/ha)</span>
                <span className="text-foreground">{formatCurrency(costoVariablePorHa)}</span>
              </div>
              <div className="flex flex-col items-start">
                <span className="font-semibold">Ingresos (U$S/ha)</span>
                <span className="text-foreground">{formatCurrency(ingresosPorHa)}</span>
              </div>
              <div className="flex flex-col items-start">
                <span className="font-semibold">Precio Promedio (U$S/tn)</span>
                <span className="text-foreground">{item.precioPromedio > 0 ? formatCurrency(item.precioPromedio) : "—"}</span>
              </div>
              <div className="col-span-2 flex flex-col items-start font-medium text-primary">
                <span className="font-semibold">Margen Bruto (U$S/ha)</span>
                <span>{margenBrutoPorHa != 0 ? formatCurrency(margenBrutoPorHa) : "—"}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};