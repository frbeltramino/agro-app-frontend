"use client"

import { useState } from "react"
import { Plus, X, Search } from "lucide-react"
import { toast } from "sonner"

import { useSeedSales } from "@/admin/hooks/useSeedSales"
import { useSeedSaleDelivery } from "@/admin/hooks/useSeedSaleDelivery"
import { useSalesActionsStore } from "../store/useSalesActionsStore"
import { formatTn } from "@/lib/format-tn"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { PageHeader } from "@/admin/components/PageHeader"
import { CustomLoadingCard } from "@/components/custom/CustomLoadingCard"
import { CustomNoResultsCard } from "@/components/custom/CustomNoResultsCard"
import { CustomPagination } from "@/components/custom/CustomPagination"
import { DeleteDialog } from "@/admin/components/DeleteDialog"

import { SeedSalesModal } from "./SeedSalesModal"
import { SeedSaleEdit } from "./SeedSaleEdit"
import { StockCard } from "@/admin/components/StockCard"
import { SalesTable } from "./SeedSalesTable2"
import { SalesTableMobile } from "./SeedSalesMobileCard2"

import type { SeedSale } from "@/interfaces/sales/seed.sale.interface"

export const SeedSalesTable = () => {

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchWaybill, setSearchWaybill] = useState("")
  const [searchDestination, setSearchDestination] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const { mutation: mutationDelivery } = useSeedSaleDelivery();
  const [showFilters, setShowFilters] = useState(false)


  const {
    cropToEdit,
    cropToDelete,
    resetEdit,
    resetDelete,
  } = useSalesActionsStore();

  const {
    data: seedSales,
    isLoading,
    mutation,
    deleteSale,
  } = useSeedSales({
    waybill_number: searchWaybill,
    destination: searchDestination,
    start_date: startDate,
    end_date: endDate,
  })

  const seedSalesData = seedSales?.campaigns || []
  console.log({ seedSalesData })
  const seedSalesPagination = seedSales?.pagination || {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  }


  const handleAdd = () => {
    resetEdit()
    setIsModalOpen(true)
  }

  const handleDelete = (id: number | null) => {
    if (!id) return;
    deleteSale.mutate(id, {
      onSuccess: () => {
        toast.success("Venta eliminada correctamente");
      },
      onError: () => {
        toast.error("Error al eliminar la venta");
      },
    });
  };

  const handleSave = async (item: SeedSale) => {
    try {

      // Vlaidar si la venta ya existe
      const campaigns = seedSalesData;
      const crops = campaigns.flatMap(c => c.crops);
      const existingSale = crops?.find(s => s.waybill_number === item.waybill_number);
      if (existingSale) {
        toast.error("La venta con número de carta porte " + item.waybill_number + " ya existe");
        return;
      } else {
        // si no existe debo guardar la venta
        // 1️⃣ Guardar venta primero
        const savedSale = await mutation.mutateAsync(item);
        const seedSaleId = savedSale.seed_sale.id;

        // 6️⃣ Guardar/actualizar los deliveries que vinieron del frontend
        for (const delivery of item.deliveries) {
          await mutationDelivery.mutateAsync({
            id: delivery.id ?? null,
            primary_liquidation_number: delivery.primary_liquidation_number,
            seed_sale_id: seedSaleId,
            crop_name_id: item.crop_name_id,
            delivery_date: delivery.delivery_date,
            destination: delivery.destination,
            tn_delivered: delivery.tn_delivered,
            price_per_tn: delivery.price_per_tn,
          });
        }

      }

      toast.success("Venta de semillas guardada correctamente");
    } catch (error: any) {
      const message =
        error?.response?.data?.message || error?.message || "Error desconocido al crear la venta";

      toast.error(message, {
        position: "top-right",
      });
    }
  };


  //TODO: crear servicio y mostrar data de estadisticas de entregas/ventas

  const totalDelivered = 100
  const totalSold = 100

  return (
    <div className="container mx-auto  p-4 md:p-6 space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader title="Venta de Semillas" subtitle="Gestiona tus ventas y entregas" />
        <Button onClick={handleAdd} className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          Nueva Entrega
        </Button>
      </div>

      {/* Resumen de métricas */}
      <div className="grid gap-3 grid-cols-1 sm:grid-cols-3">
        <Card>
          <StockCard
            title="Total Entregas"
            value={formatTn(totalDelivered) + " tn"}
            description="Toneladas entregadas"
            isLoading={isLoading}
            isStatsError={false}
          />
        </Card>

        <Card>
          <StockCard
            title="Total Vendido"
            value={formatTn(totalSold) + " tn"}
            description="Toneladas vendidas"
            isLoading={isLoading}
            isStatsError={false}
          />
        </Card>

        <Card>
          <StockCard
            title="% Conversión"
            value={totalDelivered > 0 ? ((totalSold / totalDelivered) * 100).toFixed(1) + "%" : "0%"}
            description="De ventas totales"
            isLoading={isLoading}
            isStatsError={false}
          />
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <CardTitle className="text-base md:text-lg">Filtros</CardTitle>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setShowFilters((prev) => !prev)}
          >
            {showFilters ? (
              <X className="w-5 h-5" />
            ) : (
              <Search className="w-5 h-5" />
            )}
          </Button>
        </CardHeader>
        {showFilters && (
          <CardContent>
            <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Carta de Porte</label>
                <Input placeholder="Buscar..." value={searchWaybill} onChange={(e) => setSearchWaybill(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Destino</label>
                <Input
                  placeholder="Buscar..."
                  value={searchDestination}
                  onChange={(e) => setSearchDestination(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Desde</label>
                <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}
                  className="date-standard" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Hasta</label>
                <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)}
                  className="date-standard" />
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Tabla */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base md:text-lg">Entregas Registradas</CardTitle>
          <CardDescription>Total de {seedSalesPagination.total} registros</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            {isLoading && <CustomLoadingCard />}

            {!isLoading && seedSalesData.length === 0 &&
              <CustomNoResultsCard
                title="No se encontraron suministros"
                message="Prueba cambiando la búsqueda o los filtros."
              />
            }
            {!isLoading && seedSalesData.length > 0 &&
              <>
                {/* Mobile Cards */}
                <div className="md:hidden space-y-3">
                  <SalesTableMobile campaigns={seedSalesData} />
                  {
                    seedSalesPagination.totalPages > 1 && (
                      <CustomPagination totalPages={Number(seedSalesPagination.totalPages) || 0} />
                    )
                  }
                </div>
                {/* desktop */}
                <div className="hidden md:block overflow-x-auto">
                  <SalesTable
                    campaigns={seedSalesData}
                  />
                  {
                    seedSalesPagination.totalPages > 1 && (
                      <CustomPagination totalPages={Number(seedSalesPagination.totalPages) || 0} />
                    )
                  }
                </div>
              </>
            }
          </div>
        </CardContent>
      </Card>

      <SeedSalesModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
      // initialData={editingItem}
      />
      <DeleteDialog
        title="Eliminar venta"
        description="Esta acción no se puede deshacer."
        itemData={[
          { label: "Carta de Porte", value: cropToDelete?.waybill_number || "" },
          { label: "Fecha", value: new Date(cropToDelete?.sale_date || 0).toLocaleDateString() },
          { label: "Destino", value: cropToDelete?.destination || "" },
          { label: "tn Vendidas", value: `${cropToDelete?.tn_sold.toString()} tn` || "" },
        ]}
        isOpen={!!cropToDelete}
        itemId={cropToDelete?.id}
        onConfirm={() => {
          if (!cropToDelete) return;

          handleDelete(cropToDelete.id);
          resetDelete();
        }}
        onCancel={resetDelete}
      />
      <SeedSaleEdit
        isOpen={!!cropToEdit}
        onClose={resetEdit}
        seedSale={cropToEdit}
      />
    </div>
  )
}