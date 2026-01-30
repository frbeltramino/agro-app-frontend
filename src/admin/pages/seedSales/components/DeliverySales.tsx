import { useState, useMemo, useEffect } from "react";
import { Wheat, Truck, Filter, X, Search } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { CropDeliverySalesCard } from "./CropDeliverySalesCard";

import { PageHeader } from "@/admin/components/PageHeader";
import { useCampaigns } from "@/admin/hooks/useCampaigns";
import { useSeedSales } from "@/admin/hooks/useSeedSale";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CropSaleForm } from "./CropSaleForm";
import { SeedDeliveryForm } from "./SeedDeliveryForm";
import { useSaleFormStore } from "../store/useSaleForm.store";
import { CustomErrorSection } from "@/components/custom/CustomErrorSection";
import { CustomLoadingCard } from "@/components/custom/CustomLoadingCard";
import { useDeliveryFormStore } from "../store/useDeliveryFormStore";
import { CropDeliveryForm } from "./CropDeliveryForm";
import { DeleteDialog } from "@/admin/components/DeleteDialog";
import { useSalesActionsStore } from "../store/useSalesActionsStore";
import { formatTn } from "@/lib/format-tn";
import { toast } from "sonner";
import { useDeliveriesActionsStore } from "../store/useDeliveriesActionsStore";
import { formatDate } from "@/lib/format-date";
import { useSeedSaleDelivery } from "@/admin/hooks/useSeedSaleDelivery";
import { CustomNoResultsCard } from "@/components/custom/CustomNoResultsCard";

export const DeliverySales = () => {

  // Filter states
  const [selectedCrop, setSelectedCrop] = useState<string>("all");
  const [selectedDestination, setSelectedDestination] = useState<string>("all");
  const [dateFrom, setDateFrom] = useState<string | undefined>('');
  const [dateTo, setDateTo] = useState<string | undefined>('');
  const [showFilters, setShowFilters] = useState(false);
  const [isDeliveryOpen, setIsDeliveryOpen] = useState(false);
  const { data: campaignsData, isLoading: isLoadingCampaigns } = useCampaigns();
  const { isSaleFormOpen, closeSaleForm } = useSaleFormStore();
  const { isDeliveryFormOpen, closeDeliveryForm } = useDeliveryFormStore();
  const { isDeleteDialogOpen, closeDeleteDialog, saleToDelete, resetDelete: resetDeleteSale } = useSalesActionsStore();
  const { isDeleteDialogOpen: isDeliveryDeleteDialogOpen, closeDeleteDialog: closeDeliveryDeleteDialog, deliveryToDelete, resetDelete: resetDeleteDelivery } = useDeliveriesActionsStore();
  const { deleteSale } = useSeedSales({})
  const { deleteSaleDelivery: deleteDelivery } = useSeedSaleDelivery()

  const campaigns = campaignsData?.campaigns || [];

  const [selectedCampaignId, setSelectedCampaignId] = useState<string>("");

  useEffect(() => {
    if (!isLoadingCampaigns && campaigns.length > 0 && !selectedCampaignId) {
      setSelectedCampaignId(campaigns[0].id.toString());
    }
  }, [isLoadingCampaigns, campaigns, selectedCampaignId]);

  const {
    data: deliverySalesData,
    isLoading: isLoadingDeliverySales,
    isError: isErrorDeliverySales,
  } = useSeedSales({
    waybill_number: "",
    destination: "",
    start_date: "",
    end_date: "",
  })

  const selectedCampaign = deliverySalesData?.campaigns.find(
    (c) => c.campaign_id.toString() === selectedCampaignId
  );

  // Get unique crops and destinations for filter options
  const filterOptions = useMemo(() => {
    if (!selectedCampaign) return { crops: [], destinations: [] };

    const crops = [...new Set(selectedCampaign.crops.map((c) => c.crop_name))];
    const destinations = new Set<string>();

    selectedCampaign.crops.forEach((crop) => {
      crop.seed_deliveries.forEach((d) => destinations.add(d.destination));
      crop.seed_sales.forEach((s) => destinations.add(s.destination));
    });

    return {
      crops,
      destinations: [...destinations],
    };
  }, [selectedCampaign]);

  // Filter crops based on selected filters
  const filteredCrops = useMemo(() => {
    if (!selectedCampaign) return [];

    return selectedCampaign.crops
      .filter((crop) => {
        if (selectedCrop !== "all" && crop.crop_name !== selectedCrop) {
          return false;
        }
        return true;
      })
      .map((crop) => {
        // Filter deliveries and sales by destination and date
        const filteredDeliveries = crop.seed_deliveries.filter((d) => {
          if (selectedDestination !== "all" && d.destination !== selectedDestination) {
            return false;
          }
          if (dateFrom) {
            const from = new Date(dateFrom + "T00:00:00");
            const deliveryDate = new Date(d.delivery_date);

            if (deliveryDate < from) return false;
          }

          if (dateTo) {
            const to = new Date(dateTo + "T23:59:59");
            const deliveryDate = new Date(d.delivery_date);

            if (deliveryDate > to) return false;
          }
          return true;
        });

        const filteredSales = crop.seed_sales.filter((s) => {
          if (selectedDestination !== "all" && s.destination !== selectedDestination) {
            return false;
          }
          if (dateFrom) {
            const from = new Date(dateFrom + "T00:00:00");
            const saleDate = new Date(s.sale_date);

            if (saleDate < from) return false;
          }

          if (dateTo) {
            const to = new Date(dateTo + "T23:59:59");
            const saleDate = new Date(s.sale_date);

            if (saleDate > to) return false;
          }
          return true;
        });

        return {
          ...crop,
          seed_deliveries: filteredDeliveries,
          seed_sales: filteredSales,
        };
      })
      .filter((crop) => crop.seed_deliveries.length > 0 || crop.seed_sales.length > 0);
  }, [selectedCampaign, selectedCrop, selectedDestination, dateFrom, dateTo]);

  const clearFilters = () => {
    setSelectedCrop("all");
    setSelectedDestination("all");
    setDateFrom('');
    setDateTo('');
  };


  const hasActiveFilters =
    selectedCrop !== "all" ||
    selectedDestination !== "all" ||
    dateFrom !== '' ||
    dateTo !== '';

  const handleDeleteSale = async (saleId: number) => {
    if (saleId === null) return;
    await deleteSale.mutateAsync(saleId, {
      onSuccess: () => toast.success("Venta borrada exitosamente"

      ),
      onError: (error) => {
        console.log(error);
        toast.error("Error al borrar la venta", { position: 'top-right' });
      }
    },

    );
    closeDeleteDialog()
    resetDeleteSale()
  };

  const handleDeleteDelivery = async (deliveryId: number) => {
    if (deliveryId === null) return;
    await deleteDelivery.mutateAsync(deliveryId, {
      onSuccess: () => toast.success("Entrega borrada exitosamente"

      ),
      onError: (error: any) => {
        console.log(error);
        toast.error("Error al borrar la entrega", { position: 'top-right' });
      }
    },

    );
    closeDeliveryDeleteDialog()
    resetDeleteDelivery()
  };

  return (
    <>

      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className=" bg-background">
          <div className="container mx-auto px-4 py-4 md:py-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

              {/* Title */}
              <PageHeader
                title="Entregas y Ventas"
                subtitle="Gestión de entregas y ventas por campaña"
              />

              {/* Actions */}
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-2">
                {/* Botones */}
                <div className="flex gap-2 w-full sm:w-auto">
                  <Button
                    className="flex-1 w-full sm:w-auto justify-center"
                    onClick={() => setIsDeliveryOpen(true)}
                  >
                    <Truck className="w-4 h-4 mr-1" />
                    Nueva Entrega
                  </Button>
                </div>

                {/* Select */}
                <Select
                  value={selectedCampaignId}
                  onValueChange={setSelectedCampaignId}
                  disabled={isLoadingCampaigns}
                >
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Seleccionar campaña" />
                  </SelectTrigger>
                  <SelectContent>
                    {isLoadingCampaigns ? (
                      <SelectItem value="loading" disabled>
                        Cargando...
                      </SelectItem>
                    ) : (
                      campaigns.map((campaign) => (
                        <SelectItem key={campaign.id} value={campaign.id.toString()}>
                          Campaña {campaign.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

            </div>
          </div>
        </header>

        {isErrorDeliverySales && (
          <CustomErrorSection
            message="No se pudo obtener la información de esta campaña. Intenta recargar o contacta al soporte."

            showButton={false} // o false si no quieres mostrar el botón
          />
        )}
        {
          !isErrorDeliverySales && (
            <main className="container mx-auto px-4 space-y-6">
              {isLoadingDeliverySales && !selectedCampaign &&
                (
                  <CustomLoadingCard />
                )}

              {!isLoadingDeliverySales && selectedCampaign && (
                <>
                  {/* Filters Section */}
                  <div className="bg-card border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Filter className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-medium text-foreground">Filtros</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {/* Botón toggle */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowFilters(!showFilters)}
                        >
                          <Search className="w-4 h-4" />
                        </Button>

                        {/* Limpiar filtros solo si hay filtros activos */}
                        {hasActiveFilters && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={clearFilters}
                            className="text-muted-foreground hover:text-foreground"
                          >
                            <X className="w-4 h-4 mr-1" />
                            Limpiar filtros
                          </Button>
                        )}
                      </div>
                    </div>
                    {showFilters && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Crop Filter */}
                        <div className="space-y-1.5 w-full">
                          <label className="text-xs text-muted-foreground">Cultivo</label>
                          <Select value={selectedCrop} onValueChange={setSelectedCrop}>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Todos los cultivos" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">Todos los cultivos</SelectItem>
                              {filterOptions.crops.map((crop) => (
                                <SelectItem key={crop} value={crop}>
                                  {crop}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Destination Filter */}
                        <div className="space-y-1.5 w-full">
                          <label className="text-xs text-muted-foreground">Destino</label>
                          <Select value={selectedDestination} onValueChange={setSelectedDestination}>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Todos los destinos" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">Todos los destinos</SelectItem>
                              {filterOptions.destinations.map((dest) => (
                                <SelectItem key={dest} value={dest}>
                                  {dest}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Date From */}
                        <div className="space-y-1.5">
                          <label className="text-xs text-muted-foreground">Fecha desde</label>

                          <Input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)}
                            className="date-standard" />

                        </div>

                        {/* Date To */}
                        <div className="space-y-1.5">
                          <label className="text-xs text-muted-foreground">Fecha hasta</label>
                          <Input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)}
                            className="date-standard" />

                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Wheat className="w-5 h-5" />
                    <span className="text-sm">
                      {filteredCrops.length} cultivo
                      {filteredCrops.length !== 1 ? "s" : ""} en campaña{" "}
                      {selectedCampaign.campaign_name}
                      {hasActiveFilters && " (filtrado)"}
                    </span>
                  </div>

                  <div className="space-y-4">
                    {filteredCrops.length > 0 ? (
                      filteredCrops.map((crop) => (
                        <CropDeliverySalesCard
                          key={`${crop.campaign_id}-${crop.crop_name_id}`}
                          crop={crop}
                        />
                      ))
                    ) : (
                      <div className="text-center py-12 bg-card border border-border rounded-lg">
                        <p className="text-muted-foreground">
                          No hay resultados con los filtros seleccionados
                        </p>
                        <Button
                          variant="link"
                          onClick={clearFilters}
                          className="mt-2"
                        >
                          Limpiar filtros
                        </Button>
                      </div>
                    )}
                  </div>
                </>
              )}

              {!isLoadingDeliverySales && !selectedCampaign && (

                <CustomNoResultsCard
                  title="No hay Entregas o ventas para esta campaña"
                  message="Necesita tener cosechas en la campaña para poder crear las entregas y ventas."

                />



              )}


            </main>
          )
        }





        <footer className="container mx-auto px-4 py-4 space-y-6 text-center">
        </footer>

      </div >

      <SeedDeliveryForm
        isOpen={isDeliveryOpen}
        onClose={() => setIsDeliveryOpen(false)}
        onOpenChange={setIsDeliveryOpen}
      />

      <CropSaleForm
        isOpen={isSaleFormOpen}
        onClose={closeSaleForm}
      />

      <CropDeliveryForm
        isOpen={isDeliveryFormOpen}
        onClose={closeDeliveryForm}
      />


      <DeleteDialog
        title="Eliminar Venta"
        description="Esta acción no se puede deshacer."
        itemId={saleToDelete?.id}
        itemData={[
          { label: "Campaña", value: saleToDelete?.campaign_name || "" },
          { label: "Cultivo", value: saleToDelete?.crop_name || "" },
          { label: "Nº Liquidación", value: saleToDelete?.primary_liquidation_number || "" },
          { label: "Destino", value: saleToDelete?.destination || "" },
          { label: "Fecha", value: saleToDelete?.sale_date ? new Date(saleToDelete?.sale_date).toLocaleDateString() : "No hay fecha de venta" },
          { label: "Tn Vendidas", value: saleToDelete?.tn_sold ? formatTn(saleToDelete?.tn_sold) + " tn" : "No hay tn vendidas" },

        ]}
        isOpen={isDeleteDialogOpen}
        onConfirm={handleDeleteSale}
        onCancel={closeDeleteDialog}

      />

      <DeleteDialog
        title="Eliminar Entrega"
        description="Esta acción no se puede deshacer."
        itemId={deliveryToDelete?.id}
        itemData={[
          { label: "Campaña", value: deliveryToDelete?.campaign_name || "" },
          { label: "Cultivo", value: deliveryToDelete?.crop_name || "" },
          { label: "Carta de Porte", value: deliveryToDelete?.waybill_number || "" },
          { label: "Destino", value: deliveryToDelete?.destination || "" },
          { label: "Fecha", value: deliveryToDelete?.delivery_date ? formatDate(deliveryToDelete?.delivery_date) : "No hay fecha de venta" },
          { label: "Tn Entregadas", value: deliveryToDelete?.tn_delivered ? formatTn(deliveryToDelete?.tn_delivered) + " tn" : "No hay tn vendidas" },

        ]}
        isOpen={isDeliveryDeleteDialogOpen}
        onConfirm={handleDeleteDelivery}
        onCancel={closeDeliveryDeleteDialog}

      />
    </>
  );
};

