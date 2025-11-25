import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { currencyFormatter } from "@/lib/currency-formatter"
import { Plus, Search, Edit, Trash2 } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button";
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge";
import { CardTitleSummary } from "./CardTitleSummary"
import { CustomTasksSuppliesPagination } from "@/components/custom/CustomTasksSuppliesPagination"

import { useSupply } from "@/admin/hooks/useSupply"
import { useCropStore } from "@/admin/store/crop.store"
import { CustomLoadingCard } from "@/components/custom/CustomLoadingCard"
import { useSupplyCategories } from "@/admin/hooks/useSupplyCategories"
import { SupplyForm } from "./FormSupply"


export const SuppliesCard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [openSupplyForm, setOpenSupplyForm] = useState(false);
  const [, setCurrentPage] = useState(1);
  const [page, setPage] = useState(1);
  const { selectedCrop } = useCropStore();
  const { data: suppliesData, isLoading } = useSupply({
    cropId: selectedCrop?.id || 0,
    page,
    q: searchTerm,
  });
  const { data: categoriesData } = useSupplyCategories();
  const filteredSupplies = suppliesData?.supplies.filter((supply) =>
    supply.supply_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supply.category_name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const calculateTotalCostBySupply = (pricePerUnit: number, quantity: number) => {
    return currencyFormatter((Number(pricePerUnit) * Number(quantity)))
  }

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  if (isLoading) return <CustomLoadingCard />;

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitleSummary title="Productos Utilizados" count={filteredSupplies?.length || 0} label="productos" />
            </div>
            <Button
              onClick={() => setOpenSupplyForm(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Producto
            </Button>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar productos por nombre o categoría..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Producto</TableHead>
                  <TableHead>Categoría</TableHead>
                  <TableHead>Dosis/ha</TableHead>
                  <TableHead>Cant/h</TableHead>
                  <TableHead>Cantidad total</TableHead>
                  <TableHead>Precio unitario</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSupplies?.map((supply) => (
                  <TableRow key={supply.crop_supply_id}>
                    <TableCell className="font-medium">{supply.supply_name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{supply.category_name}</Badge>
                    </TableCell>

                    <TableCell>{supply.dose_per_ha} {supply.supply_unit}</TableCell>
                    <TableCell>{supply.hectares}</TableCell>
                    <TableCell>
                      {(supply.dose_per_ha * supply.hectares).toFixed(2)} {supply.supply_unit}
                    </TableCell>
                    <TableCell>${supply.unit_price.toLocaleString()}</TableCell>
                    <TableCell className="font-medium">
                      {calculateTotalCostBySupply(supply.unit_price, (supply.dose_per_ha * supply.hectares))}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toast.info("Función de editar próximamente")}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toast.info("Función de eliminar próximamente")}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="mt-4">
              <CustomTasksSuppliesPagination
                totalPages={suppliesData?.totalPages || 1}
                currentPage={page}
                onPageChange={(newPage) => setPage(newPage)} />
            </div>
          </div>
        </CardContent>
      </Card>
      <SupplyForm
        open={openSupplyForm}
        onOpenChange={setOpenSupplyForm}
        cropId={selectedCrop?.id || 0}
        categories={categoriesData?.categories || []}
      />
    </>
  )
}
