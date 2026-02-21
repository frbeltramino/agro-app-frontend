//import { lots, variableExpenses, deliveriesAndSales, laborsAndSupplies } from "../reportData";

import { ReportCampaignResponse } from "@/interfaces/report/report.campaign.response";
import { formatCurrency } from "@/lib/currency-formatter-usd";
import { formatTn } from "@/lib/format-tn";
import { Sprout, DollarSign, Tractor } from "lucide-react";


interface Props {
  reportData: ReportCampaignResponse[] | undefined;
}



export const SummaryCards = ({ reportData }: Props) => {

  if (!reportData || reportData.length === 0) {
    return (
      <section className="mb-6">
        <div className="rounded-lg border border-border bg-muted/40 p-6 text-center">
          <p className="text-sm text-muted-foreground">
            No se pudo obtener la información del resumen.
          </p>
        </div>
      </section>
    );
  }

  const totalHa = reportData.reduce(
    (sum, lot) => sum + lot.hectares,
    0
  );

  const totalYield = reportData.reduce(
    (sum, lot) =>
      sum +
      lot.crops.reduce(
        (cropSum, crop) => cropSum + crop.real_yield,
        0
      ),
    0
  );

  const totalExpenses = reportData.reduce(
    (sum, lot) =>
      sum +
      lot.crops.reduce(
        (cropSum, crop) =>
          cropSum +
          crop.variableExpenses.reduce(
            (expSum, exp) => expSum + exp.amount,
            0
          ),
        0
      ),
    0
  );

  const totalLabor = reportData.reduce(
    (sum, lot) =>
      sum +
      lot.crops.reduce(
        (cropSum, crop) =>
          cropSum +
          crop.laborsAndSupplies.reduce(
            (labSum, lab) => labSum + lab.total_price,
            0
          ),
        0
      ),
    0
  );

  const expensesPerHa = totalHa > 0 ? totalExpenses / totalHa : 0;

  const cards = [
    { label: "Hectáreas", value: formatTn(totalHa), icon: Sprout },
    { label: "Rinde Total (tn)", value: formatTn(totalYield), icon: Sprout },
    { label: "Gastos Variables", value: `${formatCurrency(expensesPerHa)}/ha`, icon: DollarSign },
    { label: "Labores e Insumos", value: formatCurrency(totalLabor), icon: Tractor },
    // { label: "Ventas Totales", value: `$${totalSales.toFixed(2)}`, icon: Truck },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
      {cards.map((card) => (
        <div
          key={card.label}
          className="bg-card border border-border rounded-lg p-4 flex flex-col items-center text-center"
        >
          <card.icon className="w-5 h-5 text-primary mb-1" />
          <p className="text-lg font-bold text-foreground">{card.value}</p>
          <p className="text-xs text-muted-foreground">{card.label}</p>
        </div>
      ))}
    </div>
  );
};

