export interface MobileTableProps {
  data: any[]; // Tu array de lotes
  titleKey?: string; // Qué propiedad mostrar como título (default "name")
}

export const TableSummaryMobile = ({ data, titleKey = "name" }: MobileTableProps) => {

  return (
    <div className="space-y-4">
      {data.map((item, idx) => {
        const totalCosto = item.insumos + item.labores + item.cosecha + item.costoVariable;
        const totalIngreso = totalCosto + item.margenBruto;
        const eficiencia = ((item.margenBruto / totalIngreso) * 100).toFixed(1);

        return (
          <div
            key={idx}
            className="bg-card border border-border rounded-xl p-4 shadow-sm"
          >
            {/* Título y Eficiencia */}
            <div className="flex justify-between items-center mb-2">
              <p className="font-medium text-foreground">{item[titleKey]}</p>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                {eficiencia}%
              </span>
            </div>

            {/* Grid de datos */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-muted-foreground">
              <div>
                <span className="font-semibold">Insumos:</span> ${item.insumos.toLocaleString()}
              </div>
              <div>
                <span className="font-semibold">Labores:</span> ${item.labores.toLocaleString()}
              </div>
              <div>
                <span className="font-semibold">Cosecha:</span> ${item.cosecha.toLocaleString()}
              </div>
              <div>
                <span className="font-semibold">Costo Var.:</span> ${item.costoVariable.toLocaleString()}
              </div>
              <div className="col-span-2 font-medium text-primary">
                <span className="font-semibold">Margen Bruto:</span> ${item.margenBruto.toLocaleString()}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};