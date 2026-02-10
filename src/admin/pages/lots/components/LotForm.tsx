import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";

import { useCampaignStore } from "@/admin/store/campaign.store";
import { useLotStore } from "@/admin/store/lot.store";
import { useEffect, useState } from "react";
import { useLotsMaster } from "@/admin/hooks/useLotsMaster";
import { Lot } from "@/interfaces/lots/lot.interface";
import { SidePanel } from "@/admin/components/SidePanel";
import { MasterLotSelect } from "./MasterLotSelect";

interface FormValues {
  id: number;
  name?: string;
  hectares?: number | null;
  location?: string;
  campaign_id?: string;
  lot_master_id: string;
}


interface LotFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: FormValues) => void;
  campaignName?: string;
}

export function LotForm({ open, onOpenChange, onSubmit }: LotFormProps) {

  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [lotToEdit, setLotToEdit] = useState<Lot | null>(null);
  const { data, createLotMasterMutation } = useLotsMaster();
  const { selectedCampaign } = useCampaignStore();
  const { selectedLot } = useLotStore();

  const lotMasters = data?.lotMasters ?? [];

  const [isCreatingNew, setIsCreatingNew] = useState(false);



  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<FormValues>({
    defaultValues: {
      name: lotToEdit?.name || "",
      hectares: lotToEdit?.hectares || null,
      lot_master_id: "",
      campaign_id: "",
    },
  });

  useEffect(() => {
    if (!open) return

    if (selectedLot) {
      setFormMode("edit")
      setLotToEdit(selectedLot)

      reset({
        id: selectedLot.id,
        name: selectedLot.name,
        hectares: selectedLot.hectares,
        campaign_id: selectedCampaign?.id?.toString() || "",
        lot_master_id: "",
      })
    } else {
      setFormMode("create")
      setLotToEdit(null)

      reset({
        id: 0,
        name: "",
        hectares: null,
        campaign_id: selectedCampaign?.id?.toString() || "",
        lot_master_id: "",
      })
    }

    setIsCreatingNew(false)
  }, [open, selectedLot, selectedCampaign, reset]);


  const handleOpenChange = (open: boolean) => {
    onOpenChange(open);
    setIsCreatingNew(false)
  };

  const toggleCreatingNew = () => {
    setIsCreatingNew(!isCreatingNew);
    if (!isCreatingNew) {
      // Limpiar campos cuando cambia a modo "crear nuevo"
      setValue("lot_master_id", "");
      setValue("name", "");
      setValue("hectares", null);
    }
  };

  const handleLotMasterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const lotMasterId = e.target.value;
    const selectedLot = lotMasters.find(lot => Number(lot.id) === Number(lotMasterId));

    if (selectedLot) {
      setValue("name", selectedLot.name);
      setValue("hectares", selectedLot.default_surface);
    }
  };

  const onFormSubmit = (data: FormValues) => {
    onSubmit(data);
    reset();
    handleOpenChange(false);
  };


  return (
    <>
      <SidePanel
        isOpen={open}
        onClose={() => handleOpenChange(false)}
        title={selectedLot ? "Editar Lote" : "Nuevo Lote"}
      >

        <div className="shrink-0 pb-4 border-b">
          <div>

            <div>
              {selectedCampaign && (
                <span className="block font-medium text-foreground mb-1">
                  Campaña: {selectedCampaign?.name}
                </span>
              )}
              Completa los datos para crear un nuevo lote
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4 pt-4">
          <div className="flex-1 overflow-y-auto overscroll-contain">
            {formMode === 'create' && (
              <>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium">
                    {isCreatingNew ? "Crear Lote Nuevo" : "Seleccionar Lote Maestro"}
                  </label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={toggleCreatingNew}
                  >
                    {isCreatingNew ? "Seleccionar existente" : "Crear nuevo"}
                  </Button>
                </div>

                {!isCreatingNew && (
                  <div>
                    <select
                      {...register("lot_master_id", {
                        required: !isCreatingNew ? "Selecciona un lote" : false,
                      })}
                      onChange={(e) => {
                        register("lot_master_id").onChange(e);
                        handleLotMasterChange(e);
                      }}
                      className="select-standard"
                    >
                      <option value="">Seleccionar lote...</option>
                      {lotMasters.map((lot) => (
                        <option key={lot.id} value={lot.id} className="bg-background text-foreground">
                          {lot.name}
                        </option>
                      ))}
                    </select>
                    {errors.lot_master_id && (
                      <p className="text-sm text-destructive mt-1">{errors.lot_master_id.message}</p>
                    )}
                  </div>
                )}
              </>
            )}
            <div className="mt-2">
              <label className="block text-sm font-medium mb-2">
                Nombre del Lote *
              </label>
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
              <label className="block text-sm font-medium mb-2">
                Hectáreas *
              </label>
              <input
                type="number"
                step="0.01"
                {...register("hectares", {
                  required: "Las hectáreas son requeridas",
                  min: { value: 0.01, message: "Debe ser mayor a 0" }
                })}
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Ej: 120,5"
              />
              {errors.hectares && (
                <p className="text-sm text-destructive mt-1">{errors.hectares.message}</p>
              )}
            </div>

            <div>

              <input
                type="number"
                {...register("campaign_id")}
                className="hidden"
              />
            </div>
            <div className="shrink-0 pt-4 border-t bg-background mt-4">
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleOpenChange(false)}
                  className="flex-1"
                >
                  Cancelar
                </Button>

                <Button
                  type="submit"
                  className="flex-1"
                >
                  {selectedLot ? "Editar" : "Crear"} Lote
                </Button>
              </div>
            </div>
          </div>
        </form>




      </SidePanel>
      <MasterLotSelect
        open={isCreatingNew}
        onOpenChange={setIsCreatingNew}

        onSubmit={async (data) => {
          try {
            await createLotMasterMutation.mutateAsync(data);
            setIsCreatingNew(false);
          } catch (error: any) {
            const message =
              error?.response?.data?.message || error?.message || "Error al crear el lote";
            console.log(message);
          }
        }}
      />
    </>
  );
}
