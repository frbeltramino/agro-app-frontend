import { useEffect, useState } from "react"
import { toast } from "sonner"
import { PlusCircle } from "lucide-react"
import { Controller, useForm } from "react-hook-form"

import { useSeedSales } from "@/admin/hooks/useSeedSales"
import { useSalesActionsStore } from "../store/useSalesActionsStore"
import { useSeedSaleDelivery } from "@/admin/hooks/useSeedSaleDelivery"
import { useSeedSaleEditForm } from "../hooks/useSeedSaleEditForm"
import { formatNumber } from "@/lib/format-number"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { SidePanel } from "@/admin/components/SidePanel"
import { AmountInput } from "@/components/custom/CustomAmountInput"

import { SeedSaleTotals } from "./SeedSaleTotals"
import { SaleEditSummary } from "./SaleEditSummary"
import { SeedSaleDeliveriesTable } from "./SeedSaleDeliveriesTable"

import { SeedSale } from "@/interfaces/sales/seed.sale.interface"


interface SeedSaleEditProps {
  isOpen: boolean
  seedSale: SeedSale | null
  onClose: () => void
}

interface DeliveryFormValues {
  primary_liquidation_number: string | undefined | null
  delivery_date: string
  destination: string
  tn_delivered: number | undefined
  price_per_tn: number | undefined
}

export const SeedSaleEdit = ({ seedSale, onClose, isOpen }: SeedSaleEditProps) => {

  const [isAddingDelivery, setIsAddingDelivery] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const { mutation: mutationDelivery, deleteSaleDelivery } = useSeedSaleDelivery();

  const {
    mutation,
  } = useSeedSales({
  })

  const {
    setCropToEdit,
    cropToEdit,
    resetEdit
  } = useSalesActionsStore();

  const {
    editingDeliveryIndex,
    setEditingDeliveryIndex,
    availableTn,
    totalTnSold,
    setTotalTnSold,
    setAvailableTn,
    setTotalTn,
    deliveries,
    setDeliveries,
    createOrUpdateDeliveries

  } = useSeedSaleEditForm();

  const {
    register: registerDelivery,
    handleSubmit: handleSubmitDelivery,
    formState: { errors: deliveryErrors },
    reset: resetDelivery,
    control: controlDelivery,
  } = useForm<DeliveryFormValues>({
    defaultValues: {
      primary_liquidation_number: "",
      delivery_date: new Date().toISOString().split("T")[0],
      destination: "",
      tn_delivered: undefined,
      price_per_tn: undefined,
    },
  })

  const onDeliverySubmit = (data: DeliveryFormValues) => {

    if (data.tn_delivered !== undefined && data.tn_delivered > availableTn) {
      toast.error(`Solo hay ${formatNumber(availableTn.toString())} tn disponibles`)
      return
    }

    createOrUpdateDeliveries({
      data,
      deliveries,
      editingDeliveryIndex,
      initialData: seedSale,
      //selectedCropNameId,
    });

    setEditingDeliveryIndex(null)
    setIsAddingDelivery(false)
    resetDelivery({
      primary_liquidation_number: "",
      delivery_date: "",
      destination: "",
      tn_delivered: undefined,
      price_per_tn: undefined,
    })
  }

  const handleEditDelivery = (index: number) => {
    const delivery = deliveries[index]
    setEditingDeliveryIndex(index)
    setIsAddingDelivery(true)
    resetDelivery({
      primary_liquidation_number: delivery.primary_liquidation_number,
      delivery_date: delivery.delivery_date,
      destination: delivery.destination,
      tn_delivered: delivery.tn_delivered,
      price_per_tn: delivery.price_per_tn,
    })
  }

  const handleDeleteDelivery = (index: number) => {
    const delivery = deliveries[index];
    const updateTotalTnSold = totalTnSold - Number(delivery.tn_delivered);
    const updateAvilableTn = availableTn + Number(delivery.tn_delivered);
    setTotalTnSold(updateTotalTnSold);
    setAvailableTn(updateAvilableTn);
    const updatedDeliveries = deliveries.filter((_, deliveryIndex) => deliveryIndex !== index);
    setDeliveries(updatedDeliveries)
  }

  const handleSubmit = (data: any) => {
    setIsSaving(true);

    const payload: SeedSale = {
      ...data,
      deliveries,
      tn_sold: totalTnSold,
    };

    handelSaveEdit(payload);

    resetDelivery({
      primary_liquidation_number: "",
      delivery_date: "",
      destination: "",
      tn_delivered: undefined,
      price_per_tn: undefined,
    });

    setDeliveries([]);
    onClose();
    setIsSaving(false);
  };

  const handelSaveEdit = async (item: SeedSale) => {
    try {
      if (!cropToEdit) return;

      const existingDeliveries = cropToEdit.deliveries ?? [];

      const existingIds = existingDeliveries
        .map(d => d.id)
        .filter((id): id is number => id != null);

      const incomingIds = item.deliveries
        .map(d => d.id)
        .filter((id): id is number => id != null);

      // 1️⃣ Deliveries eliminados
      const toDeleteIds = existingIds.filter(
        id => !incomingIds.includes(id)
      );

      for (const id of toDeleteIds) {
        await deleteSaleDelivery.mutateAsync(id);
      }

      // 2️⃣ Upsert deliveries
      for (const delivery of item.deliveries) {
        await mutationDelivery.mutateAsync({
          id: delivery.id ?? null,
          primary_liquidation_number: delivery.primary_liquidation_number,
          seed_sale_id: cropToEdit.id,
          crop_name_id: item.crop_name_id,
          delivery_date: delivery.delivery_date,
          destination: delivery.destination,
          tn_delivered: delivery.tn_delivered,
          price_per_tn: delivery.price_per_tn,
        });
      }

      // 3️⃣ Actualizar venta
      await mutation.mutateAsync(item);

      toast.success("Venta de semillas actualizada correctamente");
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Error desconocido al actualizar la venta";

      toast.error(message);
    } finally {
      resetEdit();
    }
  };


  useEffect(() => {
    if (!isOpen || !seedSale) return;
    setCropToEdit(seedSale);
    const deliveries = seedSale?.deliveries || []
    setDeliveries(deliveries);
    const totalDelivered = seedSale.tn_delivered ?? 0;
    const totalSold = seedSale.tn_sold ?? 0;
    const available = totalDelivered - totalSold;

    setTotalTn(totalDelivered);
    setTotalTnSold(totalSold);
    setAvailableTn(available);
    setDeliveries(seedSale.deliveries ?? []);
    setEditingDeliveryIndex(null);
  }, [seedSale]);

  if (!seedSale) {
    return null; // o un loader
  }


  return (

    <SidePanel
      isOpen={isOpen}
      onClose={onClose}
      title={"Editar Entrega de Semillas"}
      width="lg"
    >
      <>
        <div className="space-y-6">
          <h2 className="text-base font-semibold mb-3">
            Información de la Entrega
          </h2>

          <SaleEditSummary
            showContext={true}
            showDelivery={true}
            seedSale={seedSale}
            contextOpenValue={false}
            deliveryOpenValue={true}
          />

          <section>
            <SeedSaleTotals
              totalTn={seedSale.tn_delivered}
              totalTnSold={totalTnSold}
              availableTn={availableTn}
              totalTnLabel="tn Totales Entregadas"
            />
          </section>
          <section>

          </section>
          <section>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="text-base md:text-lg font-semibold">Ventas</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setIsAddingDelivery(true)
                    setEditingDeliveryIndex(null)
                    resetDelivery({
                      primary_liquidation_number: "",
                      delivery_date: "",
                      destination: "",
                      tn_delivered: undefined,
                      price_per_tn: undefined,
                    })
                  }}
                  disabled={isAddingDelivery || availableTn === 0}
                >
                  <PlusCircle className="w-4 h-4 mr-1.5" />
                  <span className="hidden sm:inline">Agregar Venta</span>
                  <span className="sm:hidden">Agregar</span>
                </Button>
              </div>

              {isAddingDelivery && (
                <div className={isAddingDelivery ? "block" : "hidden"}>
                  <form onSubmit={handleSubmitDelivery(onDeliverySubmit)}>
                    <div className="border rounded-lg p-3 md:p-4 bg-muted/30 space-y-3">
                      <h4 className="font-medium text-sm">{isEditing ? "Editar Venta" : "Nueva Venta"}</h4>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {/* Liquidación primaria */}
                        <div className="sm:col-span-2">
                          <Label className="text-sm mb-1.5">Liquidación Primaria *</Label>
                          <input
                            type="text"
                            placeholder="LP-2025-0001"
                            {...registerDelivery("primary_liquidation_number", {
                              required: "La liquidación primaria es requerida",
                            })}
                            className="w-full px-3 py-2 border rounded-md"
                          />
                          {deliveryErrors.primary_liquidation_number && (
                            <p className="text-destructive text-xs mt-1">{deliveryErrors.primary_liquidation_number.message}</p>
                          )}
                        </div>

                        {/* Fecha */}
                        <div>
                          <Label className="text-sm mb-1.5">Fecha de Venta *</Label>
                          <input
                            type="date"
                            {...registerDelivery("delivery_date", { required: "La fecha es requerida" })}
                            className="date-standard"
                          />
                          {deliveryErrors.delivery_date && (
                            <p className="text-destructive text-xs mt-1">{deliveryErrors.delivery_date.message}</p>
                          )}
                        </div>

                        {/* Destino */}
                        <div>
                          <Label className="text-sm mb-1.5">Destino *</Label>
                          <input
                            type="text"
                            {...registerDelivery("destination", { required: "El destino es requerido" })}
                            className="w-full px-3 py-2 border rounded-md"
                          />
                          {deliveryErrors.destination && (
                            <p className="text-destructive text-xs mt-1">{deliveryErrors.destination.message}</p>
                          )}
                        </div>

                        {/* Toneladas */}
                        <div>
                          <Controller
                            name="tn_delivered"
                            control={controlDelivery}
                            rules={{ required: "tn vendidas es obligatorio" }}
                            render={({ field, fieldState }) => (
                              <AmountInput
                                label="tn a Vender *"
                                value={field.value}
                                onChange={field.onChange}
                                error={fieldState.error?.message}
                              />
                            )}
                          />
                        </div>

                        {/* Precio */}
                        <div>
                          <Controller
                            name="price_per_tn"
                            control={controlDelivery}
                            rules={{ required: "Precio por tn es obligatorio" }}
                            render={({ field, fieldState }) => (
                              <AmountInput
                                label="Precio por tn *"
                                value={field.value}
                                onChange={field.onChange}
                                error={fieldState.error?.message}
                                currency="ARS"
                              />
                            )}
                          />
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:justify-end gap-2 pt-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setIsAddingDelivery(false)
                            setIsEditing(false)
                            resetDelivery({
                              primary_liquidation_number: "",
                              delivery_date: "",
                              destination: "",
                              tn_delivered: undefined,
                              price_per_tn: undefined,
                            })
                            setEditingDeliveryIndex(null)
                          }}
                          className="w-full sm:w-auto"
                        >
                          Cancelar
                        </Button>

                        <Button type="submit" size="sm" className="w-full sm:w-auto">
                          {isEditing ? "Actualizar" : "Agregar"}
                        </Button>
                      </div>
                    </div>
                  </form>
                </div>
              )}

              {deliveries.length > 0 && (
                <SeedSaleDeliveriesTable
                  deliveries={deliveries}
                  isAddingDelivery={isAddingDelivery}
                  onEdit={handleEditDelivery}
                  onDelete={handleDeleteDelivery}
                />
              )}

              {deliveries.length === 0 && !isAddingDelivery && (
                <div className="text-center py-6 text-muted-foreground border rounded-lg border-dashed">
                  <p className="text-sm">No hay ventas registradas</p>
                  <p className="text-xs">Haz clic en "Agregar Venta" para comenzar</p>
                </div>
              )}
            </div>

          </section>
          <div className="flex gap-2 mt-8">
            <Button
              variant="outline"
              className="w-1/2"
              onClick={onClose}
            >
              Cancelar
            </Button>

            <Button
              className="w-1/2"
              onClick={() => handleSubmit(seedSale)}
              disabled={isAddingDelivery || isSaving}
            >
              Guardar
            </Button>
          </div>

        </div>
      </>
    </SidePanel>

  )
}
