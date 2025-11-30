"use client"

import { forwardRef, useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import { SeedSale } from "@/interfaces/sales/seed.sale.interface"




interface FormValues {
  waybill_number: string
  destination: string
  date: string
  kg_delivered: number
  kg_sold: number
  status: string
}

interface SeedSalesModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (item: SeedSale) => void
  initialData: SeedSale | null
}

const statuses = [
  { value: "pending", label: "Pendiente" },
  { value: "completed", label: "Completado" },
  { value: "cancelled", label: "Cancelado" },
]

export const SeedSalesModal = forwardRef<HTMLDivElement, SeedSalesModalProps>(
  ({ isOpen, onClose, onSave, initialData }, ref) => {
    const [isSaving, setIsSaving] = useState(false)

    const {
      register,
      handleSubmit,
      formState: { errors },
      reset,
    } = useForm<FormValues>({
      defaultValues: {
        waybill_number: initialData?.waybill_number || "",
        destination: initialData?.destination || "",
        date: initialData?.sale_date || new Date().toISOString().split("T")[0],
        kg_delivered: initialData?.kg_delivered || 0,
        kg_sold: initialData?.kg_sold || 0,
        status: initialData?.status || "pending"
      },
    })

    const onFormSubmit = (data: FormValues) => {
      setIsSaving(true);

      if (Number(data.kg_sold) > Number(data.kg_delivered)) {
        toast.error("Los kg vendidos no pueden ser mayores que los kg entregados");
        setIsSaving(false);
        return;
      }

      const item: SeedSale = {
        id: initialData?.id || null,
        waybill_number: data.waybill_number,
        sale_date: data.date,
        destination: data.destination,
        kg_delivered: Number(data.kg_delivered),
        kg_sold: Number(data.kg_sold),
        status: data.status,
        deleted_at: null
      };

      onSave(item); // React Query maneja errores
      reset();
      onClose();
      setIsSaving(false);
    };

    useEffect(() => {
      if (initialData) {
        reset({
          waybill_number: initialData.waybill_number,
          destination: initialData.destination,
          date: initialData.sale_date,
          kg_delivered: initialData.kg_delivered,
          kg_sold: initialData.kg_sold,
          status: initialData.status,
        });
      } else {
        reset({
          waybill_number: "",
          destination: "",
          date: new Date().toISOString().split("T")[0],
          kg_delivered: 0,
          kg_sold: 0,
          status: "pending",
        });
      }
    }, [initialData, reset]);


    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent ref={ref} className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{initialData ? "Editar Venta" : "Nueva Venta de Semillas"}</DialogTitle>
            <DialogDescription>
              {initialData ? "Actualiza los datos de la venta" : "Registra una nueva venta de semillas"}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Carta de Porte *</label>
                <input
                  type="text"
                  {...register("waybill_number", { required: "La carta de porte es requerida" })}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Ej: CP-2024-001"
                />
                {errors.waybill_number && (
                  <p className="text-destructive text-sm mt-1">{errors.waybill_number.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Destino *</label>
                <input
                  type="text"
                  {...register("destination", { required: "El destino es requerido" })}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Ej: Buenos Aires"
                />
                {errors.destination && <p className="text-destructive text-sm mt-1">{errors.destination.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Fecha *</label>
                <input
                  type="date"
                  {...register("date", { required: "La fecha es requerida" })}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                {errors.date && <p className="text-destructive text-sm mt-1">{errors.date.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Estado *</label>
                <select
                  {...register("status", { required: "El estado es requerido" })}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  {statuses.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
                {errors.status && <p className="text-destructive text-sm mt-1">{errors.status.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">KG Entregados *</label>
                <input
                  type="number"
                  step="0.01"
                  {...register("kg_delivered", {
                    required: "Los kg entregados son requeridos",
                    min: { value: 0, message: "Debe ser positivo" },
                  })}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="0.00"
                />
                {errors.kg_delivered && <p className="text-destructive text-sm mt-1">{errors.kg_delivered.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">KG Vendidos *</label>
                <input
                  type="number"
                  step="0.01"
                  {...register("kg_sold", {
                    required: "Los kg vendidos son requeridos",
                    min: { value: 0, message: "Debe ser positivo" },
                  })}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="0.00"
                />
                {errors.kg_sold && <p className="text-destructive text-sm mt-1">{errors.kg_sold.message}</p>}
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isSaving}
                className="flex items-center gap-2"
              >
                {isSaving ? (
                  <>
                    Guardando...
                    <div className="h-4 w-4 animate-spin rounded-full border-2  border-t-transparent" />
                  </>
                ) : initialData ? (
                  "Actualizar"
                ) : (
                  "Crear"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    )
  },
)

SeedSalesModal.displayName = "SeedSalesModal"
