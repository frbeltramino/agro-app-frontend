import { useState } from "react";
import { TrendingUp, Wallet, PiggyBank, Target } from "lucide-react";

import { StatCard } from "../components/StatCard";
import { ChartCard } from "../components/ChartCard";
import { ViewToggle } from "../components/ViewToggle";
import { IncomeDistributionChart } from "../components/IncomeDistributionChart";
import { InsightCard } from "../components/InsightCard";
import { TableSummaryMobile } from "../components/TableSummaryMobile";
import { PageHeader } from "@/admin/components/PageHeader";
import { useLotsStats } from "@/admin/hooks/useLotsStats";
import { formatCurrency } from "@/lib/currency-formatter-usd";

export interface LotData {
  id: string;
  lote: string;
  cultivo: string;
  superficieHa: number;

  insumos: number;
  labores: number;
  cosecha: number;
  costoVariable: number;
  margenBruto: number;
}



const viewOptions = [
  { value: "lote", label: "Por Lote" },
  { value: "campana", label: "Por Campaña" },
];

export const Dashboard = () => {
  const [view, setView] = useState("lote");


  const { data: lotsStatsData } = useLotsStats({ campaignId: 1 });

  const lotData = lotsStatsData?.lotes || [];

  const currentData = view === "lote"
    ? lotData.map(lot => ({
      ...lot,
      name: `${lot.lote}`, // Esto se muestra en el chart y tabla
    }))
    : [];


  return (
    <div className="container mx-auto p-6 space-y-6">
      <PageHeader title="Dashboard" subtitle="Gestiona las estadísticas de tus lotes" />

      <main className="grid gap-4 grid-cols-1 space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Ingreso Total"
            value={formatCurrency(1000)}
            subtitle="Suma de todos los cultivos"
            icon={Wallet}
            variant="primary"
          />
          <StatCard
            title="Margen Bruto Total"
            value={formatCurrency(1000)}
            icon={TrendingUp}
            trend={{ value: 12.5, isPositive: true }}
          />
          <StatCard
            title="Costos Totales"
            value={formatCurrency(1000)}
            subtitle={`Insumos + Labores + Cosecha + Variable`}
            icon={PiggyBank}
          />
          <StatCard
            title="Eficiencia Promedio"
            value={formatCurrency(1000)}
            subtitle="Margen / Ingreso"
            icon={Target}
            variant="secondary"
          />
        </div>

        {/* Main Chart */}
        <ChartCard
          title="Distribución de Ingresos"
          description="Visualiza cómo se distribuye el ingreso entre costos variables, fijos y margen bruto"
          actions={
            <ViewToggle
              options={viewOptions}
              value={view}
              onChange={setView}
            />
          }
        >
          <IncomeDistributionChart data={currentData} />
        </ChartCard>

        {/* Insights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InsightCard
            title="Lote Más Rentable"
            description={`El lote A1 presenta la mejor relación margen/costos. Mayor barra verde = mayor rentabilidad.`}
          />
          <InsightCard
            title="Interpretación del Gráfico"
            description="Barra izquierda: costos desglosados (Insumos, Labores, Cosecha, Variable). Barra derecha: Margen Bruto. Compará alturas para evaluar eficiencia."
          />
        </div>

        {/* Data Table Summary */}
        <ChartCard title="Resumen por Lote" description="Datos detallados de cada lote">
          <div className="hidden md:block overflow-x-auto">
            {/*desktop*/}
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">
                    {view === "cultivo" ? "Cultivo" : "Campaña"}
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-muted-foreground">
                    Insumos
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-muted-foreground">
                    Labores
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-muted-foreground">
                    Cosecha
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-muted-foreground">
                    Costo Var.
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-muted-foreground">
                    Margen Bruto
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-muted-foreground">
                    Eficiencia
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentData.map((item: any) => {
                  const totalCosto = item.insumos + item.labores + item.cosecha + item.costoVariable;
                  const totalIngreso = totalCosto + item.margenBruto;
                  const eficiencia = ((item.margenBruto / totalIngreso) * 100).toFixed(1);

                  return (
                    <tr
                      key={item.name}
                      className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                    >
                      <td className="py-3 px-4 font-medium text-foreground">
                        {item.name}
                      </td>
                      <td className="py-3 px-4 text-right text-muted-foreground">
                        ${item.insumos.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-right text-muted-foreground">
                        ${item.labores.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-right text-muted-foreground">
                        ${item.cosecha.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-right text-muted-foreground">
                        ${item.costoVariable.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-right font-medium text-primary">
                        ${item.margenBruto.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                          {eficiencia}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {/*mobile*/}
          <div className="block md:hidden w-full">
            <TableSummaryMobile data={currentData} />
          </div>
        </ChartCard>
      </main>

    </div>
  );
};

