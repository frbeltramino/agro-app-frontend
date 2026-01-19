import { useState } from "react";
import { ChevronDown, ChevronRight, Leaf, Package, Edit2, Trash2, FileText, Clock, AlertCircle, CheckCircle } from "lucide-react";
import { Campaign, Crop, Delivery } from "@/interfaces/sales/campaign.sales.response";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useSalesActionsStore } from "@/admin/pages/seedSales/store/useSalesActionsStore";
import { formatCurrency } from "@/lib/currency-formatter-usd";
import { formatDate } from "@/lib/format-date";
import { getCropIcon } from "@/constants/crop-icons";
import { SeedSale } from "@/interfaces/sales/seed.sale.interface";

interface SalesTableProps {
  campaigns: Campaign[];
}

const hiphenValue = "—";

function formatNumber(num: number): string {
  return new Intl.NumberFormat("es-AR").format(num);
}


const statusConfig: Record<string, { icon: React.ReactNode; label: string; className: string }> = {
  pending: { icon: <Clock className="h-3.5 w-3.5" />, label: "Pendiente", className: "bg-warning/10 text-warning" },
  partial: { icon: <AlertCircle className="h-3.5 w-3.5" />, label: "Parcial", className: "bg-primary/10 text-primary" },
  completed: { icon: <CheckCircle className="h-3.5 w-3.5" />, label: "Completado", className: "bg-success/10 text-success" },
};

function DeliveryRow({ delivery }: { delivery: Delivery }) {
  return (
    <tr className="border-b border-border/30 bg-muted/20 text-sm">
      <td className="py-2.5 pl-24 pr-4">
        <div className="flex items-center gap-2">
          <Package className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-muted-foreground">{delivery.primary_liquidation_number}</span>
        </div>
      </td>
      <td className="py-2.5 px-4 text-muted-foreground">{formatDate(delivery.delivery_date)}</td>
      <td className="py-2.5 px-4">{delivery.destination}</td>
      <td className="py-2.5 px-4 text-right">{hiphenValue}</td>
      <td className="py-2.5 px-4 text-right font-medium">{formatNumber(delivery.tn_delivered)} tn</td>
      <td className="py-2.5 px-4 text-right">{formatCurrency(delivery.price_per_tn)}</td>
      <td className="py-2.5 px-4 text-right font-semibold text-primary">
        {formatCurrency(delivery.tn_delivered * delivery.price_per_tn)}
      </td>
    </tr>
  );
}

function SeedSaleRow({ seedSale, isLast }: { seedSale: SeedSale; isLast: boolean }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasDeliveries = seedSale.deliveries.length > 0;
  const status = statusConfig[seedSale.status] || statusConfig.pending;
  const totalDeliveryValue = seedSale.deliveries.reduce((sum, d) => sum + d.tn_delivered * d.price_per_tn, 0);

  const { setCropToEdit, setCropToDelete } = useSalesActionsStore();

  return (
    <>
      <tr
        className={cn(
          "border-b transition-colors",
          hasDeliveries && "cursor-pointer hover:bg-accent/50",
          !isLast && "border-border/50"
        )}
        onClick={() => hasDeliveries && setIsExpanded(!isExpanded)}
      >
        <td className="py-3 pl-16 pr-4">
          <div className="flex items-center gap-3">
            {hasDeliveries ? (
              <button className="p-0.5 rounded hover:bg-accent">
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4 text-primary" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                )}
              </button>
            ) : (
              <span className="w-5" />
            )}
            <FileText className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{seedSale.waybill_number}</span>
            <span className={cn("text-xs px-2 py-0.5 rounded-full flex items-center gap-1", status.className)}>
              {status.icon}
              {status.label}
            </span>
            {hasDeliveries && (
              <span className="text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full">
                {seedSale.deliveries.length} entregas
              </span>
            )}
          </div>
        </td>
        <td className="py-3 px-4 text-muted-foreground">{formatDate(seedSale.sale_date)}</td>
        <td className="py-3 px-4">{seedSale.destination}</td>
        <td className="py-3 px-4 text-right">
          <div className="flex flex-col items-end">
            {formatNumber(seedSale.tn_delivered)} tn
          </div>
        </td>
        <td className="py-3 px-4 text-right">{formatNumber(seedSale.tn_sold)} tn</td>
        <td className="py-3 px-4 text-right text-muted-foreground">{hiphenValue}</td>
        <td className="py-3 px-4 text-right font-semibold text-primary">
          {hasDeliveries ? formatCurrency(totalDeliveryValue) : hiphenValue}
        </td>
        <td className="py-4 px-4 text-right">
          <div className="flex gap-1 justify-end">
            <Button variant="outline" size="sm"
              onClick={(e) => {
                e.stopPropagation();
                setCropToEdit(seedSale);
              }}>
              <Edit2 className="w-4 h-4" />
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                setCropToDelete(seedSale);
              }}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </td>
      </tr>
      {isExpanded &&
        seedSale.deliveries.map((delivery: Delivery) => (
          <DeliveryRow key={delivery.id} delivery={delivery} />
        ))}
    </>
  );
}

function CropRow({ crop, isLast }: { crop: Crop; isLast: boolean }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasSeedSales = crop.seed_sales.length > 0;
  const icon = getCropIcon(crop.crop_name) || <Leaf className="h-4 w-4" />;

  const totalTnSold = crop.seed_sales.reduce((sum, s) => sum + s.tn_sold, 0);
  const totalTnDelivered = crop.seed_sales.reduce((sum, s) => sum + s.tn_delivered, 0);

  return (
    <>
      <tr
        className={cn(
          "border-b transition-colors bg-secondary/30",
          hasSeedSales && "cursor-pointer hover:bg-accent/50",
          !isLast && "border-border"
        )}
        onClick={() => hasSeedSales && setIsExpanded(!isExpanded)}
      >
        <td className="py-4 pl-10 pr-4">
          <div className="flex items-center gap-3">
            {hasSeedSales ? (
              <button className="p-0.5 rounded hover:bg-accent">
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4 text-primary" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                )}
              </button>
            ) : (
              <span className="w-5" />
            )}
            <span className="text-accent-foreground">{icon}</span>
            <span className="font-semibold">{crop.crop_name}</span>
            {hasSeedSales && (
              <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                {crop.seed_sales.length} ventas
              </span>
            )}
          </div>
        </td>
        <td className="py-4 px-4 text-muted-foreground">{hiphenValue}</td>
        <td className="py-4 px-4 text-muted-foreground">{hiphenValue}</td>

        <td className="py-4 px-4 text-right">{formatNumber(totalTnDelivered)} tn</td>
        <td className="py-4 px-4 text-right">
          {formatNumber(totalTnSold)} tn
        </td>
        <td className="py-4 px-4 text-right text-muted-foreground">{hiphenValue}</td>
        <td className="py-4 px-4 text-right text-muted-foreground">{hiphenValue}</td>
        <td className="py-4 px-4 text-right text-muted-foreground">{hiphenValue}</td>
      </tr>
      {isExpanded &&
        crop.seed_sales.map((seedSale, idx) => (
          <SeedSaleRow
            key={seedSale.id}
            seedSale={seedSale}
            isLast={idx === crop.seed_sales.length - 1}
          />
        ))}
    </>
  );
}

function CampaignSection({ campaign }: { campaign: Campaign }) {
  const [isExpanded, setIsExpanded] = useState(true);

  const totalSeedSales = campaign.crops.reduce((sum, c) => sum + c.seed_sales.length, 0);
  const totalTnSold = campaign.crops.reduce(
    (sum, c) => sum + c.seed_sales.reduce((s, sale) => s + sale.tn_sold, 0),
    0
  );
  const totalTnDelivered = campaign.crops.reduce(
    (sum, c) => sum + c.seed_sales.reduce((s, sale) => s + sale.tn_delivered, 0),
    0
  );

  return (
    <div className="mb-6">
      <div
        className="flex items-center gap-3 px-4 py-3 bg-primary/5 border border-primary/20 rounded-t-lg cursor-pointer hover:bg-primary/10 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <button className="p-0.5">
          {isExpanded ? (
            <ChevronDown className="h-5 w-5 text-primary" />
          ) : (
            <ChevronRight className="h-5 w-5 text-primary" />
          )}
        </button>
        <h3 className="font-semibold text-lg">Campaña {campaign.campaign_name}</h3>
        <div className="ml-auto flex items-center gap-6 text-sm">
          <span className="text-muted-foreground">
            {campaign.crops.length} cultivos • {totalSeedSales} ventas
          </span>
          <span className="font-medium">
            {formatNumber(totalTnDelivered)} tn entregadas
          </span>
          <span className="text-primary font-semibold">
            {formatNumber(totalTnSold)} tn vendidas
          </span>
        </div>
      </div>

      {isExpanded && (
        <div className="border border-t-0 border-border rounded-b-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-secondary/50 text-sm text-muted-foreground">
                <th className="py-3 pl-10 pr-4 text-left font-medium">Cultivo / Entrega / Venta</th>
                <th className="py-3 px-4 text-left font-medium">Fecha</th>
                <th className="py-3 px-4 text-left font-medium">Destino</th>
                <th className="py-3 px-4 text-right font-medium">Toneladas Entregadas</th>
                <th className="py-3 px-4 text-right font-medium">Toneladas Vendidas</th>
                <th className="py-3 px-4 text-right font-medium">Precio/tn</th>
                <th className="py-3 px-4 text-right font-medium">Total</th>
                <th className="py-3 px-4 text-right font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {campaign.crops.map((crop, idx) => (
                <CropRow
                  key={crop.crop_name_id}
                  crop={crop}
                  isLast={idx === campaign.crops.length - 1}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export function SalesTable({ campaigns }: SalesTableProps) {
  return (
    <div className="space-y-6">
      {campaigns.map((campaign) => (
        <CampaignSection key={campaign.campaign_id} campaign={campaign} />
      ))}
    </div>
  );
}
