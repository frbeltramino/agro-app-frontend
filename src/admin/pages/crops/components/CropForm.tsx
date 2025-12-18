import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Crop } from "@/interfaces/crops/crop.interface";
import { useCropNames } from "@/admin/hooks/useCropNames";
import { useCampaignStore } from "@/admin/store/campaign.store";
import { useLotStore } from "@/admin/store/lot.store";
import { CustomSelectWithCreate } from "@/components/custom/CustomSelectWithCreate";
import { AmountInput } from "@/components/custom/CustomAmountInput";

interface FormValues {
  id: number | string;
  crop_name_id: number | null;
  crop_name?: string;
  start_date: Date | string;
  end_date: Date | string | null;
  campaign_id: number | null;
  lot_id: number | null;
  seed_type: string;
  real_yield: number | undefined;
}

interface CropFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: FormValues) => void;
  campaignName?: string;
  campaignId?: string | number;
  lotName?: string;
  lotId?: string | number;
  cropToEdit?: Crop | null;
  mode?: 'create' | 'edit';
}

export function CropForm({ open, onOpenChange, onSubmit, campaignName, lotName, cropToEdit, mode = 'create' }: CropFormProps) {


  const { data, createCropName } = useCropNames();
  const cropNames = data?.cropNames ?? [];



  const { selectedCampaign } = useCampaignStore();
  const { selectedLot } = useLotStore();

  const { register, handleSubmit, formState: { errors }, reset, setValue, control } = useForm<FormValues>({
    defaultValues: {
      id: cropToEdit?.id || 'new',
      crop_name_id: Number(cropToEdit?.crop_name_id) || null,
      crop_name: cropToEdit?.crop_name || "",
      start_date: cropToEdit?.start_date ? new Date(cropToEdit.start_date) : new Date(),
      end_date: cropToEdit?.end_date ? new Date(cropToEdit.end_date) : null,
      campaign_id: selectedCampaign?.id || null,
      lot_id: selectedLot?.id || null,
      seed_type: cropToEdit?.seed_type || "",
      real_yield: cropToEdit?.real_yield || undefined,
    },
  });

  useEffect(() => {
    if (cropToEdit) {
      reset({
        id: cropToEdit?.id || 'new',
        crop_name_id: Number(cropToEdit?.crop_name_id) || null,
        crop_name: cropToEdit?.crop_name || "",
        start_date: formatDateForInput(cropToEdit?.start_date),
        end_date: formatDateForInput(cropToEdit?.end_date),
        campaign_id: selectedCampaign?.id || null,
        lot_id: selectedLot?.id || null,
        seed_type: cropToEdit?.seed_type || "",
        real_yield: cropToEdit?.real_yield || undefined,
      });
    } else {
      reset({
        id: 'new',
        crop_name_id: null,
        crop_name: "",
        start_date: new Date(),
        end_date: null,
        campaign_id: selectedCampaign?.id || null,
        lot_id: selectedLot?.id || null,
        seed_type: "",
        real_yield: undefined,
      });
    }
  }, [cropToEdit, reset, selectedCampaign, selectedLot]);


  const onFormSubmit = (data: FormValues) => {
    onSubmit(data);
    reset();

    onOpenChange(false);
  };

  const formatDateForInput = (date?: string | Date | null) => {
    if (!date) return "";
    const d = new Date(date);
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${d.getFullYear()}-${month}-${day}`;
  };


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{mode === 'edit' ? 'Editar Cultivo' : 'Nuevo Cultivo'}</DialogTitle>
          <DialogDescription>
            {campaignName && (
              <span className="block font-medium text-foreground mb-1">
                Campaña: {campaignName}
              </span>
            )}
            {lotName && (
              <span className="block font-medium text-foreground mb-1">
                Lote: {lotName}
              </span>
            )}
            {mode === 'edit' ? 'Modifica los datos del cultivo' : 'Completa los datos para crear un nuevo cultivo'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
          <CustomSelectWithCreate
            label="Cultivo"
            name="crop_name_id"
            options={cropNames.map(c => ({ id: Number(c.id), name: c.name }))}
            register={register}
            errors={errors.crop_name_id?.message}
            selectHeight="h-10"
            mb="0"
            onCreate={async (name: string) => {
              const newCrop = await createCropName(name);
              setValue("crop_name_id", newCrop.id);
              setValue("crop_name", newCrop.name);
            }}
          />

          <div>
            <label className="block text-sm font-medium mb-2">
              Fecha de Inicio *
            </label>

            <input
              type="date"
              {...register("start_date", {
                required: "La fecha de inicio es requerida",
              })}
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
            />

            {errors.start_date && (
              <p className="text-sm text-destructive mt-1">
                {errors.start_date.message}
              </p>
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

          <div>
            <label className="block text-sm font-medium mb-2">
              Tipo de Semilla
            </label>
            <input
              {...register("seed_type", { required: "El tipo de semilla es requerido" })}
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Ej: DK72-10"
            />
            {errors.seed_type && (
              <p className="text-sm text-destructive mt-1">{errors.seed_type.message}</p>
            )}
          </div>

          <div>
            <Controller
              name="real_yield"
              control={control}
              rules={{
                min: { value: 0.01, message: "Debe ser mayor a 0" },
              }}
              render={({ field, fieldState }) => (
                <AmountInput
                  label="Rendimiento Real"
                  value={field.value}
                  onChange={field.onChange}
                  error={fieldState.error?.message}
                  locale="es-AR"
                  placeholder="0,00"
                  currency={undefined}
                />
              )}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit">
              {mode === 'edit' ? 'Guardar Cambios' : 'Crear Cultivo'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}