import { forwardRef } from "react";
import { useForm } from "react-hook-form";
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
import { useEffect } from "react";


interface FormValues {
  id?: number | string | null;
  name: string;
  start_date: string;
  end_date: string;
  category_id: string;
  notes?: string;
}

interface CampaignFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: FormValues) => Promise<void>;
}

export const CampaignForm = forwardRef<HTMLDivElement, CampaignFormProps>(
  ({ open, onOpenChange, onSubmit }, ref) => {

    const { selectedCampaign } = useCampaignStore();

    const { register, handleSubmit, formState: { errors }, reset } = useForm<FormValues>({
      defaultValues: {
        name: "",
        start_date: "",
        end_date: "",
        category_id: "",
        notes: "",
      },
    });

    useEffect(() => {
      if (selectedCampaign) {
        reset({
          id: selectedCampaign.id,
          name: selectedCampaign.name,
          category_id: String(selectedCampaign.category_id),
          start_date: formatDateInput(selectedCampaign.start_date.toString()),
          end_date: formatDateInput(selectedCampaign.end_date?.toString()),
          notes: selectedCampaign.notes ?? "",
        });
      } else {
        reset({
          id: 'new',
          name: "",
          category_id: "",
          start_date: "",
          end_date: "",
          notes: "",
        });
      }
    }, [selectedCampaign, reset]);

    const formatDateInput = (date: string | null | undefined) => {
      if (!date) return "";
      if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        return date;
      }
      const d = new Date(date);
      if (isNaN(d.getTime())) return "";
      return d.toISOString().slice(0, 10);
    };

    const onFormSubmit = (data: FormValues) => {
      onSubmit(data);
      reset();
      onOpenChange(false);
    };

    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent ref={ref} className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{selectedCampaign ? "Editar" : "Nueva"} Campaña </DialogTitle>
            <DialogDescription>
              Completa los datos de la campaña agrícola
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Nombre *
              </label>
              <input
                type="text"
                {...register("name", { required: "El nombre es requerido" })}
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Ej: Campaña Soja Primavera"
              />
              {errors.name && (
                <p className="text-destructive text-sm mt-1">{errors.name.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Fecha de Inicio *
                </label>
                <input
                  type="date"
                  {...register("start_date", { required: "La fecha de inicio es requerida" })}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                {errors.start_date && (
                  <p className="text-destructive text-sm mt-1">{errors.start_date.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Fecha de Fin
                </label>
                <input
                  type="date"
                  {...register("end_date")}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Notas (opcional)
              </label>
              <textarea
                {...register("notes")}
                rows={3}
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                placeholder="Agrega notas adicionales sobre la campaña..."
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button type="submit">{selectedCampaign ? "Editar" : "Crear"} Campaña</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    );
  });

CampaignForm.displayName = "CampaignForm";


