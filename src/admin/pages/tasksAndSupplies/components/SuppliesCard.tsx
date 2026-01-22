import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { useState } from "react"
import { CardTitleSummary } from "./CardTitleSummary"
import { CustomTasksSuppliesPagination } from "@/components/custom/CustomTasksSuppliesPagination"
import { useSupply } from "@/admin/hooks/useSupply"
import { useCropStore } from "@/admin/store/crop.store"
import { CustomLoadingCard } from "@/components/custom/CustomLoadingCard"
import { CustomNoResultsCard } from "@/components/custom/CustomNoResultsCard"
import { SupplyInUseDialog } from "../../../components/SupplyInUseDialog"
import { DeleteDialog } from "@/admin/components/DeleteDialog";
import { useStock } from "@/admin/hooks/useStock"
import { SuppliesCardMobile } from "./SuppliesCardMobile"
import { SuppliesCardDesktop } from "./SuppliesCardDesktop"
import { formatCurrency } from "@/lib/currency-formatter-usd"


export const SuppliesCard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [openProductInUseDialog, setOpenProductInUseDialog] = useState(false);
  const [openDeleteSupplyDialog, setOpenDeleteSupplyDialog] = useState(false);
  const [usedInTasksData, setUsedInTasksData] = useState<any[]>([]);
  const [deletingItem, setDeletingItem] = useState<any | null>(null);
  const [, setCurrentPage] = useState(1);
  const [page, setPage] = useState(1);
  const { selectedCrop } = useCropStore();
  const { data: suppliesData, isLoading, checkSupplyUsage, deleteSupply } = useSupply({
    cropId: selectedCrop?.id || 0,
    page,
    q: searchTerm,
  });
  const { adjustStock } = useStock();


  const suppliesPagination = {
    page: suppliesData?.page || 1,
    limit: suppliesData?.limit || 10,
    total: suppliesData?.total || 0,
    totalPages: suppliesData?.totalPages || 1,
  };
  const normalized = searchTerm.toLowerCase();

  const filteredSupplies =
    suppliesData?.supplies?.filter((supply) => {
      const name = supply.supply_name?.toLowerCase() || "";
      const category = supply.category_name?.toLowerCase() || "";

      return name.includes(normalized) || category.includes(normalized);
    }) || [];
  const calculateTotalCostBySupply = (pricePerUnit: number, quantity: number) => {
    return formatCurrency((Number(pricePerUnit) * Number(quantity)))
  }

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleCheckUsageSupply = async (supply: any) => {

    setDeletingItem(supply);

    // Caso crop_stock: no está en tareas
    if (supply.crop_stock_id) {
      setOpenDeleteSupplyDialog(true);
      return;
    }

    const { can_delete, used_in_tasks } = await checkSupplyUsage.mutateAsync({
      supply_id: supply.supply_id || null,
      crop_id: selectedCrop?.id || 0,
      stock_id: supply.stock_id || null
    });

    if (!can_delete) {
      setUsedInTasksData(used_in_tasks);
      setOpenProductInUseDialog(true);
      return;
    }
    setOpenDeleteSupplyDialog(true);
  };

  const showDeleteSupplyDialog = (supply: any) => {
    setOpenDeleteSupplyDialog(true);
    setDeletingItem(supply)
  }

  const handleDeleteSupply = async (supply: any) => {
    if (supply.from_stock) {
      // 1️⃣ Ajustar stock si corresponde
      await adjustStock.mutateAsync({
        stockId: supply.stock_id,
        quantity: supply.total_used
      });

      // 2️⃣ Si es un registro de crop_stock
      if (supply.crop_stock_id) {
        await deleteSupply.mutateAsync({
          crop_stock_id: supply.crop_stock_id,
          from_stock: true,
        });
        setDeletingItem(null);
        setOpenDeleteSupplyDialog(false);
        return;
      }

      // 3️⃣ Si es stock usado en tareas
      if (supply.stock_id) {
        await deleteSupply.mutateAsync({
          stock_id: supply.stock_id,
          from_stock: true,
          crop_supply_id: supply.crop_supply_id,
        });
        setDeletingItem(null);
        setOpenDeleteSupplyDialog(false);
        return;
      }
    } else {
      // 🔵 Insumo normal
      await deleteSupply.mutateAsync({
        supply_id: supply.supply_id,
        crop_supply_id: supply.crop_supply_id,
        from_stock: false,
      });
      setDeletingItem(null);
      setOpenDeleteSupplyDialog(false);
    }
  };



  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitleSummary title="Insumos Utilizados" count={suppliesPagination.total || 0} label="productos" />
            </div>

          </div>
          <div className="flex items-center gap-2 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar insumos por nombre..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {
            isLoading && <CustomLoadingCard />
          }
          {
            !isLoading && filteredSupplies.length === 0 &&
            <CustomNoResultsCard
              title="No se encontraron insumos"
              message="Prueba cambiando la búsqueda o los filtros."
            />
          }
          {
            !isLoading && filteredSupplies.length > 0 && (
              <>
                <div className="space-y-3 md:hidden">
                  <SuppliesCardMobile supplies={filteredSupplies} onDelete={handleCheckUsageSupply} />
                </div>
                <div className="hidden md:block overflow-x-auto">

                  <SuppliesCardDesktop supplies={filteredSupplies} calculateTotalCostBySupply={calculateTotalCostBySupply} handleCheckUsageSupply={handleCheckUsageSupply} onDelete={handleCheckUsageSupply} />
                </div>
                <div className="mt-4">
                  {
                    suppliesPagination.totalPages > 1 && <CustomTasksSuppliesPagination
                      totalPages={suppliesPagination.totalPages || 1}
                      currentPage={page}
                      onPageChange={(newPage) => setPage(newPage)}
                    />
                  }

                </div>
              </>
            )}

        </CardContent>
      </Card>

      <SupplyInUseDialog
        isOpen={openProductInUseDialog}
        onCancel={() => setOpenProductInUseDialog(false)}
        onContinue={() => showDeleteSupplyDialog(deletingItem)}
        productName={deletingItem?.supply_name}
        usedInTasks={usedInTasksData}
      />
      <DeleteDialog
        title="Eliminar Insumo"
        description="Esta acción no se puede deshacer."
        itemData={[
          { label: "Nombre", value: deletingItem?.supply_name || "" },
          { label: "Categoría", value: deletingItem?.category_name || "" }
        ]}
        isOpen={openDeleteSupplyDialog}
        onConfirm={handleDeleteSupply}
        onCancel={() => setOpenDeleteSupplyDialog(false)}
        item={deletingItem}
      />

    </>
  )
}
