import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { SidePanel } from "@/admin/components/SidePanel";

interface MasterLotFormValues {
  name: string;
  default_surface: number;
}

interface MasterLotSelectProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: MasterLotFormValues) => void;
}

export function MasterLotSelect({
  open,
  onOpenChange,
  onSubmit,

}: MasterLotSelectProps) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<MasterLotFormValues>({
    defaultValues: { name: "", default_surface: undefined }
  });

  useEffect(() => {
    if (!open) return;


    reset({ name: "", default_surface: undefined });

  }, [open, reset]);

  const handleClose = () => {
    reset();
    onOpenChange(false);
  };

  const handleFormSubmit = (data: MasterLotFormValues) => {
    onSubmit(data);
    handleClose();
  };

  return (
    <SidePanel
      isOpen={open}
      onClose={handleClose}
      title={"Nuevo Lote Maestro"}
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 pt-4">
        <div className="mt-2">
          <label className="block text-sm font-medium mb-2">Nombre del Lote *</label>
          <input
            {...register("name", { required: "El nombre es requerido" })}
            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Ej: Lote Norte B"
          />
          {errors.name && (
            <p className="text-sm text-destructive mt-1">{errors.name.message}</p>
          )}
        </div>

        <div className="mt-2 pb-4">
          <label className="block text-sm font-medium mb-2">Hectáreas *</label>
          <input
            type="number"
            step="0.01"
            {...register("default_surface", {
              required: "Las hectáreas son requeridas",
              min: { value: 0.01, message: "Debe ser mayor a 0" }
            })}
            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Ej: 120,5"
          />
          {errors.default_surface && (
            <p className="text-sm text-destructive mt-1">{errors.default_surface.message}</p>
          )}
        </div>

        <div className="shrink-0 pt-4 border-t bg-background mt-4">
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1"
            >
              Cancelar
            </Button>

            <Button
              type="submit"
              className="flex-1"
            >
              {"Crear"} Lote
            </Button>
          </div>
        </div>
      </form>
    </SidePanel>
  );
}
