import { useRef, useState } from "react";

import { Button } from "@/components/ui/button";

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
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Edit, Trash2, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { useCampaigns } from "../../../hooks/useCampaigns"; // Hook que trae la data de campañas

import { useNavigate, useSearchParams } from "react-router-dom";
import { CustomPagination } from "@/components/custom/CustomPagination";
import { PageHeader } from "../../../components/PageHeader";
import { useCampaignStore } from "../../../store/campaign.store";
import { Campaign } from "@/interfaces/campaigns/campaign.interface";
import { CampaignForm } from "@/admin/pages/campaigns/components/CampaignForm";
import { DeleteDialog } from "@/admin/components/DeleteDialog"
import { CustomNoResultsCard } from "@/components/custom/CustomNoResultsCard";
import { CustomLoadingCard } from "@/components/custom/CustomLoadingCard";

export const Campaigns = () => {


  const [searchParams, setSearchParams] = useSearchParams();
  const { setSelectedCampaign } = useCampaignStore();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingItem, setDeletingItem] = useState<any | null>(null);

  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const query = searchParams.get('query') || '';

  const handleSearch = () => {
    //si escribe algo en el input de busqueda quiere decir que resetea todos los filtros antes aplicados
    const query = inputRef.current?.value;
    const newSearchParams = new URLSearchParams();

    if (!query) {
      newSearchParams.delete('query')
    } else {
      newSearchParams.set('query', inputRef.current!.value);
    }

    setSearchParams(newSearchParams);
  }

  const { data, isLoading, mutation, deleteMutation } = useCampaigns();

  const handleSubmitForm = async (data: any) => {
    await mutation.mutateAsync(data, {
      onSuccess: () => toast.success("Campaña creada exitosamente",
        { position: 'top-right' },
      ),
      onError: (error) => {
        console.log(error);
        toast.error("Error al crear la campaña", { position: 'top-right' });
      }
    },

    );
  };

  const filteredCampaigns = data?.campaigns ?? [];
  const campaignsPagination = data?.pagination || {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  };

  type CampaignStatus = "active" | "inactive";

  const getStatusBadge = (status: CampaignStatus) => {
    if (status === "active") {
      return (
        <Badge className="bg-green-600 text-white hover:bg-green-700">
          Activa
        </Badge>
      );
    }
    return (
      <Badge variant="destructive">
        Eliminada
      </Badge>
    );
  };

  const handleSelectCampaign = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    navigate(`/admin/campaigns/${campaign.id}/lots`);
  };

  const handleEditCampaign = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setIsFormOpen(true);
  };

  const handleDeleteCampaign = async (id: number) => {
    await deleteMutation.mutateAsync(id, {
      onSuccess: () => toast.success("Campaña borrada exitosamente",
        { position: 'top-right' },
      ),
      onError: (error) => {
        console.log(error);
        toast.error("Error al borrar la campaña", { position: 'top-right' });
      }
    },

    );
    setIsDeleteDialogOpen(false)
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <PageHeader
          title="Campañas"
          subtitle="Gestiona tus campañas agrícolas"
        />
        <Button
          onClick={() => {
            setSelectedCampaign(null);
            setIsFormOpen(true)
          }

          }
          className="w-full sm:w-auto"
        >
          <Plus className="mr-2 h-4 w-4" />
          Nueva Campaña
        </Button>
      </div>
      {/* Tabla */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Campañas</CardTitle>
          <CardDescription>
            {Number(data?.pagination.total) || 0} campañas encontradas
          </CardDescription>
          <div className="flex items-center gap-2 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                ref={inputRef}
                placeholder="Buscar por nombre..."
                onChange={handleSearch}
                defaultValue={query}
                className="pl-10 w-full border rounded-md h-10"
              />
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {
            isLoading && <CustomLoadingCard />
          }

          <div className="overflow-x-auto">
            {
              filteredCampaigns.length === 0 && <CustomNoResultsCard
                title="No se encontraron campañas"
                message="Prueba cambiando la búsqueda o los filtros."
              />
            }
            {filteredCampaigns.length > 0 && (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Campaña</TableHead>
                      <TableHead>Fecha Inicio</TableHead>
                      <TableHead>Fecha Fin</TableHead>
                      <TableHead className="hidden md:table-cell">Notas</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCampaigns?.map((campaign) => (
                      <TableRow
                        key={campaign.id}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={
                          (e) => {
                            e.stopPropagation();
                            handleSelectCampaign(campaign);
                          }
                        }
                      >
                        <TableCell className="font-medium">{campaign.name}</TableCell>
                        <TableCell>{new Date(campaign.start_date).toLocaleDateString()}</TableCell>
                        <TableCell>{campaign.end_date ? new Date(campaign.end_date).toLocaleDateString() : "No hay fecha de fin"}</TableCell>
                        <TableCell className="hidden md:table-cell">{campaign.notes || "No hay notas"}</TableCell>
                        <TableCell>{getStatusBadge(campaign.status as CampaignStatus)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditCampaign(campaign);
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => {
                              setDeletingItem(campaign);
                              setIsDeleteDialogOpen(true)
                            }
                            }>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSelectCampaign(campaign);
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
                {
                  campaignsPagination.totalPages > 1 && <CustomPagination totalPages={Number(campaignsPagination.totalPages) || 0} />
                }
              </>
            )}

          </div>

        </CardContent>
      </Card>
      <CampaignForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSubmit={handleSubmitForm}
      />

      <DeleteDialog
        title="Eliminar Campaña"
        description="Esta acción no se puede deshacer."
        itemId={deletingItem?.id}
        itemData={[
          { label: "Nombre", value: deletingItem?.name || "" },
          { label: "Fecha de inicio", value: deletingItem?.start_date ? new Date(deletingItem?.start_date).toLocaleDateString() : "No hay fecha de inicio" },
        ]}
        isOpen={isDeleteDialogOpen}
        onConfirm={handleDeleteCampaign}
        onCancel={() => setIsDeleteDialogOpen(false)}

      />
    </div>
  );
};