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
import { useLotStore } from "@/admin/store/lot.store";

interface DeleteLotDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete: (id: number) => Promise<void>;
}

export const DeleteLotDialog = forwardRef<HTMLDivElement, DeleteLotDialogProps>(
  ({ open, onOpenChange, onDelete }, ref) => {
    const { selectedLot } = useLotStore();

    if (!selectedLot) return null; // no mostrar si no hay lote seleccionado

    const handleDelete = async () => {
      await onDelete(selectedLot.id);
    };

    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent ref={ref} className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Eliminar Lote</DialogTitle>
            <DialogDescription>
              ¿Estás seguro que deseas eliminar el lote "{selectedLot.name}"?
            </DialogDescription>
          </DialogHeader>

          <div className="p-4 border rounded-md bg-muted mb-4">
            <p>
              <strong>Nombre:</strong> {selectedLot.name}
            </p>
            <p>
              <strong>Hectáreas:</strong> {selectedLot.hectares}
            </p>
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

DeleteLotDialog.displayName = "DeleteLotDialog";
