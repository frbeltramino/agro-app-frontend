"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Plus, Trash2, Edit2 } from "lucide-react"
import { toast } from "sonner"
import { SeedSalesModal } from "./SalesModal"
import { useSeedSales } from "@/admin/hooks/useSeedSales"
import { SeedSale } from "@/interfaces/sales/seed.sale.interface"
import { PageHeader } from "@/admin/components/PageHeader"
import { StockCard } from "@/admin/components/StockCard"
import { CustomLoadingCard } from "@/components/custom/CustomLoadingCard"
import { CustomNoResultsCard } from "@/components/custom/CustomNoResultsCard"
import { CustomPagination } from "@/components/custom/CustomPagination"
import { DeleteDialog } from "@/admin/components/DeleteDialog"
import { formatKg } from "@/lib/format-kg"




export const SeedSalesTable = () => {


  const [deletingItem, setDeletingItem] = useState<SeedSale | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<SeedSale | null>(null)
  const [searchWaybill, setSearchWaybill] = useState("")
  const [searchDestination, setSearchDestination] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const { data: seedSales, isLoading, mutation, deleteSale } = useSeedSales({
    waybill_number: searchWaybill,
    destination: searchDestination,
    start_date: startDate,
    end_date: endDate,
  });


  const seedSalesData = seedSales?.seed_sales || [];
  const seedSalesPagination = seedSales?.pagination || {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  };

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
        console.log(error);
        toast.error("Error al eliminar la venta de semillas", { position: 'top-right' });
      }
    });
  }

  const handleSave = (item: SeedSale) => {
    mutation.mutateAsync(item, {
      onSuccess: () => toast.success("Venta de semillas actualizada correctamente"),
      onError: (error) => {
        console.log(error);
        toast.error("Error al actualizar la venta de semillas", { position: 'top-right' });
      }
    });
  }

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
        <PageHeader
          title="Venta de Semillas"
          subtitle="Gestiona tus ventas y entregas"
        />
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
            value={totalDelivered.toFixed(2) + "kg"}
            description="Kilogramos entregados"
            isLoading={isLoading}
            isStatsError={false}
          />
        </Card>

        <Card>
          <StockCard
            title="Total Vendido"
            value={totalSold.toFixed(2) + "kg"}
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
          <CardTitle>Ventas Registradas</CardTitle>
          <CardDescription>Total de {seedSalesPagination.total} registros</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            {isLoading && <CustomLoadingCard />}

            {seedSalesData.length === 0 ? (
              <CustomNoResultsCard
                title="No se encontraron suministros"
                message="Prueba cambiando la búsqueda o los filtros."
              />
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
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
                      <TableRow key={item.id}>
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
                            <Button variant="destructive" size="sm" onClick={() => {
                              setDeletingItem(item);
                              setIsDeleteDialogOpen(true)
                            }
                            }>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {
                  seedSalesPagination.totalPages > 1 && <CustomPagination totalPages={Number(seedSalesPagination.totalPages) || 0} />
                }
              </>
            )}
          </div>
        </CardContent>
      </Card>

      <SeedSalesModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        initialData={editingItem}
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
