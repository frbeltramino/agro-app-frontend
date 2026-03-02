// ── Helpers ──────────────────────────────────────────────────────
const fmtDate = (s: string | null | undefined) => {
  if (!s) return "—";
  const d = new Date(s + "T00:00:00");
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
};

const safe = (v: any, fallback = "—") => (v !== null && v !== undefined ? v : fallback);

import { formatTn } from "@/lib/format-tn";
import { formatCurrency } from "@/lib/currency-formatter-usd";

// ── Styles ──────────────────────────────────────────────────────
function getStyles() {
  return `
    @page { size: A4; margin: 15mm 12mm; }

    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: 'Segoe UI', 'Inter', system-ui, sans-serif;
      color: #1a1a2e;
      background: #fff;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    @media print {
      body { background: #fff; }
      .report-wrapper { padding: 0; }
    }

    .report-wrapper {
      max-width: 800px;
      margin: 0 auto;
      background: #fff;
      padding: 0;
    }

    /* ── Header ──────────────────────────────── */
    .report-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 0 10px;
      border-bottom: 2px solid #e8f5e9;
      margin-bottom: 12px;
    }
    .report-logo { height: 40px; object-fit: contain; }
    .report-title-group { text-align: right; }
    .report-title {
      font-size: 18px;
      font-weight: 800;
      color: #1b5e20;
      letter-spacing: -0.3px;
    }
    .report-subtitle {
      font-size: 10px;
      color: #757575;
      margin-top: 2px;
    }

    /* ── Empty state (array vacío) ───────────── */
    .empty-state {
      text-align: center;
      padding: 60px 20px;
    }
    .empty-state-icon {
      font-size: 48px;
      margin-bottom: 16px;
      opacity: 0.35;
    }
    .empty-state-title {
      font-size: 18px;
      font-weight: 700;
      color: #424242;
      margin-bottom: 6px;
    }
    .empty-state-desc {
      font-size: 13px;
      color: #9e9e9e;
      max-width: 360px;
      margin: 0 auto;
      line-height: 1.5;
    }

    /* ── Lot ─────────────────────────────────── */
    .lot-section {
      margin-bottom: 16px;
 
    }
    .lot-header {
      background: #e8f5e9;
      border: 1px solid #a5d6a7;
      padding: 10px 14px;
      border-radius: 8px;
      margin-bottom: 10px;
    }
    .lot-title-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .lot-title-row h2 {
      font-size: 15px;
      font-weight: 700;
      color: #1b5e20;
    }
    .lot-hectares {
      font-size: 12px;
      font-weight: 600;
      color: #2e7d32;
      background: #c8e6c9;
      padding: 2px 10px;
      border-radius: 12px;
    }
    .lot-crops-count {
      font-size: 11px;
      color: #558b2f;
      margin-top: 2px;
    }

    /* ── Summary cards ───────────────────────── */
    .summary-grid {
      display: flex;
      gap: 8px;
      margin: 8px 0 12px;
      flex-wrap: wrap;
    }
    .summary-card {
      flex: 1;
      min-width: 100px;
      background: #f8f9fa;
      border: 1px solid #e8e8e8;
      border-radius: 6px;
      padding: 7px 10px;
      text-align: center;
    }
    .summary-label {
      font-size: 8px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #757575;
      font-weight: 700;
    }
    .summary-value {
      font-size: 14px;
      font-weight: 700;
      color: #1b5e20;
    }
    .summary-value.negative { color: #c62828; }

    /* ── Crop card ────────────────────────────── */
    .crop-card {
      border: 1px solid #e8e8e8;
      border-radius: 6px;
      margin-bottom: 10px;
      overflow: hidden;
    }
    .crop-header {
      background: #fafafa;
      padding: 8px 12px;
      border-bottom: 1px solid #f0f0f0;
    }
    .crop-header h3 {
      font-size: 13px;
      font-weight: 700;
      color: #333;
    }
    .crop-meta {
      display: flex;
      gap: 16px;
      margin-top: 4px;
    }
    .meta-item { display: flex; gap: 4px; align-items: center; }
    .meta-label { font-size: 9px; color: #999; font-weight: 600; text-transform: uppercase; }
    .meta-value { font-size: 10px; color: #555; font-weight: 600; }

    .crop-body { padding: 8px 12px; }

    /* ── Section titles ──────────────────────── */
    .section-title {
      font-size: 11px;
      font-weight: 700;
      color: #1b5e20;
      margin: 10px 0 4px;
      padding: 4px 10px;
      background: #f1f8e9;
      border-left: 3px solid #4caf50;
      border-radius: 0 4px 4px 0;
    }

    /* ── No-data (per-section) ───────────────── */
    .no-data-section {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 14px;
      margin: 4px 0 6px;
      background: #fafafa;
      border: 1px dashed #e0e0e0;
      border-radius: 6px;
      color: #9e9e9e;
      font-size: 11px;
      font-style: italic;
    }
    .no-data-section .nd-icon {
      flex-shrink: 0;
      width: 16px;
      height: 16px;
      border: 1.5px solid #bdbdbd;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 10px;
      font-style: normal;
      color: #bdbdbd;
    }

    /* ── Tables ───────────────────────────────── */
    .data-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 10px;
      margin-bottom: 4px;
    }
    .data-table th {
      background: #f5f5f5;
      font-weight: 700;
      font-size: 8px;
      text-transform: uppercase;
      letter-spacing: 0.3px;
      padding: 5px 6px;
      border: 1px solid #e8e8e8;
      text-align: left;
      color: #616161;
    }
    .data-table td {
      padding: 4px 6px;
      border: 1px solid #f0f0f0;
    }
    .text-right { text-align: right; }
    .text-center { text-align: center; }

    .total-row td {
      font-weight: 700;
      background: #f1f8e9;
      border-top: 2px solid #a5d6a7;
    }

    .supply-row td {
      background: #fafff5;
      font-size: 9px;
      color: #555;
    }

    /* ── Badges ───────────────────────────────── */
    .badge {
      display: inline-block;
      font-size: 8px;
      font-weight: 700;
      padding: 1px 6px;
      border-radius: 8px;
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }
    .badge-siembra    { background:#e3f2fd; color:#1565c0; }
    .badge-fertilizacion { background:#fff3e0; color:#e65100; }
    .badge-pulverizacion { background:#fce4ec; color:#c62828; }
    .badge-default    { background:#f5f5f5; color:#616161; }
    .badge-stock      { background:#e8f5e9; color:#2e7d32; font-size:7px; margin-left:4px; }
    .badge-pending    { background:#fff8e1; color:#f57f17; }
    .badge-completed  { background:#e8f5e9; color:#2e7d32; }

    /* ── Footer ───────────────────────────────── */
    .report-footer {
      margin-top: 14px;
      padding: 10px 0;
      border-top: 2px solid #e8f5e9;
      font-size: 10px;
      color: #9e9e9e;
      text-align: center;
    }
    .report-footer strong { color: #1a1a2e; }
    .report-footer .accent { color: #d92727; font-weight: 700; }
  `;
}

// ── Badge helper ────────────────────────────────────────────────
function badgeClass(type: string) {
  const t = (type || "").toLowerCase();
  if (t.includes("siembra")) return "badge badge-siembra";
  if (t.includes("fertiliz")) return "badge badge-fertilizacion";
  if (t.includes("pulveriz")) return "badge badge-pulverizacion";
  return "badge badge-default";
}

// ── Empty-section message ───────────────────────────────────────
function noDataHtml(msg: string) {
  return `
    <div class="no-data-section">
      <span class="nd-icon">—</span>
      <span>${msg}</span>
    </div>
  `;
}

// ── Build labors & supplies ─────────────────────────────────────
function buildLabors(labors: any[]) {
  if (!labors?.length) {
    return `
      <div class="section-title">Labores e Insumos</div>
      ${noDataHtml("No se registraron labores ni insumos para este cultivo.")}
    `;
  }

  let tLabor = 0;
  let tPrice = 0;
  let rows = "";

  labors.forEach((task: any) => {
    tLabor += task.laborCost || 0;
    tPrice += task.total_price || 0;
    rows += `
      <tr>
        <td>${fmtDate(task.date)}</td>
        <td><span class="${badgeClass(task.type)}">${task.type || "—"}</span></td>
        <td>${safe(task.description)}</td>
        <td>${safe(task.provider_name)}</td>
        <td class="text-right">${formatCurrency(task.laborCost || 0)}</td>
        <td class="text-right">${formatCurrency(task.total_price || 0)}</td>
      </tr>
    `;
    (task.supplies || []).forEach((s: any) => {
      rows += `
        <tr class="supply-row">
          <td>↳</td>
          <td colspan="2">${s.supply_name} <span style="color:#999;font-size:8px">(${s.category_name})</span>${s.from_stock ? ' <span class="badge-stock">Stock</span>' : ""}</td>
          <td>${formatTn(s.dose_per_ha)} ${s.unit}/ha</td>
          <td class="text-right">${formatTn(s.total_used || 0)} ${formatTn(s.unit)}</td>
          <td class="text-right">${formatCurrency((s.total_used || 0) * (s.price_per_unit || 0))}</td>
        </tr>
      `;
    });
  });

  return `
    <div class="section-title">Labores e Insumos</div>
    <table class="data-table">
      <thead>
        <tr>
          <th>Fecha</th><th>Tipo</th><th>Descripción</th>
          <th>Proveedor</th><th class="text-right">Costo Labor</th><th class="text-right">Total</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
        <tr class="total-row">
          <td colspan="4">TOTAL</td>
          <td class="text-right">${formatCurrency(tLabor)}</td>
          <td class="text-right">${formatCurrency(tPrice)}</td>
        </tr>
      </tbody>
    </table>
  `;
}

// ── Build variable expenses ─────────────────────────────────────
function buildExpenses(expenses: any[]) {
  if (!expenses?.length) {
    return `
      <div class="section-title">Gastos Variables</div>
      ${noDataHtml("No se registraron gastos variables para este cultivo.")}
    `;
  }

  let total = 0;
  let rows = "";

  expenses.forEach((item: any) => {
    total += item.amount || 0;
    rows += `
      <tr>
        <td>${fmtDate(item.expense_date)}</td>
        <td>${safe(item.expense_type_name)}</td>
        <td>${safe(item.provider)}</td>
        <td class="text-right">${formatCurrency(item.amount || 0)}</td>
      </tr>
    `;
  });

  return `
    <div class="section-title">Gastos Variables</div>
    <table class="data-table">
      <thead>
        <tr><th>Fecha</th><th>Tipo</th><th>Proveedor</th><th class="text-right">Monto</th></tr>
      </thead>
      <tbody>
        ${rows}
        <tr class="total-row">
          <td colspan="3">TOTAL</td>
          <td class="text-right">${formatCurrency(total)}</td>
        </tr>
      </tbody>
    </table>
  `;
}

// ── Build deliveries ────────────────────────────────────────────
function buildDeliveries(deliveries: any[]) {
  if (!deliveries?.length) {
    return `
      <div class="section-title">Entregas (Cosecha)</div>
      ${noDataHtml("No se registraron entregas para este cultivo.")}
    `;
  }

  let rows = "";

  deliveries.forEach((item: any) => {
    const statusBadge = item.status === "pending" ? "badge badge-pending" : "badge badge-completed";
    const statusLabel = item.status === "pending" ? "Entregado" : "Completado";
    rows += `
      <tr>
        <td>${fmtDate(item.delivery_date)}</td>
        <td>${safe(item.waybill_number)}</td>
        <td>${safe(item.destination)}</td>
        <td class="text-right">${formatTn(item.tn_delivered || 0)}</td>
        <td><span class="${statusBadge}">${statusLabel}</span></td>
      </tr>
    `;
  });

  return `
    <div class="section-title">Entregas (Cosecha)</div>
    <table class="data-table">
      <thead>
        <tr><th>Fecha</th><th>Carta de Porte</th><th>Destino</th><th class="text-right">Tn Entregadas</th><th>Estado</th></tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  `;
}

// ── Build sales ─────────────────────────────────────────────────
function buildSales(sales: any[]) {
  if (!sales?.length) {
    return `
      <div class="section-title">Ventas</div>
      ${noDataHtml("No se registraron ventas para este cultivo.")}
    `;
  }

  let total = 0;
  let rows = "";

  sales.forEach((item: any) => {
    const t = (item.tn_sold || 0) * (item.price_per_tn || 0);
    total += t;
    rows += `
      <tr>
        <td>${fmtDate(item.sale_date)}</td>
        <td>${safe(item.primary_liquidation_number)}</td>
        <td>${safe(item.destination)}</td>
        <td class="text-right">${formatTn(item.tn_sold || 0)}</td>
        <td class="text-right">${formatCurrency(item.price_per_tn || 0)}</td>
        <td class="text-right">${formatCurrency(t)}</td>
      </tr>
    `;
  });

  return `
    <div class="section-title">Ventas</div>
    <table class="data-table">
      <thead>
        <tr><th>Fecha</th><th>N° Liquidación</th><th>Destino</th><th class="text-right">Tn Vendidas</th><th class="text-right">Precio/Tn</th><th class="text-right">Total</th></tr>
      </thead>
      <tbody>
        ${rows}
        <tr class="total-row">
          <td colspan="5">TOTAL VENTAS</td>
          <td class="text-right">${formatCurrency(total)}</td>
        </tr>
      </tbody>
    </table>
  `;
}

// ── Build crops ─────────────────────────────────────────────────
function buildCrops(crops: any[]) {
  return crops
    .map((crop) => {
      return `
      <div class="crop-card">
        <div class="crop-header">
          <h3>${crop.crop_name || "Sin nombre"}${crop.seed_type ? " — " + crop.seed_type : ""}</h3>
          <div class="crop-meta">
            <div class="meta-item">
              <span class="meta-label">Rendimiento</span>
              <span class="meta-value">${crop.real_yield != null ? formatTn(Number(crop.real_yield)) + " tn" : "Sin datos"}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Período</span>
              <span class="meta-value">${fmtDate(crop.start_date)} — ${crop.end_date ? fmtDate(crop.end_date) : "En curso"}</span>
            </div>
          </div>
        </div>
        <div class="crop-body">
          ${buildLabors(crop.laborsAndSupplies)}
          ${buildExpenses(crop.variableExpenses)}
          ${buildDeliveries(crop.deliveries)}
          ${buildSales(crop.sales)}
        </div>
      </div>
    `;
    })
    .join("");
}

// ── Build main report content ───────────────────────────────────
function buildReportContent(data: any[]) {
  // Caso 1: Array vacío — no hay datos
  if (!data?.length) {
    return `
      <div class="empty-state">
        <div class="empty-state-icon">📋</div>
        <div class="empty-state-title">Sin datos para esta campaña</div>
        <div class="empty-state-desc">
          No se encontraron lotes registrados. Agregue lotes y cultivos desde la aplicación para generar el reporte.
        </div>
      </div>
    `;
  }

  return data
    .map((lot) => {
      const hectares = lot.hectares != null ? formatTn(lot.hectares) : "0.00";

      // Caso 2: Lote sin cultivos
      if (!lot.crops?.length) {
        return `
        <div class="lot-section">
          <div class="lot-header">
            <div class="lot-title-row">
              <h2>${lot.lot_name || "Lote sin nombre"}</h2>
              <span class="lot-hectares">${formatTn(lot.hectares)} ha</span>
            </div>
            <div class="lot-crops-count">0 cultivo(s)</div>
          </div>
          ${noDataHtml("No se registraron cultivos para este lote.")}
        </div>
      `;
      }

      // Calcular totales del lote
      let totalCost = 0;
      let totalSales = 0;
      let totalDelivered = 0;

      lot.crops.forEach((cr: any) => {
        (cr.laborsAndSupplies || []).forEach((t: any) => (totalCost += (t.total_price) || 0));
        (cr.variableExpenses || []).forEach((e: any) => (totalCost += e.amount || 0));//ya esta por ha
        (cr.sales || []).forEach((s: any) => (totalSales += (s.tn_sold || 0) * (s.price_per_tn || 0)));
        (cr.deliveries || []).forEach((d: any) => (totalDelivered += d.tn_delivered || 0));
      });

      const totalCostPerHa = totalCost / lot.hectares;
      const totalSalesPerHa = totalSales / lot.hectares;
      const totalDeliveredPerHa = totalDelivered / lot.hectares;

      const marginPerHa = totalSalesPerHa - totalCostPerHa;


      return `
      <div class="lot-section">
        <div class="lot-header">
          <div class="lot-title-row">
            <h2>${lot.lot_name || "Lote sin nombre"}</h2>
            <span class="lot-hectares">${hectares} ha</span>
          </div>
          <div class="lot-crops-count">${lot.crops.length} cultivo(s)</div>
        </div>

        <!-- 

            <div class="summary-grid">
          <div class="summary-card">
            <div class="summary-label">Costo Total</div>
            <div class="summary-value">${formatCurrency(totalCostPerHa) + "/ha"}</div>
          </div>
          <div class="summary-card">
            <div class="summary-label">Ventas</div>
            <div class="summary-value">${formatCurrency(totalSalesPerHa) + "/ha"}</div>
          </div>
          <div class="summary-card">
            <div class="summary-label">Tn Entregadas</div>
            <div class="summary-value">${formatTn(totalDeliveredPerHa) + "/ha"}</div>
          </div>
          <div class="summary-card">
            <div class="summary-label">Margen</div>
            <div class="summary-value${marginPerHa < 0 ? " negative" : ""}">${formatCurrency(marginPerHa) + "/ha"}</div>
          </div>
        </div>


        -->
       
        ${buildCrops(lot.crops)}
      </div>
    `;
    })
    .join("");
}

// ── Main export ─────────────────────────────────────────────────
export function buildReportTemplate(data: any[], campaignName?: string, logoUrl?: string) {
  const now = new Date();
  const dateStr = `${String(now.getDate()).padStart(2, "0")}/${String(now.getMonth() + 1).padStart(2, "0")}/${now.getFullYear()} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <title>Reporte ${campaignName ?? "Campaña"}</title>
  <style>${getStyles()}</style>
</head>
<body>
  <div class="report-wrapper">
    <div class="report-header">
      <img src="${logoUrl || "/LogoApp-AgroHuracan-desktop-light.png"}" alt="AgroHuracán" class="report-logo" />
      <div class="report-title-group">
        <div class="report-title">Reporte de Campaña${campaignName ? " — " + campaignName : ""}</div>
        <div class="report-subtitle">Generado el ${dateStr}</div>
      </div>
    </div>

    ${buildReportContent(data)}

    <div class="report-footer">
      Este reporte fue generado automáticamente · <strong>Agro</strong><span class="accent">Huracán</span>
    </div>
  </div>

  <script>window.onload = function(){ window.print(); }</script>
</body>
</html>`;
}
