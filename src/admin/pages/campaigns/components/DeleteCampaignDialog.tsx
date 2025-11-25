import { forwardRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCampaignStore } from "@/admin/store/campaign.store";

interface DeleteCampaignDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete: (id: number) => Promise<void>;
}

export const DeleteCampaignDialog = forwardRef<HTMLDivElement, DeleteCampaignDialogProps>(
  ({ open, onOpenChange, onDelete }, ref) => {
    const { selectedCampaign } = useCampaignStore();

    if (!selectedCampaign) return null; // no mostrar si no hay campaña seleccionada

    const handleDelete = async () => {
      await onDelete(selectedCampaign.id);
    };

    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent ref={ref} className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Eliminar Campaña</DialogTitle>
            <DialogDescription>
              ¿Estás seguro que deseas eliminar la campaña "{selectedCampaign.name}"?
            </DialogDescription>
          </DialogHeader>

          <div className="p-4 border rounded-md bg-muted mb-4">
            <p><strong>Nombre:</strong> {selectedCampaign.name}</p>
            <p><strong>Fecha Inicio:</strong> {new Date(selectedCampaign.start_date).toLocaleDateString()}</p>
            <p><strong>Fecha Fin:</strong> {selectedCampaign.end_date ? new Date(selectedCampaign.end_date).toLocaleDateString() : "No hay fecha de fin"}</p>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }
);

DeleteCampaignDialog.displayName = "DeleteCampaignDialog";
