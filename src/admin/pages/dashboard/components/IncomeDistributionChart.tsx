import { useTheme } from "@/context/theme-context";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useIsMobile } from "@/admin/hooks/useIsMobile";
import { useWindowWidth } from "@/admin/hooks/useWindowWidth";
import { Lote } from "@/interfaces/lotsStats/lots.stats.response";
import { formatCurrency } from "@/lib/currency-formatter-usd";



interface IncomeDistributionChartProps {
  data: Lote[];
}
interface Nivel {
  label: string;
  color: string;
}

interface CustomLegendProps {
  niveles: Nivel[];
}

const normalizeLotsData = (data: Lote[]) => {
  const categoriasSet = new Set<string>();

  const normalized = data.map((lote) => {
    const categoriasObj: Record<string, number> = {};
    const superficie = lote.superficieHa || 0;

    // ----- INSUMOS POR CATEGORÍA ($/ha)
    lote.insumosPorCategoria.forEach((i) => {
      categoriasSet.add(i.categoria);

      const valorPorHa =
        superficie > 0 ? i.total / superficie : 0;

      categoriasObj[i.categoria] = Number(valorPorHa.toFixed(2));
    });

    // ----- COSTOS ($/ha)
    const insumosPorHa =
      superficie > 0 ? lote.insumos / superficie : 0;

    const laboresPorHa =
      superficie > 0 ? lote.labores / superficie : 0;

    // const costoVariablePorHa =
    //   superficie > 0 ? lote.costoVariable / superficie : 0;

    const costoVariablePorHa = 0;

    const totalCostosPorHa =
      insumosPorHa + laboresPorHa + costoVariablePorHa;

    // ----- INGRESOS ($/ha)
    const rendimientoPorHa =
      superficie > 0 ? lote.cosecha / superficie : 0;

    const ingresosPorHa =
      rendimientoPorHa * lote.precioPromedio;

    // ----- MARGEN BRUTO ($/ha)
    const margenBrutoPorHa =
      ingresosPorHa - totalCostosPorHa;

    // además, agregamos un flag para saber si mostrar la barra
    const showMargin = ingresosPorHa > 0;

    return {
      ...lote,
      insumos: Number(insumosPorHa.toFixed(2)),
      labores: Number(laboresPorHa.toFixed(2)),
      costoVariable: Number(costoVariablePorHa.toFixed(2)),
      ingresos: Number(ingresosPorHa.toFixed(2)),
      margenBruto: Number(margenBrutoPorHa.toFixed(2)),
      showMargin,
      ...categoriasObj,
    };
  });

  return {
    data: normalized,
    categorias: Array.from(categoriasSet),
  };
};


const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    // Separate costs from margin
    const costItems = payload.filter((p: any) => {
      if (p.dataKey === "margenBruto") return false;
      if (p.dataKey === "insumos") return false;
      if (p.dataKey === "cosecha") return false;
      return true;
    });
    const marginItem = payload.find(
      (p: any) => p.dataKey === "margenBruto" && p.payload.ingresos > 0
    );
    const totalCostos = costItems.reduce(
      (sum: number, entry: any) => sum + entry.value,
      0
    );

    //const cosechaTn = payload[0]?.payload?.cosecha;

    return (
      <div className="bg-card border border-border rounded-xl shadow-soft p-4 min-w-[220px]">
        <p className="font-display font-semibold text-foreground mb-1 text-lg">
          {label}
        </p>
        <p className="text-sm text-muted-foreground mb-3">
          {payload[0]?.payload?.superficieHa} ha
        </p>

        {/* Costos Section */}
        <div className="mb-3">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Costos</p>
          <div className="space-y-1.5">
            {costItems.map((entry: any, index: number) => (
              <div key={index} className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: entry.fill }}
                  />
                  <span className="text-sm text-muted-foreground">
                    {entry.name}
                  </span>
                </div>
                <span className="font-medium text-foreground">
                  {formatCurrency(entry.value)}/ha
                </span>
              </div>
            ))}


            <div className="flex items-center justify-between pt-1 border-t border-border/50">
              <span className="text-sm font-medium text-muted-foreground">Total Costos</span>
              <span className="font-semibold text-foreground">{formatCurrency(totalCostos)}/ha</span>
            </div>
          </div>
        </div>

        {/* Margin Section */}
        {marginItem && (
          <div className="pt-3 border-t border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: marginItem.fill }}
                />
                <span className="text-sm font-medium text-foreground">{marginItem.name}</span>
              </div>
              <span className="font-medium text-primary">
                {formatCurrency(marginItem.value)}/ha
              </span>
            </div>

          </div>
        )}
      </div>
    );
  }
  return null;
};

const CustomLegend = ({ niveles }: CustomLegendProps) => (
  <div className="flex flex-wrap gap-4 items-center">
    {niveles.map((nivel) => (
      <div key={nivel.label} className="flex items-center gap-1.5">
        <div
          className="w-3 h-3 rounded-sm"
          style={{ backgroundColor: nivel.color }}
        />
        <span className="text-sm text-muted-foreground">{nivel.label}</span>
      </div>
    ))}
  </div>
);

export const IncomeDistributionChart = ({ data }: IncomeDistributionChartProps) => {

  const { data: chartData, categorias } = normalizeLotsData(data);

  const width = useWindowWidth();
  const { theme } = useTheme();
  const darkMode = theme === "dark";
  const isMobile = useIsMobile();
  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-[500px]">
        <ResponsiveContainer width="100%" height={420} key={width}>
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            barGap={8}
            barCategoryGap="25%"
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke={darkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}
            />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{
                fill: darkMode ? "#FFFFFF" : "#222222", // blanco en dark, oscuro en light
                fontSize: 13,
              }}
              dy={isMobile ? 10 : 20} // mueve los ticks en mobile
              interval={0} // muestra todos los ticks
              tickFormatter={(value: string, index: number) => {
                const ha = chartData[index]?.superficieHa;

                const label = `${value} (${ha} ha)`;

                if (isMobile) {
                  return label.length > 12 ? label.slice(0, 12) + "…" : label;
                }

                return label;
              }}

            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{
                fill: darkMode ? "#FFFFFF" : "#222222",
                fontSize: 12,
              }}
              tickFormatter={(value) => `$${value}`}
              dx={-10}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)" }} />


            {/* Stacked Cost Bar */}


            {categorias.map((categoria) => (
              <Bar
                key={categoria}
                dataKey={categoria}
                name={categoria}
                stackId="costos"
                fill="var(--chart-insumos)"
              />))}

            <Bar
              dataKey="labores"
              name="Labores"
              stackId="costos"
              fill="var(--chart-labores)"
              radius={[0, 0, 0, 0]}
            />
            <Bar
              dataKey="costoVariable"
              name="Costo Variable"
              stackId="costos"
              fill="var(--chart-variable)"
              radius={[4, 4, 0, 0]}
            />

            {/* Margin Bar (separate) */}
            {chartData.map((lote) =>
              lote.showMargin ? (
                <Bar
                  key={`margen-${lote.id}`}
                  dataKey="margenBruto"
                  name="Margen Bruto"
                  fill="var(--chart-margin)"
                  radius={[4, 4, 0, 0]}
                />
              ) : null
            )}


          </BarChart>

        </ResponsiveContainer>
        <div>
          <div className="mt-4 pb-2">
            <CustomLegend
              niveles={[
                { label: "Insumos", color: "var(--chart-insumos)" },
                { label: "Labores", color: "var(--chart-labores)" },
                { label: "Costo Variable", color: "var(--chart-variable)" },
                { label: "Margen Bruto", color: "var(--chart-margin)" },
              ]}
            />
          </div>
        </div>

      </div>

    </div>
  );
}
