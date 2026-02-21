import { Crop } from "@/interfaces/report/report.campaign.response";
import { Truck, ShoppingCart } from "lucide-react";
import { ReportEmptySection } from "./ReportEmptySection";
import { formatDate } from "@/lib/format-date";
import { formatTn } from "@/lib/format-tn";
import { formatCurrency } from "@/lib/currency-formatter-usd";

interface Props {
  crops: Crop[];
}

export const DeliveriesSalesSection = ({ crops }: Props) => {

  if (!crops || crops.length === 0) {
    return (
      <ReportEmptySection
        title="Envíos y Ventas"
        message="No se registraron envíos ni ventas para esta campaña."
        icon={<Truck className="w-4 h-4" />}
      />
    );
  }

  // Unimos todos los deliveries y sales para chequear si hay info
  const allDeliveries = crops.flatMap(crop => crop.deliveries ?? []);
  const allSales = crops.flatMap(crop => crop.sales ?? []);

  if (allDeliveries.length === 0 && allSales.length === 0) {
    return (
      <ReportEmptySection
        title="Envíos y Ventas"
        message="No se registraron envíos ni ventas para esta campaña."
        icon={<Truck className="w-4 h-4" />}
      />
    );
  }
  return (
    <section className="mb-6">
      <h2 className="report-section-title flex items-center gap-2">
        <Truck className="w-4 h-4" /> Envíos y Ventas
      </h2>

      {crops.map((crop) => (
        <div key={crop.crop_id} className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {crop.crop_name}
          </p>

          {/* Deliveries */}
          {crop.deliveries && crop.deliveries.length > 0 && (
            <div>
              <h3 className="text-xs font-bold text-foreground mb-1 flex items-center gap-1">
                <Truck className="w-3.5 h-3.5" /> Envíos
              </h3>
              <div className="overflow-hidden rounded-lg border border-border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-report-table-header text-report-header-foreground">
                      <th className="text-left px-4 py-2 font-semibold">Carta de Porte</th>
                      <th className="text-left px-4 py-2 font-semibold">Destino</th>
                      <th className="text-right px-4 py-2 font-semibold">Tn Entregadas</th>
                      <th className="text-left px-4 py-2 font-semibold">Estado</th>
                      <th className="text-left px-4 py-2 font-semibold">Fecha</th>
                    </tr>
                  </thead>
                  <tbody>
                    {crop.deliveries.map((d) => (
                      <tr key={d.id} className="even:bg-report-table-stripe">
                        <td className="px-4 py-2 font-medium">{d.waybill_number}</td>
                        <td className="px-4 py-2">{d.destination}</td>
                        <td className="px-4 py-2 text-right font-semibold">{formatTn(d.tn_delivered)}</td>
                        <td className="px-4 py-2">
                          <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-accent text-accent-foreground">
                            {d.status === "pending" ? "Pendiente" : d.status}
                          </span>
                        </td>
                        <td className="px-4 py-2">{d.delivery_date ? formatDate(d.delivery_date) : "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Sales */}
          {crop.sales && crop.sales.length > 0 && (
            <div>
              <h3 className="text-xs font-bold text-foreground mb-1 flex items-center gap-1">
                <ShoppingCart className="w-3.5 h-3.5" /> Ventas
              </h3>
              <div className="overflow-hidden rounded-lg border border-border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-report-table-header text-report-header-foreground">
                      <th className="text-left px-4 py-2 font-semibold">Liquidación</th>
                      <th className="text-left px-4 py-2 font-semibold">Destino</th>
                      <th className="text-right px-4 py-2 font-semibold">Tn Vendidas</th>
                      <th className="text-right px-4 py-2 font-semibold">Precio/Tn (USD)</th>
                      <th className="text-right px-4 py-2 font-semibold">Total (USD)</th>
                      <th className="text-left px-4 py-2 font-semibold">Fecha</th>
                    </tr>
                  </thead>
                  <tbody>
                    {crop.sales.map((s) => (
                      <tr key={s.id} className="even:bg-report-table-stripe">
                        <td className="px-4 py-2 font-medium">{s.primary_liquidation_number}</td>
                        <td className="px-4 py-2">{s.destination}</td>
                        <td className="px-4 py-2 text-right">{formatTn(s.tn_sold)}</td>
                        <td className="px-4 py-2 text-right">{formatCurrency(s.price_per_tn)}</td>
                        <td className="px-4 py-2 text-right font-semibold text-primary">
                          {formatCurrency(s.tn_sold * s.price_per_tn)}
                        </td>
                        <td className="px-4 py-2">{s.sale_date ? formatDate(s.sale_date) : "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      ))}
    </section>
  );
};

