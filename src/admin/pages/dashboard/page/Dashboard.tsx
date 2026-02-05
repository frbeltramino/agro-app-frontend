import { useEffect, useMemo, useState } from "react";
import { TrendingUp, Wallet, PiggyBank } from "lucide-react";
import { StatCard } from "../components/StatCard";
import { ChartCard } from "../components/ChartCard";
import { IncomeDistributionChart } from "../components/IncomeDistributionChart";
import { InsightCard } from "../components/InsightCard";
import { TableSummaryMobile } from "../components/TableSummaryMobile";
import { PageHeader } from "@/admin/components/PageHeader";
import { useLotsStats } from "@/admin/hooks/useLotsStats";
import { formatCurrency } from "@/lib/currency-formatter-usd";
import { useCampaigns } from "../../../hooks/useCampaigns";
import { Label } from "@/components/ui/label";
import { CustomFullScreenLoading } from "@/components/custom/CustomFullScreenLoading";
import { formatTn } from "@/lib/format-tn";
import { CustomNoResultsCard } from "@/components/custom/CustomNoResultsCard";
import agroTractor from "@/assets/agro-tractor.jpg";
import { ImageCard } from "@/admin/components/ImageCard";


export const Dashboard = () => {

  // 🔹 Hook campaigns
  const { data: campaignsData, isLoading: isLoadingCampaigns } = useCampaigns();

  const campaigns = campaignsData?.campaigns || [];

  // 🔹 Estado de campaña seleccionada
  const [selectedCampaignId, setSelectedCampaignId] = useState<number | null>(null);

  // 🔹 Cuando cargan campaigns, seleccionar la primera automáticamente
  useEffect(() => {
    if (!selectedCampaignId && campaigns.length > 0) {
      setSelectedCampaignId(campaigns[0].id);
    }
  }, [campaigns, selectedCampaignId]);

  // 🔹 Fetch de lotes solo si hay campaña seleccionada
  const { data: lotsStatsData, isLoading: isLoadingLots } = useLotsStats({
    campaignId: selectedCampaignId || undefined,
    enabled: !!selectedCampaignId, // ✅ Solo fetch cuando haya campaña
  });

  const lotData = lotsStatsData?.lotes || [];

  const currentData =
    lotData.map(lot => ({
      ...lot,
      name: lot.lote,
    }))

  const hasActivity = currentData.some(lot =>
    lot.cosecha > 0 ||
    lot.insumos > 0 ||
    lot.labores > 0 ||
    lot.costoVariable > 0
  );

  type LotWithMargin = {
    name: string;
    margen: number;
    margenPorHa: number;
  } & typeof currentData[number];



  const calculateTotalCostByLote = () => {
    const totalCost = currentData.reduce(
      (acc, lot) =>
        acc +
        (Number(lot.insumos) || 0) +
        (Number(lot.labores) || 0) +
        (Number(lot.costoVariable) || 0),
      0
    );
    const totalHa = currentData.reduce(
      (acc, lot) => acc + (Number(lot.superficieHa) || 0),
      0
    );
    // Evitar división por cero
    if (totalHa === 0) return formatCurrency(0);
    return formatCurrency(totalCost / totalHa);
  };

  const calculateBestLot = (): LotWithMargin | null => {
    if (!hasActivity) return null;

    let bestLot: LotWithMargin | null = null;
    let bestMarginPerHa = -Infinity;

    currentData.forEach(lot => {
      const ingresos = (lot.cosecha ?? 0) * (lot.precioPromedio ?? 0);
      const costos =
        (lot.insumos ?? 0) +
        (lot.labores ?? 0) +
        (lot.costoVariable ?? 0);

      const margen = ingresos - costos;
      const margenPorHa =
        lot.superficieHa > 0 ? margen / lot.superficieHa : 0;

      if (margenPorHa > bestMarginPerHa) {
        bestMarginPerHa = margenPorHa;
        bestLot = {
          ...lot,
          margen,
          margenPorHa,
          name: lot.name,
        };
      }
    });

    return bestLot;
  };

  const bestLot = useMemo(() => calculateBestLot(), [currentData, hasActivity]);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <PageHeader title="Dashboard" subtitle="Gestiona las estadísticas de tus lotes" />

      {
        isLoadingCampaigns && (
          <CustomFullScreenLoading />
        )


      }
      {
        !isLoadingCampaigns && (
          <main className="grid gap-4 grid-cols-1 space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <ImageCard image={agroTractor} alt="Tractor" isLoading={isLoadingLots} />
              <StatCard
                title="Ingreso Total"
                value={formatCurrency(0)}
                subtitle="Suma de todos los cultivos"
                icon={Wallet}
                variant="primary"
                isLoading={isLoadingLots}
              />
              <StatCard
                title="Margen Bruto Total"
                value={formatCurrency(0)}
                icon={TrendingUp}
                trend={{ value: 0, isPositive: true }}
                isLoading={isLoadingLots}
              />
              <StatCard
                title="Costos Totales"
                value={calculateTotalCostByLote()}
                subtitle={`(U$S/ha)`}
                icon={PiggyBank}
                isLoading={isLoadingLots}
              />

            </div>

            {/* Main Chart */}
            <ChartCard
              title="Distribución de Ingresos"
              description="Visualiza cómo se distribuye el ingreso entre costos variables, fijos y margen bruto"
              actions={
                <div className="flex items-center space-x-3">
                  <Label className="text-sm">Campaña</Label>
                  <select
                    id="campaignSelect"
                    value={selectedCampaignId ?? ""}
                    onChange={(e) => setSelectedCampaignId(Number(e.target.value))}
                    className="mt-1.5 w-full px-3 py-2 border rounded-md bg-background text-sm"
                  >
                    {campaigns.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              }
              isLoading={isLoadingLots}
              showActions={hasActivity}
            >
              {!isLoadingLots && !hasActivity && (
                <CustomNoResultsCard
                  title="Aún no hay movimientos registrados"
                  message="Cuando cargues insumos, labores o cosechas, el gráfico aparecerá aquí."
                />
              )}
              {hasActivity && (
                <IncomeDistributionChart data={currentData} />
              )}
            </ChartCard>

            {/* Insights */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InsightCard
                title="Lote Más Rentable"
                description={
                  bestLot
                    ? `El lote ${bestLot.name} presenta el mayor margen bruto (${formatCurrency(
                      bestLot.margenPorHa
                    )}/ha).`
                    : "Aún no hay datos suficientes para determinar el lote más rentable."
                }
                isLoading={isLoadingLots}
              />
              <InsightCard
                title="Interpretación del Gráfico"
                description="Barra izquierda: costos desglosados (Insumos, Labores, Cosecha, Variable). Barra derecha: Margen Bruto. Compará alturas para evaluar eficiencia."
                isLoading={isLoadingLots}
              />
            </div>

            {/* Data Table Summary */}
            <ChartCard
              title="Resumen por Lote"
              description="Datos detallados de cada lote"
              isLoading={isLoadingLots}
            >
              {
                !isLoadingLots && currentData.length === 0 && (
                  <CustomNoResultsCard
                    title="No se encontraron lotes con cosechas realizadas"
                    message="Aquí podrás ver los lotes con cosechas realizadas"
                  />
                )
              }
              {
                !isLoadingLots && currentData.length > 0 && (
                  <>
                    <div className="hidden md:block overflow-x-auto">
                      {/*desktop*/}
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-border">
                            <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">
                              Lote
                            </th>
                            <th className="text-right py-3 px-4 text-sm font-semibold text-muted-foreground">
                              Superficie (ha)
                            </th>
                            <th className="text-right py-3 px-4 text-sm font-semibold text-muted-foreground">
                              Insumos (U$S/ha)
                            </th>
                            <th className="text-right py-3 px-4 text-sm font-semibold text-muted-foreground">
                              Labores (U$S/ha)
                            </th>
                            <th className="text-right py-3 px-4 text-sm font-semibold text-muted-foreground">
                              Cosecha (tn/ha)
                            </th>
                            <th className="text-right py-3 px-4 text-sm font-semibold text-muted-foreground">
                              Precio Promedio (U$S/tn)
                            </th>
                            <th className="text-right py-3 px-4 text-sm font-semibold text-muted-foreground">
                              Costo Variable (U$S/ha)
                            </th>
                            <th className="text-right py-3 px-4 text-sm font-semibold text-muted-foreground">
                              Margen Bruto (U$S/ha)
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentData.map((item: any) => {
                            const insumosPorHa = item.insumos / item.superficieHa;
                            const laboresPorHa = item.labores / item.superficieHa;
                            const costoVariablePorHa = 0;
                            const cosechaPorHa = item.cosecha / item.superficieHa;
                            const ingresosPorHa = cosechaPorHa * item.precioPromedio;
                            let margenBrutoPorHa = 0;
                            if (item.precioPromedio > 0 && cosechaPorHa > 0) {//si hay al menos una venta en el lote se saca margen brutno sino no
                              margenBrutoPorHa =
                                (ingresosPorHa || 0) - (insumosPorHa || 0) - (laboresPorHa || 0) - (costoVariablePorHa || 0);
                            }

                            return (
                              <tr
                                key={item.name}
                                className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                              >

                                <td className="py-3 px-4 font-medium text-foreground">
                                  {item.name}
                                </td>
                                <td className="py-3 px-4 text-right font-medium text-foreground">
                                  {item.superficieHa}
                                </td>
                                <td className="py-3 px-4 text-right text-muted-foreground">
                                  {formatCurrency(insumosPorHa)}
                                </td>
                                <td className="py-3 px-4 text-right text-muted-foreground">
                                  {formatCurrency(laboresPorHa)}
                                </td>
                                <td className="py-3 px-4 text-right text-muted-foreground">
                                  {formatTn(cosechaPorHa)}
                                </td>
                                <td className="py-3 px-4 text-right text-muted-foreground">
                                  {formatCurrency(item.precioPromedio)}
                                </td>
                                <td className="py-3 px-4 text-right text-muted-foreground">
                                  {formatCurrency(costoVariablePorHa)}
                                </td>
                                <td className="py-3 px-4 text-right font-medium text-primary">
                                  {margenBrutoPorHa != 0 ? formatCurrency(margenBrutoPorHa) : "—"}
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
                  </>
                )
              }

            </ChartCard>
          </main>
        )
      }


    </div>
  );
};

