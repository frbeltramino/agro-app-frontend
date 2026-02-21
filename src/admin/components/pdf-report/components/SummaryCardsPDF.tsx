//import { lots, variableExpenses, deliveriesAndSales, laborsAndSupplies } from "../reportData";

import { ReportCampaignResponse } from "@/interfaces/report/report.campaign.response";

import { Text, View, StyleSheet } from '@react-pdf/renderer';

interface Props {
  reportData: ReportCampaignResponse;
}

const styles = StyleSheet.create({
  cardRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  cardBox: { flex: 1, padding: 5, margin: 2, border: 1, borderColor: '#ccc', borderRadius: 3 },
  cardLabel: { fontSize: 8, color: '#555' },
  cardValue: { fontSize: 12, fontWeight: 'bold' },
});

export const SummaryCardsPDF = ({ reportData }: Props) => {
  const totalHa = reportData.lots.reduce((s, l) => s + l.hectares, 0);
  const totalYield = reportData.lots.reduce((s, l) => s + l.crops.reduce((cs, c) => cs + c.real_yield, 0), 0);
  const totalExpenses = reportData.variableExpenses.reduce((s, l) => s + l.expenses.reduce((es, e) => es + e.amount, 0), 0);
  const totalSales = reportData.deliveriesAndSales.crops.reduce((s, c) => s + c.seed_sales.reduce((ss, sale) => ss + sale.tn_sold * sale.price_per_tn, 0), 0);
  const totalLabor = reportData.laborsAndSupplies.reduce((s, l) => s + l.total_price, 0);

  const cards = [
    { label: "Hectáreas", value: totalHa.toFixed(2) },
    { label: "Rinde Total (tn)", value: totalYield.toString() },
    { label: "Gastos Variables", value: `$${totalExpenses.toFixed(2)}` },
    { label: "Ventas Totales", value: `$${totalSales.toFixed(2)}` },
    { label: "Labores e Insumos", value: `$${totalLabor.toFixed(2)}` },
  ];

  return (
    <View style={styles.cardRow}>
      {cards.map((card) => (
        <View key={card.label} style={styles.cardBox}>
          <Text style={styles.cardValue}>{card.value}</Text>
          <Text style={styles.cardLabel}>{card.label}</Text>
        </View>
      ))}
    </View>
  );
};


