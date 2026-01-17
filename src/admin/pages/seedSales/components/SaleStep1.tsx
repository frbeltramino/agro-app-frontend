import {
  FieldErrors,
  UseFormRegister,
  UseFormTrigger,
  UseFormClearErrors
} from "react-hook-form";
import { FormValues } from "./SeedSalesModal";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface SeedSaleStep1Props {
  register: UseFormRegister<FormValues>;
  errors: FieldErrors<FormValues>;
  trigger: UseFormTrigger<FormValues>;
  clearErrors: UseFormClearErrors<FormValues>;

  campaignsData: { id: number; name: string }[];
  cropsData: { crop_name_id: number; crop_name: string }[];

  cropsCampaignLoading: boolean;
  cropsCampaignError?: null | undefined | Error;

  handleCampaignChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;

  onClose: () => void;
  setStep: (step: number) => void;

  isAddingDelivery: boolean;
}




export const SaleStep1 = ({ register, errors, campaignsData, cropsData, cropsCampaignLoading, cropsCampaignError, handleCampaignChange, onClose, setStep, isAddingDelivery, trigger, clearErrors }: SeedSaleStep1Props) => {

  const handleNextStep = async () => {
    const isValid = await trigger(["campaign_id", "crop_name_id"]);

    if (!isValid) return;

    setStep(2);
  };

  return (
    <>
      <div>
        <Label className="text-sm">Campaña *</Label>
        <select
          {...register("campaign_id", {
            required: "La campaña es requerida",
            valueAsNumber: true,
            validate: (value) =>
              value > 0 || "La campaña es requerida",
          })}
          onChange={(e) => {
            register("campaign_id").onChange(e);
            handleCampaignChange(e);
          }}
          className="mt-1.5 w-full px-3 py-2 border rounded-md bg-background text-sm"
          disabled={campaignsData.length === 0}
        >
          <option value={0} disabled>
            Seleccione una campaña
          </option>
          {campaignsData.map((campaign) => (
            <option key={campaign.id} value={campaign.id}>
              {campaign.name}
            </option>
          ))}
        </select>

      </div>

      <div>
        <Label className="text-sm">Cultivo *</Label>
        <select
          {...register("crop_name_id", {
            required: "El cultivo es requerido",
            valueAsNumber: true,
            validate: (value) =>
              value > 0 || "El cultivo es requerido",
          })}
          onChange={(e) => {
            register("crop_name_id").onChange(e);
            clearErrors("crop_name_id");
          }}
          className="mt-1.5 w-full px-3 py-2 border rounded-md bg-background text-sm"
          disabled={cropsData.length === 0 || cropsCampaignLoading}
        >
          <option value={0} disabled>
            Seleccione un cultivo
          </option>
          {cropsData.map((crop) => (
            <option key={crop.crop_name_id} value={crop.crop_name_id}>
              {crop.crop_name}
            </option>
          ))}
        </select>
        {cropsData.length === 0 && (
          <p className="text-sm text-muted-foreground mt-1">No hay cultivos cosechados</p>
        )}
        {errors.crop_name_id && <p className="text-destructive text-xs mt-1">{errors.crop_name_id.message}</p>}
        {cropsCampaignError && (
          <p className="text-sm text-destructive mt-1">
            Error al cargar cultivos
          </p>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">

        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          className="w-full"
          disabled={isAddingDelivery}
        >
          Cancelar
        </Button>
        <Button
          type="button"
          form="seed-sale-form"
          className="w-full"
          onClick={() => handleNextStep()}
        >
          Siguiente
        </Button>

      </div>
    </>
  )
}
