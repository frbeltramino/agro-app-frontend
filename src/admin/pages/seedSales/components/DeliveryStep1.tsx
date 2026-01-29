import {

  UseFormRegister,
  UseFormTrigger,
  UseFormClearErrors
} from "react-hook-form";

import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { FormValues } from "./SeedDeliveryForm";

interface SeedSaleStep1Props {
  register: UseFormRegister<FormValues>;
  trigger: UseFormTrigger<FormValues>;
  clearErrors: UseFormClearErrors<FormValues>;
  onClose: () => void;
  setStep: (step: number) => void;

  campaignsData: { id: number; name: string }[];
  cropsData: { crop_name_id: number; crop_name: string }[];

  cropsCampaignLoading: boolean;
  cropsCampaignError?: null | undefined | Error;

  handleCampaignChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}





export const DeliveryStep1 = ({ register, onClose, setStep, trigger, clearErrors, campaignsData, cropsData, cropsCampaignLoading, cropsCampaignError, handleCampaignChange }: SeedSaleStep1Props) => {


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
              value ? value > 0 || "La campaña es requerida" : true,
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
              value ? value > 0 || "El cultivo es requerido" : true,
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
          size="lg"
        >
          Cancelar
        </Button>
        <Button
          type="button"
          form="seed-sale-form"
          className="w-full"
          onClick={() => handleNextStep()}
          size="lg"
        >
          Siguiente
        </Button>

      </div>
    </>
  )
}
