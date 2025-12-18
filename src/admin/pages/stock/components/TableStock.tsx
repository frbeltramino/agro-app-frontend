import { useState } from "react"
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2, Edit2 } from "lucide-react"
import { toast } from "sonner"

import { StockModal } from "./StockModal"
import { useStock } from "@/admin/hooks/useStock"
import { currencyFormatter } from "@/lib/currency-formatter"
import { Stock } from "@/interfaces/stock/stock.interface"
import { CustomPagination } from "@/components/custom/CustomPagination"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input";
import { useSupplyCategories } from "@/admin/hooks/useSupplyCategories";
import { CustomLoadingCard } from "@/components/custom/CustomLoadingCard";
import { StockCard } from "@/admin/components/StockCard";
import { CustomNoResultsCard } from "@/components/custom/CustomNoResultsCard";
import { PageHeader } from "@/admin/components/PageHeader";
import { useStockStats } from "@/admin/hooks/useStockStats";
import { DeleteDialog } from "@/admin/components/DeleteDialog";
import { formatKg } from "@/lib/format-kg";


export const StockTable = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [stockToDelete, setStockToDelete] = useState<any | null>(null);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const { data: stokData, deleteStock, mutation, isLoading } = useStock();
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: categoriesData } = useSupplyCategories();
  const categories = categoriesData?.categories || [];
  const { data: statsData, isLoading: isStatsLoading, isError: isStatsError } = useStockStats();

  const stock = stokData?.stock || [];
  const stockPagination = {
    page: stokData?.page || 1,
    limit: stokData?.limit || 10,
    total: stokData?.total || 0,
    totalPages: stokData?.totalPages || 1,
  }
  const handleAdd = () => {
    setEditingItem(null)
    setIsModalOpen(true)
  }

  const handleEdit = (item: Stock) => {
    setEditingItem(item)
    setIsModalOpen(true)
  }

  const handleDelete = (id: any) => {
    deleteStock.mutateAsync(id, {
      onSuccess: () => toast.success("Suministro eliminado correctamente"),
      onError: (error) => {
        console.log(error);
        toast.error("Error al eliminar el suministro", { position: 'top-right' });
      }
    });
    setIsDeleteOpen(false);
    setStockToDelete(null);
  }

  const handleSave = (item: any) => {
    mutation.mutateAsync(item, {
      onSuccess: () => toast.success(editingItem ? "Suministro actualizado correctamente" : "Suministro creado correctamente"),
      onError: (error) => {
        console.log(error);
        toast.error("Error al actualizar el suministro", { position: 'top-right' });
      }
    });
    setIsModalOpen(false)
  }

  const getStatusBadge = (status: string) => {
    return (
      <Badge variant={status === "active" ? "default" : "secondary"}>
        {status === "active" ? "Activo" : "Inactivo"}
      </Badge>
    )
  }

  const getStockLevelBadge = (quantity: number) => {
    if (quantity > 20) return <Badge className="bg-green-600">Alto</Badge>
    if (quantity > 10) return <Badge className="bg-yellow-600">Medio</Badge>
    return <Badge className="bg-red-600">Bajo</Badge>
  }

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);

    if (value) params.set(key, value);
    else params.delete(key);

    params.set("page", "1");

    setSearchParams(params);
  };

  const handleCategoryFilter = (value: string) => {
    setCategoryFilter(value);

    const params = new URLSearchParams(searchParams);

    if (value && value !== "all") params.set("category_id", value);
    else params.delete("category_id");

    params.set("page", "1");

    setSearchParams(params);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <PageHeader
            title="Control de Stock"
            subtitle="Gestiona tus suministros y suministros"
          />
        </div>
        <Button onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Suministro
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <StockCard
            title="Total Suministros"
            value={statsData?.active_count ? statsData.active_count : 0}
            description="Suministros registrados"
            isLoading={isStatsLoading}
            isStatsError={isStatsError}
          />
        </Card>

        <Card>
          <StockCard
            title="Stock Total"
            value={statsData?.total_quantity ? statsData.total_quantity : 0}
            description="Unidades disponibles"
            isLoading={isStatsLoading}
            isStatsError={isStatsError}
          />
        </Card>

        <Card>
          <StockCard
            title="Valor Total"
            value={currencyFormatter(statsData?.total_value ? statsData.total_value : 0)}
            description="Inventario valuado"
            isLoading={isStatsLoading}
            isStatsError={isStatsError}
          />
        </Card>
      </div>

      <Card>

        <CardHeader>
          <CardTitle>Suministros</CardTitle>
          <CardDescription>Lista completa de suministros en stock</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-center mb-4">
            {/* Buscar */}
            <Input
              placeholder="Buscar por nombre..."
              defaultValue={searchParams.get("search") || ""}
              onChange={(e) => updateFilter("search", e.target.value)}
              className="w-60"
            />

            {/* Categoría */}
            <Select
              value={categoryFilter}
              onValueChange={handleCategoryFilter}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Categoría" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">Todas las categorías</SelectItem>
                {categories?.map((c: any) => (
                  <SelectItem key={c.id} value={String(c.id)}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="overflow-x-auto">
            {isLoading && <CustomLoadingCard />}

            {!isLoading && stock.length === 0 &&
              <CustomNoResultsCard
                title="No se encontraron suministros"
                message="Prueba cambiando la búsqueda o los filtros."
              />
            }

            {
              !isLoading && stock.length > 0 && (
                <>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nombre</TableHead>
                        <TableHead>Categoría</TableHead>
                        <TableHead>Cantidad</TableHead>
                        <TableHead>Unidad</TableHead>
                        <TableHead>Nivel</TableHead>
                        <TableHead>Precio/U</TableHead>
                        <TableHead>Vencimiento</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {stock.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.name}</TableCell>
                          <TableCell>{item.category_name}</TableCell>
                          <TableCell>{formatKg(item.quantity_available || 0)}</TableCell>
                          <TableCell>{item.unit}</TableCell>
                          <TableCell>{getStockLevelBadge(item.quantity_available)}</TableCell>
                          <TableCell className="font-bold">{currencyFormatter(item.price_per_unit)}</TableCell>
                          <TableCell>{new Date(item.expiration_date).toLocaleDateString()}</TableCell>
                          <TableCell>{getStatusBadge(item.status)}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" onClick={() => handleEdit(item)}>
                                <Edit2 className="h-4 w-4" />
                              </Button>
                              <Button variant="destructive" size="sm" onClick={() => {
                                setStockToDelete(item);
                                setIsDeleteOpen(true);
                              }}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  {
                    stockPagination.totalPages > 1 && <CustomPagination totalPages={Number(stockPagination.totalPages) || 0} />
                  }

                </>
              )}


          </div>
        </CardContent>

      </Card>

      <StockModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        initialData={editingItem}
      />

      <DeleteDialog
        title="Eliminar suministro"
        description="Esta acción no se puede deshacer."
        itemData={[
          { label: "Nombre", value: stockToDelete?.name || "" },
          { label: "Categoría", value: stockToDelete?.category_name || "" },
          { label: "Fecha de caducidad", value: stockToDelete?.expiration_date ? new Date(stockToDelete.expiration_date).toLocaleDateString() : "No hay fecha de caducidad" },
        ]}
        isOpen={isDeleteOpen}
        onConfirm={handleDelete}
        onCancel={() => setIsDeleteOpen(false)}
        itemId={stockToDelete?.id}
      />
    </div>
  )
}
