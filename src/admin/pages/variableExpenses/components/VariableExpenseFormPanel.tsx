// 1️⃣ React / librerías externas
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { InfoIcon } from "lucide-react";

// 2️⃣ UI Components / librerías internas
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

// 4️⃣ Custom components
import { AmountInput } from "@/components/custom/CustomAmountInput";

// 5️⃣ Interfaces / types
import { VariableExpense } from "@/interfaces/variableExpenses/variable.expenses.response";
import { Lot } from "@/interfaces/variableExpenses/variable.expenses.lots.response";
import { ExpenseType } from "@/interfaces/variableExpenses/variable-expense-types";
import { Campaign } from "@/interfaces/campaigns/campaign.interface";
import { VariableExpenseFormData } from "@/interfaces/variableExpenses/variable-expenses";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CustomSelectWithCreate } from "@/components/custom/CustomSelectWithCreate";
import { useVariableExpenseTypes } from "@/admin/hooks/useVariableExpenseTypes";


interface VariableExpenseFormPanelProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: VariableExpenseFormData) => void;
  editingExpense?: VariableExpense | null;
  campaigns: Campaign[];
  lots: Lot[];
  expenseTypes: ExpenseType[];
  onCampaignChange: (campaignId: number) => void;
}


export const VariableExpenseFormPanel = ({
  open,
  onClose,
  onSubmit,
  editingExpense,
  campaigns,
  lots,
  expenseTypes,
  onCampaignChange,
}: VariableExpenseFormPanelProps) => {

  const { createVariableExpenseType } = useVariableExpenseTypes();

  const { register, handleSubmit, reset, control, setValue, watch, formState: { errors } } =
    useForm<VariableExpenseFormData>({
      defaultValues: {
        campaign_id: null,
        lot_id: null,
        hectares: 0,
        tons_harvested: 0,
        expense_type_id: null,
        provider: "",
        expense_date: undefined,
        amount: undefined,
      },
    });

  const selectedCampaignId = watch("campaign_id");


  useEffect(() => {
    if (!open) return;

    if (editingExpense) {
      // Convertimos VariableExpense -> VariableExpenseFormData
      const formData: VariableExpenseFormData = {
        campaign_id: editingExpense.campaign_id,
        lot_id: editingExpense.lot_id,
        hectares: editingExpense.hectares,
        tons_harvested: editingExpense.tons_harvested,
        expense_type_id: editingExpense.expense_type_id,
        provider: editingExpense.provider || "",
        expense_date: editingExpense.expense_date ? editingExpense.expense_date : undefined,
        amount: editingExpense.amount,
      };
      reset(formData);
    } else {
      reset({
        campaign_id: null,
        lot_id: null,
        hectares: 0,
        tons_harvested: 0,
        expense_type_id: null,
        provider: "",
        expense_date: undefined,
        amount: undefined,
      });
    }
  }, [editingExpense, open, reset]);

  const handleCampaignChange = (value: string) => {
    const campaignId = parseInt(value);
    setValue("campaign_id", campaignId);
    setValue("lot_id", null);
    setValue("hectares", 0);
    setValue("tons_harvested", 0);
    onCampaignChange(campaignId);
  };

  const handleLotChange = (value: string) => {
    const lotId = parseInt(value);
    const selectedLot = lots.find((l) => l.lot_id === lotId);
    setValue("lot_id", lotId);
    setValue("hectares", selectedLot?.lot_hectares || 0);
    setValue("tons_harvested", selectedLot?.real_yield || 0);
  };



  const onFormSubmit = (data: VariableExpenseFormData) => {
    console.log(data);
    onSubmit(data);
    reset();
    onClose();
  };

  return (
    <Sheet open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <SheetContent className="w-full sm:max-w-lg px-6 py-6 overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-xl">
            {editingExpense ? "Editar Gasto Variable" : "Nuevo Gasto Variable"}
          </SheetTitle>
        </SheetHeader>
        <Alert variant="info">
          <InfoIcon />
          <AlertTitle>Lotes!</AlertTitle>
          <AlertDescription>
            Los lotes solo aparecerán si tienen cultivos con fecha y toneladas cosechadas registradas en la sección de "Cultivos".
          </AlertDescription>
        </Alert>

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-5">
          {/* Campaña */}
          <div className="space-y-2">
            <Label htmlFor="campaign">Campaña *</Label>
            <Select
              value={selectedCampaignId?.toString() || ""}
              onValueChange={handleCampaignChange}
            >
              <SelectTrigger id="campaign" className="w-full">
                <SelectValue placeholder="Seleccionar campaña" />
              </SelectTrigger>
              <SelectContent>
                {campaigns.map((campaign) => (
                  <SelectItem key={campaign.id} value={campaign.id.toString()}>
                    {campaign.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.campaign_id && (
              <p className="text-sm text-destructive mt-1">{errors.campaign_id.message}</p>
            )}
          </div>

          {/* Lote */}
          <div className="space-y-2">
            <Label htmlFor="lot">Lote *</Label>
            <Select
              value={watch("lot_id")?.toString() || ""}
              onValueChange={handleLotChange}
              disabled={!selectedCampaignId}
            >
              <SelectTrigger id="lot" className="w-full">
                <SelectValue placeholder="Seleccionar lote" />
              </SelectTrigger>
              <SelectContent>
                {lots.map((lot) => (
                  <SelectItem key={lot.lot_id} value={lot.lot_id.toString()}>
                    {lot.lot_name} - {lot.crop_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.lot_id && <p className="text-sm text-destructive mt-1">{errors.lot_id.message}</p>}
          </div>

          {/* Hectáreas */}
          <div className="space-y-2">
            <Label htmlFor="hectares">Hectáreas</Label>
            <Controller
              name="hectares"
              control={control}
              render={({ field }) => (
                <AmountInput
                  {...field}
                  className="w-full"
                  placeholder="0,00"
                  disabled
                />
              )}
            />
          </div>

          {/* Toneladas cosechadas */}
          <div className="space-y-2">
            <Label htmlFor="tons">Tn Cosechadas</Label>
            <Controller
              name="tons_harvested"
              control={control}
              render={({ field }) => (
                <Input {...field} disabled className="pr-10" />
              )}
            />
          </div>

          {/* Tipo de gasto */}
          <div className="space-y-2">
            <CustomSelectWithCreate
              label="Tipo de gasto"
              name="expense_type_id"
              options={expenseTypes.map(et => ({ id: Number(et.id), name: et.name }))}
              register={register}
              errors={errors.expense_type_id?.message}
              selectHeight="h-10"
              mb="0"
              onCreate={async (name: string) => {
                createVariableExpenseType.mutate({ name });
              }}
            />
          </div>

          {/* Prestador */}
          <div className="space-y-2">
            <Label htmlFor="provider">Prestador (opcional)</Label>
            <Controller
              name="provider"
              control={control}
              defaultValue="" // muy importante
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Nombre del prestador"
                />
              )}
            />
          </div>

          {/* Fecha */}
          <div className="space-y-2">
            <Label>Fecha *</Label>
            <input
              type="date"
              {...register("expense_date", {
                required: "La fecha es requerida",
              })}
              className="date-standard"
            />
            {errors.expense_date && (
              <p className="text-sm text-destructive mt-1">{errors.expense_date.message}</p>
            )}

          </div>

          {/* Monto */}
          <div className="space-y-2">
            <Label htmlFor="amount">Monto *</Label>
            <Controller
              name="amount"
              control={control}
              rules={{ required: "Monto es requerido" }}
              render={({ field, fieldState }) => (
                <AmountInput
                  {...field}
                  value={field.value}
                  onChange={field.onChange}
                  className="w-full"
                  placeholder="0,00"
                  currency="USD"
                  error={fieldState.error?.message}
                />
              )}
            />
          </div>

          {/* Botones */}
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" className="flex-1">
              {editingExpense ? "Guardar Cambios" : "Crear Gasto"}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
};