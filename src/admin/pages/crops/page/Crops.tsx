import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Search, Edit, Trash2, ChevronRight, Sprout, Tractor, LeafyGreen } from "lucide-react";
import { toast } from "sonner";
import { Breadcrumbs } from "../../../components/Breadcrumbs";
import { useCampaignStore } from "../../../store/campaign.store";
import { useLotStore } from "../../../store/lot.store";
import { CustomFullScreenLoading } from "@/components/custom/CustomFullScreenLoading";
import { useCrops } from "../../../hooks/useCrops";
import { CustomNoResultsScreen } from "@/components/custom/CustomNoResultsScreen";
import { useCropStore } from "../../../store/crop.store";
import { Crop } from "@/interfaces/crops/crop.interface";
import { StatCard } from "../../../components/StatCard";
import { PageHeader } from "../../../components/PageHeader";
import { CropForm } from "../components/CropForm";
import { DeleteDialog } from "@/admin/components/DeleteDialog";

export const Crops = () => {
  const { selectedCampaign } = useCampaignStore();
  const { selectedLot } = useLotStore()
  const { setSelectedCrop, selectedCrop } = useCropStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const navigate = useNavigate();

  if (!selectedLot) return <CustomFullScreenLoading />;

  const { data, isLoading, isError, createCrop, deleteCrop } = useCrops({ lotId: selectedLot!.id });

  if (isError) return <CustomNoResultsScreen message="Error al cargar cultivos" />;

  if (isLoading) return <CustomFullScreenLoading />;
  const crops = data?.crops ?? [];

  const filteredCrops = crops.filter((crop: Crop) =>
    crop.seed_type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectCrop = (crop: Crop) => {
    setSelectedCrop(crop);
    navigate(`/admin/campaigns/${selectedCampaign?.id}/lots/${selectedLot?.id}/crops/${crop.id}/TasksAndSupplies`);
  };

  const handleCreateCrop = (data: any) => {
    createCrop.mutateAsync(data, {
      onSuccess: () => toast.success("Cultivo creado exitosamente"),
      onError: (error) => {
        console.log(error);
        toast.error("Error al crear el cultivo", { position: 'top-right' });
      }
    },);
  };

  const handleFormSubmit = (data: any) => {
    handleCreateCrop(data);
  };

  const openCreateForm = () => {
    setFormMode('create');
    setSelectedCrop(null);
    setIsFormOpen(true);
  };

  const openEditForm = (crop: Crop) => {
    setFormMode('edit');
    setSelectedCrop(crop);
    setIsFormOpen(true);
  };

  const handleDeleteCrop = async (id: number) => {
    await deleteCrop.mutateAsync(id, {
      onSuccess: () => toast.success("Cultivo borrado exitosamente",
        { position: 'top-right' },
      ),
      onError: (error) => {
        console.log(error);
        toast.error("Error al borrar el cultivo", { position: 'top-right' });
      }
    },

    );
    setIsDeleteOpen(false)
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Breadcrumbs
        items={[
          { label: selectedCampaign?.name || "Campañas", href: "/admin/campaigns" },
          { label: selectedLot?.name, href: `/admin/campaigns/${selectedCampaign?.id}/lots` },
          { label: "Cultivos", href: `/admin/campaigns/${selectedCampaign?.id}/lots/${selectedLot?.id}/crops` },
        ]}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <PageHeader title="Cultivos" subtitle="Gestiona los cultivos del lote" />

        <Button
          onClick={openCreateForm}
          className="w-full sm:w-auto"
        >
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Cultivo
        </Button>
      </div>

      {/* Stats Cards */}
      {
        <>
          <div className="grid gap-4 md:grid-cols-3">
            <StatCard
              title="Total Cultivos"
              value={filteredCrops.length}
              icon={<Sprout className="h-4 w-4 text-muted-foreground" />}
            />
            <StatCard
              title="En Crecimiento"
              value={filteredCrops.length}
              icon={<LeafyGreen className="h-4 w-4 text-muted-foreground" />}
            />
            <StatCard
              title="Cocechadas"
              value={filteredCrops.length}
              icon={<Tractor className="h-4 w-4 text-muted-foreground" />}
            />
          </div>

          {/* Tabla */}
          <Card>
            <CardHeader>
              <CardTitle>Lista de Cultivos</CardTitle>
              <CardDescription>
                {filteredCrops.length} cultivos encontradas
              </CardDescription>
              <div className="flex items-center gap-2 mt-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por cultivo..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
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
                      <TableHead>Cultivo</TableHead>
                      <TableHead className="hidden sm:table-cell">Variedad</TableHead>
                      <TableHead>Fecha Siembra</TableHead>
                      <TableHead className="hidden md:table-cell">Fecha estimada de cosecha</TableHead>
                      <TableHead>Rendimiento final (qq)</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCrops.map((crop: Crop) => (
                      <TableRow
                        key={crop.id}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectCrop(crop)
                        }
                        }
                      >
                        <TableCell className="font-medium">{crop.crop_name}</TableCell>
                        <TableCell className="hidden sm:table-cell">{crop.seed_type}</TableCell>
                        <TableCell>
                          {new Date(crop.start_date).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {crop.end_date ? new Date(crop.end_date).toLocaleDateString() : "No hay fecha de fin"}
                        </TableCell>
                        <TableCell>{crop.real_yield ? crop.real_yield : "No hay valor real"}</TableCell>
                        <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                openEditForm(crop);
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedCrop(crop);
                                setIsDeleteOpen(true);
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSelectCrop(crop);
                              }}
                            >
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </>
      }
      <CropForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSubmit={handleFormSubmit}
        campaignName={selectedCampaign?.name}
        campaignId={selectedCampaign?.id}
        lotName={selectedLot?.name}
        lotId={selectedLot?.id}
        cropToEdit={selectedCrop}
        mode={formMode}
      />

      <DeleteDialog
        title="Eliminar Cultivo"
        description="Esta acción no se puede deshacer."
        itemData={[
          { label: "Nombre", value: selectedCrop?.crop_name || "" },
          { label: "Fecha de siembra", value: selectedCrop?.start_date ? new Date(selectedCrop.start_date).toLocaleDateString() : "No hay fecha de siembra" },
        ]}
        isOpen={isDeleteOpen}
        onConfirm={() => handleDeleteCrop(Number(selectedCrop?.id))}
        onCancel={() => setIsDeleteOpen(false)}
        itemId={selectedCrop?.id}
      />
    </div>
  );
};

