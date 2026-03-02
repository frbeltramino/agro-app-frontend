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
  Sun,
  ChevronDown
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { DeliveriesMobileList } from "./DeliveriesMobileList";
import { SalesMobileList } from "./SalesMobileList";
import { formatTn } from "@/lib/format-tn";
import { formatCurrency } from "@/lib/currency-formatter-usd";
import { Button } from "@/components/ui/button";
import { useSaleFormStore } from "../store/useSaleForm.store";
import { useDeliveryFormStore } from "../store/useDeliveryFormStore";
import { useState } from "react";

interface CropDeliverySalesCardProps {
  crop: Crop;
}

export function CropDeliverySalesCard({ crop }: CropDeliverySalesCardProps) {
  const [open, setOpen] = useState(true);

  const openSaleForm = useSaleFormStore((s) => s.openSaleForm);
  const openDeliveryForm = useDeliveryFormStore((s) => s.openDeliveryForm);

  const totalDelivered = crop.seed_deliveries.reduce(
    (sum, d) => sum + d.tn_delivered,
    0
  );

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

  return (
    <Card className="animate-fade-in">
      <Collapsible open={open} onOpenChange={setOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="pb-4 cursor-pointer hover:bg-muted/40 transition">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <CropIcon
                    className={`w-5 h-5 ${cropColorMap[cropKey] ?? "text-primary"
                      }`}
                  />
                </div>
                <CardTitle className="text-lg">
                  {crop.crop_name}
                </CardTitle>
              </div>

              <div className="flex items-center gap-4">
                <div className="hidden sm:flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Truck className="w-4 h-4 shrink-0" />
                    {formatTn(totalDelivered)} tn
                  </div>

                  <div className="flex items-center gap-1.5">
                    <DollarSign className="w-4 h-4 shrink-0" />
                    {formatCurrency(totalRevenue)}
                  </div>
                </div>

                <ChevronDown
                  className={`w-5 h-5 transition-transform ${open ? "rotate-180" : ""
                    }`}
                />
              </div>
            </div>
          </CardHeader>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent>
            <Tabs defaultValue="deliveries" className="w-full">
              <TabsList className="mb-6 grid w-full grid-cols-2 bg-muted p-1 rounded-xl">
                <TabsTrigger
                  value="deliveries"
                  className="gap-2 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-primary font-medium cursor-pointer"
                >
                  <Truck className="w-4 h-4" />
                  Entregas ({crop.seed_deliveries.length})
                </TabsTrigger>

                <TabsTrigger
                  value="sales"
                  className="gap-2 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-primary font-medium cursor-pointer"
                >
                  <DollarSign className="w-4 h-4" />
                  Ventas ({crop.seed_sales.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="deliveries">
                <div className="mb-3 flex">
                  <Button
                    className="w-full sm:w-auto"
                    size="sm"
                    onClick={() =>
                      openDeliveryForm({
                        campaignId: crop.campaign_id,
                        cropNameId: crop.crop_name_id,
                        campaignName: crop.campaign_name,
                        cropName: crop.crop_name,
                      })
                    }
                  >
                    <Truck className="w-4 h-4 mr-1" />
                    Nueva Entrega
                  </Button>
                </div>

                <div className="md:hidden">
                  <DeliveriesMobileList
                    deliveries={crop.seed_deliveries}
                  />
                </div>

                <div className="hidden md:block">
                  <DeliveriesTable
                    deliveries={crop.seed_deliveries}
                  />
                </div>
              </TabsContent>

              <TabsContent value="sales">
                <div className="mb-3 flex">
                  <Button
                    className="w-full sm:w-auto"
                    size="sm"
                    onClick={() =>
                      openSaleForm({
                        campaignId: crop.campaign_id,
                        cropNameId: crop.crop_name_id,
                        campaignName: crop.campaign_name,
                        cropName: crop.crop_name,
                      })
                    }
                  >
                    <DollarSign className="w-4 h-4 mr-1" />
                    Nueva Venta
                  </Button>
                </div>

                <div className="md:hidden">
                  <SalesMobileList sales={crop.seed_sales} />
                </div>

                <div className="hidden md:block">
                  <SalesTable sales={crop.seed_sales} />
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}

