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
import { Plus, Search, Edit, Trash2, ChevronRight, Layers, CheckCircle, Square } from "lucide-react";
import { toast } from "sonner";


import { CustomFullScreenLoading } from "@/components/custom/CustomFullScreenLoading";


import { CustomNoResultsScreen } from "@/components/custom/CustomNoResultsScreen";
import { Lot } from "@/interfaces/lots/lot.interface";
import { Breadcrumbs } from "@/admin/components/Breadcrumbs";
import { useCampaignStore } from "@/admin/store/campaign.store";
import { useLots } from "@/admin/hooks/useLots";
import { useLotStore } from "@/admin/store/lot.store";
import { LotForm } from "../components/LotForm";
import { DeleteLotDialog } from "../components/DeleteLotDialog";
import { StatCard } from "@/admin/components/StatCard";
import { PageHeader } from "@/admin/components/PageHeader";



export const Lots = () => {
  const { selectedCampaign } = useCampaignStore();
  const { setSelectedLot } = useLotStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const navigate = useNavigate();
  const { mutation, deleteLot } = useLots({ campaignId: selectedCampaign!.id });

  const handleCreateLot = async (data: any) => {
    await mutation.mutateAsync(data, {
      onSuccess: () => toast.success("Lote creado exitosamente",
        { position: 'top-right' },
      ),
      onError: (error) => {
        console.log(error);
        toast.error("Error al crear el lote", { position: 'top-right' });
      }
    },

    );
  };

  if (!selectedCampaign) {
    return <CustomFullScreenLoading />;
  }

  const { data, isError, isLoading } = useLots({
    campaignId: selectedCampaign!.id,
  });

  if (isError) return <CustomNoResultsScreen message="Error al cargar lotes" />;

  if (isLoading) return <CustomFullScreenLoading />;

  const lots = data?.lots ?? [];

  const filteredLots = lots.filter((lot) =>
    lot.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectLot = (lot: Lot) => {
    setSelectedLot(lot);
    navigate(`/admin/campaigns/${selectedCampaign?.id}/lots/${lot.id}/crops`);
  };

  const handleDeleteLot = async (id: number) => {
    await deleteLot.mutateAsync(id, {
      onSuccess: () => toast.success("Campaña borrada exitosamente",
        { position: 'top-right' },
      ),
      onError: (error) => {
        console.log(error);
        toast.error("Error al borrar la campaña", { position: 'top-right' });
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
          { label: "Lotes", href: `/admin/campaigns/${selectedCampaign?.id}/lots` },
        ]}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <PageHeader title="Lotes" subtitle="Gestiona los lotes de la campaña" />
        <Button
          onClick={() => {
            setSelectedLot(null);
            setIsFormOpen(true)
          }}
          className="w-full sm:w-auto"
        >
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Lote
        </Button>
      </div>

      <LotForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSubmit={handleCreateLot}
      />

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          title="Total Lotes"
          value={filteredLots.length}
          icon={<Layers className="h-4 w-4 text-muted-foreground" />}
        />

        <StatCard
          title="Área Total"
          value={
            filteredLots.reduce((acc, lot) => acc + Number(lot.hectares), 0).toFixed(1) + " ha"
          }
          icon={<Square className="h-4 w-4 text-muted-foreground" />}
        />

        <StatCard
          title="Lotes Activos"
          value={filteredLots.length}
          icon={<CheckCircle className="h-4 w-4 text-green-600" />}
        />
      </div>

      {/* Tabla */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Lotes</CardTitle>
          <CardDescription>
            {filteredLots.length} lotes encontrados
          </CardDescription>
          <div className="flex items-center gap-2 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre..."
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
                  <TableHead>Lote</TableHead>
                  <TableHead>Área (ha)</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLots.map((lot) => (
                  <TableRow
                    key={lot.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectLot(lot);
                    }
                    }
                  >
                    <TableCell className="font-medium">{lot.name}</TableCell>
                    <TableCell>{lot.hectares}</TableCell>
                    <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedLot(lot);
                            setIsFormOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedLot(lot);
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
                            handleSelectLot(lot);
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
      <DeleteLotDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        onDelete={handleDeleteLot}
      />
    </div>
  );
};

