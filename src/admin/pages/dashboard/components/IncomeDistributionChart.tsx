import { useTheme } from "@/context/theme-context";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useIsMobile } from "@/admin/hooks/useIsMobile";
import { useWindowWidth } from "@/admin/hooks/useWindowWidth";
import { Lote } from "@/interfaces/lotsStats/lots.stats.response";


interface IncomeDistributionChartProps {
  data: Lote[];
}


const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    // Separate costs from margin
    const costItems = payload.filter((p: any) => p.dataKey !== "margenBruto");
    const marginItem = payload.find((p: any) => p.dataKey === "margenBruto");
    const totalCostos = costItems.reduce((sum: number, entry: any) => sum + entry.value, 0);

    return (
      <div className="bg-card border border-border rounded-xl shadow-soft p-4 min-w-[220px]">
        <p className="font-display font-semibold text-foreground mb-3 text-lg">{label}</p>

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
                  <span className="text-sm text-muted-foreground">{entry.name}</span>
                </div>
                <span className="font-medium text-foreground">
                  ${entry.value.toLocaleString()}
                </span>
              </div>
            ))}
            <div className="flex items-center justify-between pt-1 border-t border-border/50">
              <span className="text-sm font-medium text-muted-foreground">Total Costos</span>
              <span className="font-semibold text-foreground">${totalCostos.toLocaleString()}</span>
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
              <span className="font-bold text-primary text-lg">
                ${marginItem.value.toLocaleString()}
              </span>
            </div>
          </div>
        )}
      </div>
    );
  }
  return null;
};

const CustomLegend = ({ payload }: any) => {
  // Group legend items
  const costItems = payload?.filter((p: any) => p.dataKey !== "margenBruto") || [];
  const marginItem = payload?.find((p: any) => p.dataKey === "margenBruto");

  return (
    <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mt-4">
      <div className="flex items-center gap-4">
        <span className="text-xs font-medium text-muted-foreground uppercase">Costos:</span>
        {costItems.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-1.5">
            <div
              className="w-3 h-3 rounded-sm"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm text-muted-foreground">{entry.value}</span>
          </div>
        ))}
      </div>
      {marginItem && (
        <div className="flex items-center gap-1.5">
          <div
            className="w-3 h-3 rounded-sm"
            style={{ backgroundColor: marginItem.color }}
          />
          <span className="text-sm font-medium text-foreground">{marginItem.value}</span>
        </div>
      )}
    </div>
  );
};

export const IncomeDistributionChart = ({ data }: IncomeDistributionChartProps) => {

  const width = useWindowWidth();
  const { theme } = useTheme();
  const darkMode = theme === "dark";
  const isMobile = useIsMobile();
  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-[500px]">
        <ResponsiveContainer width="100%" height={420} key={width}>
          <BarChart
            data={data}
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
              tickFormatter={(value: string) =>
                isMobile
                  ? value.length > 10
                    ? value.slice(0, 10) + "…" // cortar nombres largos
                    : value
                  : value
              }

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
            <Legend content={<CustomLegend />} />

            {/* Stacked Cost Bar */}
            <Bar
              dataKey="insumos"
              name="Insumos"
              stackId="costos"
              fill="var(--chart-insumos)"
              radius={[0, 0, 0, 0]}
            />
            <Bar
              dataKey="labores"
              name="Labores"
              stackId="costos"
              fill="var(--chart-labores)"
              radius={[0, 0, 0, 0]}
            />
            <Bar
              dataKey="cosecha"
              name="Cosecha"
              stackId="costos"
              fill="var(--chart-cosecha)"
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
            <Bar
              dataKey="margenBruto"
              name="Margen Bruto"
              fill="var(--chart-margin)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
