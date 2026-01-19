import { useState } from "react";
import { Leaf, Edit2, Trash2, ChevronDown, ChevronRight } from "lucide-react";
import { Campaign, Crop, } from "@/interfaces/sales/campaign.sales.response";
import { Button } from "@/components/ui/button";
import { useSalesActionsStore } from "@/admin/pages/seedSales/store/useSalesActionsStore";
import { formatCurrency } from "@/lib/currency-formatter-usd";
import { formatDate } from "@/lib/format-date";
import { getCropIcon } from "@/constants/crop-icons";
import { Delivery } from "@/interfaces/sales/seed.sale.delivery.interface";
import { SeedSale } from "@/interfaces/sales/seed.sale.interface";

interface SalesTableProps {
  campaigns: Campaign[];
}

function formatNumber(num: number): string {
  return new Intl.NumberFormat("es-AR").format(num);
}


function CropCard({ crop }: { crop: Crop }) {
  const [open, setOpen] = useState(false);
  const icon = getCropIcon(crop.crop_name) || <Leaf className="h-4 w-4" />;

  const totalDelivered = crop.seed_sales.reduce((s, ss) => s + ss.tn_delivered, 0);
  const totalSold = crop.seed_sales.reduce((s, ss) => s + ss.tn_sold, 0);

  return (
    <div className="border rounded-lg p-4 shadow-sm mt-3">
      <div
        className="flex justify-between items-start cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        {/* IZQUIERDA */}
        <div className="flex items-start gap-2">
          <span className="mt-1">{icon}</span>

          <div>
            <p className="font-semibold">{crop.crop_name}</p>
            <p className="text-xs text-muted-foreground">
              {crop.seed_sales.length} entregas
            </p>

            <div className="mt-1">
              {open ? (
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              ) : (
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              )}
            </div>
          </div>
        </div>

        {/* DERECHA */}
        <div className="text-right">
          <p className="text-sm font-medium">
            {formatNumber(totalDelivered)} tn
          </p>
          <p className="text-xs text-muted-foreground">
            Vendido: {formatNumber(totalSold)} tn
          </p>
        </div>
      </div>

      {open && (
        <div className="mt-3">
          {crop.seed_sales.map(ss => (
            <SeedSaleCard key={ss.id} seedSale={ss} />
          ))}
        </div>
      )}
    </div>
  );
}

function CampaignCard({ campaign }: { campaign: Campaign }) {
  const [open, setOpen] = useState(true);

  const totalSold = campaign.crops.reduce(
    (s, c) => s + c.seed_sales.reduce((x, ss) => x + ss.tn_sold, 0),
    0
  );

  const totalDelivered = campaign.crops.reduce(
    (s, c) => s + c.seed_sales.reduce((x, ss) => x + ss.tn_delivered, 0),
    0
  );

  return (
    <div className="mb-6">
      <div
        className="bg-primary/5 border border-primary/20 rounded-lg p-3 flex justify-between cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        <div>
          <p className="font-semibold text-lg">
            Campaña {campaign.campaign_name}
          </p>
          <p className="text-sm text-muted-foreground">
            {campaign.crops.length} cultivos
          </p>
        </div>

        <div className="text-right">
          <p className="font-medium">{formatNumber(totalDelivered)} tn</p>
          <p className="font-semibold text-primary">
            {formatNumber(totalSold)} tn
          </p>
        </div>
      </div>

      {open && (
        <div className="mt-2">
          {campaign.crops.map(crop => (
            <CropCard key={crop.crop_name_id} crop={crop} />
          ))}
        </div>
      )}
    </div>
  );
}

function SeedSaleCard({ seedSale }: { seedSale: SeedSale }) {
  const [open, setOpen] = useState(false);
  const hasDeliveries = seedSale.deliveries.length > 0;

  const { setCropToEdit, setCropToDelete } = useSalesActionsStore();

  return (
    <div className="border rounded-md p-3 mt-2 bg-muted/30">
      <div className="flex justify-between items-start">
        {/* IZQUIERDA */}
        <div
          className="cursor-pointer"
          onClick={() => hasDeliveries && setOpen(!open)}
        >
          <p className="font-medium">{seedSale.waybill_number}</p>
          <p className="text-xs text-muted-foreground">
            {formatDate(seedSale.sale_date)} • {seedSale.destination}
          </p>

          <p className="mt-1 text-sm font-medium">
            {formatNumber(seedSale.tn_delivered)} / {formatNumber(seedSale.tn_sold)} tn
          </p>

          {hasDeliveries && (
            <div className="mt-1">
              {open ? (
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              ) : (
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              )}
            </div>
          )}
        </div>

        {/* DERECHA */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              setCropToEdit(seedSale);
            }}
          >
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
      </div>

      {open && (
        <div className="mt-2">
          {seedSale.deliveries.map(d => (
            <DeliveryRow key={d.id} delivery={d} />
          ))}
        </div>
      )}
    </div>
  );
}


function DeliveryRow({ delivery }: { delivery: Delivery }) {
  return (
    <div className="flex justify-between text-sm py-2 border-t">
      <div>
        <p className="font-medium">{delivery.primary_liquidation_number}</p>
        <p className="text-muted-foreground">
          {formatDate(delivery.delivery_date)} • {delivery.destination}
        </p>
      </div>
      <div className="text-right">
        <p>{formatNumber(delivery.tn_delivered)} tn</p>
        <p>{formatCurrency(delivery.price_per_tn)}</p>
        <p className="font-semibold text-primary">
          {formatCurrency(delivery.tn_delivered * delivery.price_per_tn)}
        </p>
      </div>
    </div>
  );
}

export function SalesTableMobile({ campaigns }: SalesTableProps) {
  return (
    <div className="space-y-6">
      {campaigns.map(c => (
        <CampaignCard key={c.campaign_id} campaign={c} />
      ))}
    </div>
  );
}
