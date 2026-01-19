import { useState } from "react";
import { ChevronDown, ChevronRight, Wheat, Leaf, Sun, Flower2, Package, Edit2, Trash2 } from "lucide-react";
import { Campaign, Crop, Delivery } from "@/interfaces/sales/campaign.sales.response";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useSalesActionsStore } from "@/admin/pages/seedSales/store/useSalesActionsStore";
import { formatCurrency } from "@/lib/currency-formatter-usd";
import { formatDate } from "@/lib/format-date";
import { getCropIcon } from "@/constants/crop-icons";

interface SalesTableProps {
  campaigns: Campaign[];
}

function formatNumber(num: number): string {
  return new Intl.NumberFormat("es-AR").format(num);
}

function calculateCropTotalMoney(crop: Crop) {
  if (!crop.deliveries || crop.deliveries.length === 0) {
    return "—"; // o "US$ 0" si prefieres mostrar cero
  }
  const total = crop.deliveries.reduce(
    (sum, d) => sum + (d.tn_delivered || 0) * (d.price_per_tn || 0),
    0
  );
  return formatCurrency(total);
}

function DeliveryRow({ delivery }: { delivery: Delivery }) {
  return (
    <tr className="border-b border-border/50 bg-muted/30 text-sm">
      <td className="py-3 pl-16 pr-4">
        <div className="flex items-center gap-2">
          <Package className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-muted-foreground">{delivery.primary_liquidation_number}</span>
        </div>
      </td>
      <td className="py-3 px-4 text-muted-foreground">{formatDate(delivery.delivery_date)}</td>
      <td className="py-3 px-4">{delivery.destination}</td>
      <td className="py-3 px-4 text-right font-medium">—</td>
      <td className="py-3 px-4 text-right font-medium">{formatNumber(delivery.tn_delivered)} tn</td>
      <td className="py-3 px-4 text-right">{formatCurrency(delivery.price_per_tn)}</td>
      <td className="py-3 px-4 text-right font-semibold text-primary">
        {formatCurrency(delivery.tn_delivered * delivery.price_per_tn)}
      </td>
    </tr>
  );
}

function CropRow({ crop, isLast }: { crop: Crop; isLast: boolean }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasDeliveries = crop.deliveries.length > 0;
  const icon = getCropIcon(crop.crop_name) || <Leaf className="h-4 w-4" />;
  const setCropToEdit = useSalesActionsStore((s) => s.setCropToEdit);
  const setCropToDelete = useSalesActionsStore((s) => s.setCropToDelete);

  return (
    <>
      <tr
        className={cn(
          "border-b transition-colors",
          hasDeliveries && "cursor-pointer hover:bg-accent/50",
          !isLast && "border-border"
        )}
        onClick={() => hasDeliveries && setIsExpanded(!isExpanded)}
      >
        <td className="py-4 pl-10 pr-4">
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
            <span className="text-accent-foreground">{icon}</span>
            <span className="font-medium">{crop.crop_name}</span>
            <span className="font-medium">{crop.waybill_number}</span>
            {hasDeliveries && (
              <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                {crop.deliveries.length} ventas
              </span>
            )}
          </div>
        </td>
        <td className="py-4 px-4 text-muted-foreground">{formatDate(crop.sale_date)}</td>
        <td className="py-4 px-4 text-muted-foreground">{crop.destination}</td>
        <td className="py-4 px-4 text-right">
          <span className="font-medium">{formatNumber(crop.tn_delivered)} tn</span>
        </td>
        <td className="py-4 px-4 text-right">
          <span className="font-medium">{formatNumber(crop.tn_sold)} tn</span>
        </td>
        <td className="py-4 px-4 text-right text-muted-foreground">—</td>
        <td className="py-4 px-4 text-right">
          <span className="font-medium">
            {calculateCropTotalMoney(crop)}
          </span>
        </td>
        <td className="py-4 px-4 text-right">
          <div className="flex gap-1 justify-end">
            <Button variant="outline" size="sm"
              onClick={(e) => {
                e.stopPropagation();
                setCropToEdit(crop);
              }}>
              <Edit2 className="w-4 h-4" />
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                setCropToDelete(crop);
              }}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </td>

      </tr>
      {isExpanded &&
        crop.deliveries.map((delivery) => (
          <DeliveryRow key={delivery.id} delivery={delivery} />
        ))}
    </>
  );
}

function CampaignSection({ campaign }: { campaign: Campaign }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const totalDelivered = campaign.crops.reduce((sum, c) => sum + c.tn_delivered, 0);
  const totalSold = campaign.crops.reduce((sum, c) => sum + c.tn_sold, 0);

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
            {campaign.crops.length} cultivos
          </span>
          <span className="font-medium">
            {formatNumber(totalDelivered)} tn entregadas
          </span>
          <span className="text-primary font-semibold">
            {formatNumber(totalSold)} tn vendidas
          </span>
        </div>
      </div>

      {isExpanded && (
        <div className="border border-t-0 border-border rounded-b-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-secondary/50 text-sm text-muted-foreground">
                <th className="py-3 pl-10 pr-4 text-left font-medium">Cultivo / Entrega</th>
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
