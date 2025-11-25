import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  loading?: boolean;
  children?: React.ReactNode;
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title = "Confirmar acción",
  description = "¿Estás seguro de que deseas continuar?",
  confirmLabel = "Eliminar",
  cancelLabel = "Cancelar",
  onConfirm,
  loading = false,
  children,
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[420px]">

        {/* Ícono centrado */}
        <div className="flex justify-center pt-2">
          <div className="bg-yellow-100 dark:bg-yellow-900/30 p-3 rounded-full">
            <AlertTriangle className="h-10 w-10 text-yellow-500" />
          </div>
        </div>

        {/* Texto alineado a la izquierda */}
        <DialogHeader className="mt-2 space-y-2 text-left">
          <DialogTitle className="text-lg font-semibold">
            {title}
          </DialogTitle>

          <DialogDescription className="text-base text-muted-foreground">
            {description}
          </DialogDescription>
        </DialogHeader>

        {/* Children opcional */}
        {children && <div className="py-1 text-left">{children}</div>}

        {/* Botones centrados */}
        <DialogFooter className="flex justify-center gap-3 pt-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            {cancelLabel}
          </Button>

          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? "Procesando..." : confirmLabel}
          </Button>
        </DialogFooter>

      </DialogContent>
    </Dialog>
  );
}
