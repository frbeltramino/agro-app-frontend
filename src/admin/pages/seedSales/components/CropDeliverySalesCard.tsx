import { Crop } from "@/interfaces/sales/campaign.sales.response";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DeliveriesTable } from "./DeliveriesTable";
import { SalesTable } from "./SalesTable";
import {
  Truck,
  DollarSign,
  Wheat,
  Leaf,
  Sprout,
  Sun
} from "lucide-react";
import { DeliveriesMobileList } from "./DeliveriesMobileList";
import { SalesMobileList } from "./SalesMobileList";
import { formatTn } from "@/lib/format-tn";
import { formatCurrency } from "@/lib/currency-formatter-usd";
import { Button } from "@/components/ui/button";
import { useSaleFormStore } from "../store/useSaleForm.store";
import { useDeliveryFormStore } from "../store/useDeliveryFormStore";

interface CropDeliverySalesCardProps {
  crop: Crop;
}

export function CropDeliverySalesCard({ crop }: CropDeliverySalesCardProps) {

  const openSaleForm = useSaleFormStore((s) => s.openSaleForm);
  const openDeliveryForm = useDeliveryFormStore((s) => s.openDeliveryForm);

  const totalDelivered = crop.seed_deliveries.reduce(
    (sum, d) => sum + d.tn_delivered,
    0
  );
  // const totalSold = crop.seed_sales.reduce((sum, s) => sum + s.tn_sold, 0);
  const totalRevenue = crop.seed_sales.reduce(
    (sum, s) => sum + s.tn_sold * s.price_per_tn,
    0
  );

  const cropIconMap: Record<string, React.ElementType> = {
    alfalfa: Leaf,
    girasol: Sun,
    maíz: Sprout,
    soja: Leaf,
    sorgo: Sprout,
    trigo: Wheat,
  };

  const cropColorMap: Record<string, string> = {
    alfalfa: "text-green-600",
    girasol: "text-yellow-500",
    maíz: "text-amber-600",
    soja: "text-emerald-600",
    sorgo: "text-lime-600",
    trigo: "text-yellow-700",
  };

  const cropKey = crop.crop_name.toLowerCase();
  const CropIcon = cropIconMap[cropKey] ?? Wheat;

  const handleNewSale = () => {
    openSaleForm({
      campaignId: crop.campaign_id,
      cropNameId: crop.crop_name_id,
      campaignName: crop.campaign_name,
      cropName: crop.crop_name,
    });
  }

  const handleNewDelivery = () => {
    openDeliveryForm({
      campaignId: crop.campaign_id,
      cropNameId: crop.crop_name_id,
      campaignName: crop.campaign_name,
      cropName: crop.crop_name,
    })
    console.log(crop);
  }

  return (
    <Card className="animate-fade-in">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <CropIcon className={`w-5 h-5 ${cropColorMap[cropKey] ?? "text-primary"}`} />
            </div>
            <CardTitle className="text-lg">{crop.crop_name}</CardTitle>
          </div>
          <div className="flex flex-col gap-2 text-sm sm:flex-row sm:items-center sm:gap-4">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Truck className="w-4 h-4 shrink-0" />
              <span className="whitespace-nowrap">
                {formatTn(totalDelivered)} tn entregadas
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-muted-foreground">
              <DollarSign className="w-4 h-4 shrink-0" />
              <span className="whitespace-nowrap">
                {formatCurrency(totalRevenue)} vendido
              </span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="deliveries" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="deliveries" className="gap-2">
              <Truck className="w-4 h-4" />
              Entregas ({crop.seed_deliveries.length})
            </TabsTrigger>
            <TabsTrigger value="sales" className="gap-2">
              <DollarSign className="w-4 h-4" />
              Ventas ({crop.seed_sales.length})
            </TabsTrigger>
          </TabsList>
          <TabsContent value="deliveries">
            <div className="mb-3 flex">
              <Button
                className="w-full sm:w-auto"
                size="sm"
                onClick={handleNewDelivery}
              >
                <Truck className="w-4 h-4 mr-1" />
                Nueva Entrega
              </Button>
            </div>
            <div className="md:hidden">
              <DeliveriesMobileList deliveries={crop.seed_deliveries} />
            </div>

            {/* Desktop */}
            <div className="hidden md:block">
              <DeliveriesTable deliveries={crop.seed_deliveries} />
            </div>

          </TabsContent>
          <TabsContent value="sales">
            <div className="mb-3 flex">
              <Button
                className="w-full sm:w-auto"
                size="sm"
                onClick={handleNewSale}
              >
                <DollarSign className="w-4 h-4 mr-1" />
                Nueva Venta
              </Button>
            </div>
            {/* Mobile */}
            <div className="md:hidden">
              <SalesMobileList sales={crop.seed_sales} />
            </div>

            {/* Desktop */}
            <div className="hidden md:block">
              <SalesTable sales={crop.seed_sales} />
            </div>

          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
