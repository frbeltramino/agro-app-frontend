"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Plus, Trash2, Edit2, ChevronDown, ChevronRight } from "lucide-react"
import { toast } from "sonner"
import { SeedSalesModal } from "./SeedSalesModal"
import { useSeedSales } from "@/admin/hooks/useSeedSales"
import type { SeedSale } from "@/interfaces/sales/seed.sale.interface"
import { PageHeader } from "@/admin/components/PageHeader"
import { StockCard } from "@/admin/components/StockCard"
import { CustomLoadingCard } from "@/components/custom/CustomLoadingCard"
import { CustomNoResultsCard } from "@/components/custom/CustomNoResultsCard"
import { CustomPagination } from "@/components/custom/CustomPagination"
import { DeleteDialog } from "@/admin/components/DeleteDialog"
import { formatKg } from "@/lib/format-kg"
import { currencyFormatter } from "@/lib/currency-formatter"
import { useCropsToSale } from "@/admin/hooks/useCropsToSale"
import { useSeedSaleDelivery } from "@/admin/hooks/useSeedSaleDelivery"
import { Delivery } from "@/interfaces/sales/seed.sale.delivery.interface"

export const SeedSalesTable = () => {
  const [deletingItem, setDeletingItem] = useState<SeedSale | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<SeedSale | null>(null)
  const [searchWaybill, setSearchWaybill] = useState("")
  const [searchDestination, setSearchDestination] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const { data: cropsToSale } = useCropsToSale();
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set())
  const crops = cropsToSale?.crops || [];
  const { mutation: mutationDelivery, deleteSaleDelivery } = useSeedSaleDelivery();

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

  const seedSalesData = seedSales?.seed_sales || []
  const seedSalesPagination = seedSales?.pagination || {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  }

  const toggleRow = (saleId: number) => {
    const newExpandedRows = new Set(expandedRows)
    if (newExpandedRows.has(saleId)) {
      newExpandedRows.delete(saleId)
    } else {
      newExpandedRows.add(saleId)
    }
    setExpandedRows(newExpandedRows)
  }

  const handleAdd = () => {
    setEditingItem(null)
    setIsModalOpen(true)
  }

  const handleEdit = (item: SeedSale) => {
    console.log({ item })
    setEditingItem(item)
    setIsModalOpen(true)
  }

  const handleDelete = (itemId: any) => {
    deleteSale.mutateAsync(itemId, {
      onSuccess: () => toast.success("Venta eliminada correctamente"),
      onError: (error) => {
        console.log(error)
        toast.error("Error al eliminar la venta de semillas", { position: "top-right" })
      },
    })
  }

  const handleSave = async (item: SeedSale) => {
    try {

      // Vlaidar si la venta ya existe
      const existingSale = seedSalesData?.find(s => s.waybill_number === item.waybill_number);
      if (existingSale) {
        // si existe debo buscar los deliveries existentes y ver si se agregaron o se eliminaron algunos
        // 2️⃣ Obtener los deliveries existentes en la DB
        const existingDeliveries: Delivery[] = existingSale.deliveries || [];
        const existingIds = existingDeliveries.map(d => d.id);

        // 3️⃣ Obtener los IDs de los deliveries que vinieron del frontend
        const incomingIds = item.deliveries.filter(d => d.id).map(d => d.id);

        // 4️⃣ Detectar deliveries que se eliminaron (existían antes, pero no vienen en la edición)
        const toDeleteIds = existingIds.filter(id => !incomingIds.includes(id));

        // 5️⃣ Eliminar esos deliveries
        for (const id of toDeleteIds) {
          await deleteSaleDelivery.mutateAsync(
            id
          );
        }

        if (incomingIds.length > 0) {
          // 6️⃣ Guardar/actualizar los deliveries que vinieron del frontend
          for (const delivery of item.deliveries) {
            await mutationDelivery.mutateAsync({
              id: delivery.id ?? null,
              seed_sale_id: existingSale.id,
              crop_id: item.crop_id,
              delivery_date: delivery.delivery_date,
              destination: delivery.destination,
              kg_delivered: delivery.kg_delivered,
              price_per_kg: delivery.price_per_kg,
            });
          }
        }

        //Actualizo la data de la venta 
        await mutation.mutateAsync(item);
      } else {
        // si no existe debo guardar la venta
        // 1️⃣ Guardar venta primero
        const savedSale = await mutation.mutateAsync(item);
        const seedSaleId = savedSale.seed_sale.id;

        // 6️⃣ Guardar/actualizar los deliveries que vinieron del frontend
        for (const delivery of item.deliveries) {
          await mutationDelivery.mutateAsync({
            id: delivery.id ?? null,
            seed_sale_id: seedSaleId,
            crop_id: item.crop_id,
            delivery_date: delivery.delivery_date,
            destination: delivery.destination,
            kg_delivered: delivery.kg_delivered,
            price_per_kg: delivery.price_per_kg,
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

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { variant: any; label: string }> = {
      pending: { variant: "secondary", label: "Pendiente" },
      completed: { variant: "default", label: "Completado" },
      cancelled: { variant: "destructive", label: "Cancelado" },
    }
    const badge = badges[status] || badges.pending
    return <Badge variant={badge.variant}>{badge.label}</Badge>
  }

  const calculatePercentage = (kg_sold: number, kg_delivered: number) => {
    return kg_delivered > 0 ? ((kg_sold / kg_delivered) * 100).toFixed(1) : "0"
  }

  const totalDelivered = seedSalesData.reduce((sum, item) => sum + item.kg_delivered, 0)
  const totalSold = seedSalesData.reduce((sum, item) => sum + item.kg_sold, 0)

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader title="Venta de Semillas" subtitle="Gestiona tus ventas y entregas" />
        <Button onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" />
          Nueva Venta
        </Button>
      </div>

      {/* Resumen de métricas */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <StockCard
            title="Total Entregas"
            value={formatKg(totalDelivered) + " kg"}
            description="Kilogramos entregados"
            isLoading={isLoading}
            isStatsError={false}
          />
        </Card>

        <Card>
          <StockCard
            title="Total Vendido"
            value={formatKg(totalSold) + " kg"}
            description="Kilogramos vendidos"
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
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div>
              <label className="block text-sm font-medium mb-2">Carta de Porte</label>
              <Input placeholder="Buscar..." value={searchWaybill} onChange={(e) => setSearchWaybill(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Destino</label>
              <Input
                placeholder="Buscar..."
                value={searchDestination}
                onChange={(e) => setSearchDestination(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Desde</label>
              <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Hasta</label>
              <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabla */}
      <Card>
        <CardHeader>
          <CardTitle>Entregas Registradas</CardTitle>
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
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12"></TableHead>
                      <TableHead>Carta de Porte</TableHead>
                      <TableHead>Destino</TableHead>
                      <TableHead>Fecha</TableHead>
                      <TableHead className="text-right">KG Entregados</TableHead>
                      <TableHead className="text-right">KG Vendidos</TableHead>
                      <TableHead className="text-center">% Venta</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {seedSalesData.map((item) => (
                      <>
                        <TableRow key={item.id} className="cursor-pointer hover:bg-muted/50">
                          <TableCell onClick={() => toggleRow(item.id!)}>
                            {expandedRows.has(item.id!) ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                          </TableCell>
                          <TableCell className="font-medium">{item.waybill_number}</TableCell>
                          <TableCell>{item.destination}</TableCell>
                          <TableCell>{new Date(item.sale_date).toLocaleDateString()}</TableCell>
                          <TableCell className="text-right font-semibold">{formatKg(item.kg_delivered || 0)}</TableCell>
                          <TableCell className="text-right font-semibold">{formatKg(item.kg_sold || 0)}</TableCell>
                          <TableCell className="text-center">
                            {calculatePercentage(item.kg_sold, item.kg_delivered)}%
                          </TableCell>
                          <TableCell>{getStatusBadge(item.status)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex gap-2 justify-end">
                              <Button variant="outline" size="sm" onClick={() => handleEdit(item)}>
                                <Edit2 className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => {
                                  setDeletingItem(item)
                                  setIsDeleteDialogOpen(true)
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                        {expandedRows.has(item.id!) && (
                          <TableRow>
                            <TableCell colSpan={9} className="bg-muted/30 p-0">
                              <div className="p-4">
                                <h4 className="font-semibold mb-3 text-sm">Ventas Realizadas</h4>
                                {item.deliveries && item.deliveries.length > 0 ? (
                                  <div className="rounded-lg border">
                                    <Table>
                                      <TableHeader>
                                        <TableRow>
                                          <TableHead>Fecha de Entrega</TableHead>
                                          <TableHead>Destino</TableHead>
                                          <TableHead className="text-right">KG Vendidos</TableHead>
                                          <TableHead className="text-right">Precio/KG</TableHead>
                                          <TableHead className="text-right">Total</TableHead>
                                        </TableRow>
                                      </TableHeader>
                                      <TableBody>
                                        {item.deliveries.map((delivery) => (
                                          <TableRow key={delivery.id}>
                                            <TableCell>
                                              {new Date(delivery.delivery_date).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell>{delivery.destination}</TableCell>
                                            <TableCell className="text-right">
                                              {formatKg(delivery.kg_delivered)}
                                            </TableCell>
                                            <TableCell className="text-right">
                                              {currencyFormatter(delivery.price_per_kg)}
                                            </TableCell>
                                            <TableCell className="text-right font-semibold">
                                              {currencyFormatter(delivery.kg_delivered * delivery.price_per_kg)}
                                            </TableCell>
                                          </TableRow>
                                        ))}
                                        <TableRow className="font-semibold bg-muted/50">
                                          <TableCell colSpan={2}>Total</TableCell>
                                          <TableCell className="text-right">
                                            {formatKg(item.deliveries.reduce((sum, d) => sum + d.kg_delivered, 0))}
                                          </TableCell>
                                          <TableCell></TableCell>
                                          <TableCell className="text-right">

                                            {currencyFormatter(
                                              item.deliveries.reduce(
                                                (sum, d) => sum + d.kg_delivered * d.price_per_kg,
                                                0,
                                              ),
                                            )}
                                          </TableCell>
                                        </TableRow>
                                      </TableBody>
                                    </Table>
                                  </div>
                                ) : (
                                  <p className="text-sm text-muted-foreground">No hay entregas registradas</p>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </>
                    ))}
                  </TableBody>
                </Table>
                {seedSalesPagination.totalPages > 1 && (
                  <CustomPagination totalPages={Number(seedSalesPagination.totalPages) || 0} />
                )}
              </>
            }
          </div>
        </CardContent>
      </Card>

      <SeedSalesModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        initialData={editingItem}
        crops={crops}
      />
      <DeleteDialog
        title="Eliminar venta"
        description="Esta acción no se puede deshacer."
        itemId={deletingItem?.id}
        itemData={[
          { label: "Carta de Porte", value: deletingItem?.waybill_number || "" },
          { label: "Fecha", value: new Date(deletingItem?.sale_date || 0).toLocaleDateString() },
          { label: "Destino", value: deletingItem?.destination || "" },
          { label: "KG Vendidos", value: deletingItem?.kg_sold.toString() || "" },
        ]}
        isOpen={isDeleteDialogOpen}
        onConfirm={handleDelete}
        onCancel={() => setIsDeleteDialogOpen(false)}
      />
    </div>
  )
}