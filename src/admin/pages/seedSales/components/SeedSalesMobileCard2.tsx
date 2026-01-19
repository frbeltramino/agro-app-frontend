import { useState } from "react";
import { Leaf, Edit2, Trash2, ChevronDown, ChevronRight } from "lucide-react";
import { Campaign, Crop, } from "@/interfaces/sales/campaign.sales.response";
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
  if (!crop.deliveries || crop.deliveries.length === 0) return "—";
  const total = crop.deliveries.reduce(
    (sum, d) => sum + (d.tn_delivered || 0) * (d.price_per_tn || 0),
    0
  );
  return formatCurrency(total);
}

function CropCard({ crop }: { crop: Crop }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasDeliveries = crop.deliveries.length > 0;
  const setCropToEdit = useSalesActionsStore((s) => s.setCropToEdit);
  const setCropToDelete = useSalesActionsStore((s) => s.setCropToDelete);
  const icon = getCropIcon(crop.crop_name) || <Leaf className="h-4 w-4" />;

  return (
    <div className="border rounded-lg p-4 shadow-sm mb-4 ">
      <div className="flex items-center justify-between cursor-pointer" onClick={() => hasDeliveries && setIsExpanded(!isExpanded)}>
        <div className="flex items-center gap-3">
          {hasDeliveries && (isExpanded ? <ChevronDown /> : <ChevronRight />)}
          <span>{icon}</span>
          <div>
            <p className="font-medium">{crop.crop_name}</p>
            <p className="text-sm text-muted-foreground">{crop.waybill_number}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); setCropToEdit(crop); }}>
            <Edit2 className="w-4 h-4" />
          </Button>
          <Button variant="destructive" size="sm" onClick={(e) => { e.stopPropagation(); setCropToDelete(crop); }}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Info resumida */}
      <div className="mt-2 grid grid-cols-2 gap-2 text-sm text-muted-foreground">
        <div>Fecha: {formatDate(crop.sale_date)}</div>
        <div>Destino: {crop.destination}</div>
        <div>Entregadas: {formatNumber(crop.tn_delivered)} tn</div>
        <div>Vendidas: {formatNumber(crop.tn_sold)} tn</div>
        <div>Total: {calculateCropTotalMoney(crop)}</div>
      </div>

      {/* Entregas expandibles */}
      {isExpanded && hasDeliveries && (
        <div className="mt-3 border-t pt-2">
          {crop.deliveries.map((d) => (
            <div key={d.id} className="flex justify-between text-sm py-1">
              <div>
                <p className="font-medium">{d.primary_liquidation_number}</p>
                <p className="text-muted-foreground">{formatDate(d.delivery_date)} - {d.destination}</p>
              </div>
              <div className="text-right">
                <p>{formatNumber(d.tn_delivered)} tn</p>
                <p>{formatCurrency(d.price_per_tn)}</p>
                <p className="font-semibold">{formatCurrency(d.tn_delivered * d.price_per_tn)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function CampaignCard({ campaign }: { campaign: Campaign }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const totalDelivered = campaign.crops.reduce((sum, c) => sum + c.tn_delivered, 0);
  const totalSold = campaign.crops.reduce((sum, c) => sum + c.tn_sold, 0);

  return (
    <div className="mb-6">
      <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 cursor-pointer flex justify-between" onClick={() => setIsExpanded(!isExpanded)}>
        <div>
          <p className="font-semibold text-lg">Campaña {campaign.campaign_name}</p>
          <p className="text-sm text-muted-foreground">{campaign.crops.length} cultivos</p>
        </div>
        <div className="text-right">
          <p className="font-medium">{formatNumber(totalDelivered)} tn entregadas</p>
          <p className="font-semibold text-primary">{formatNumber(totalSold)} tn vendidas</p>
        </div>
      </div>
      {isExpanded && (
        <div className="mt-2">
          {campaign.crops.map((crop) => (
            <CropCard key={crop.crop_name_id} crop={crop} />
          ))}
        </div>
      )}
    </div>
  );
}

export function SalesTableMobile({ campaigns }: SalesTableProps) {
  return (
    <div className="space-y-6">
      {campaigns.map((c) => (
        <CampaignCard key={c.campaign_id} campaign={c} />
      ))}
    </div>
  );
}
