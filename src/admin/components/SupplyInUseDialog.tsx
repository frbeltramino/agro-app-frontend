"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { UsedInTask } from "@/interfaces/cropSupplies/cropSupply.check.usage.response"
import { AlertTriangle } from "lucide-react"

interface ProductInUseDialogProps {
  isOpen: boolean
  onCancel: () => void
  onContinue: () => void
  productName?: string
  usedInTasks?: UsedInTask[]
}

export function SupplyInUseDialog({ isOpen, onCancel, onContinue, productName, usedInTasks }: ProductInUseDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onCancel}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
            <AlertDialogTitle>Producto siendo usado</AlertDialogTitle>
          </div>
          <AlertDialogDescription>
            El producto "<strong>{productName}</strong>" está siendo usado en una o más tareas. Eliminar este producto
            puede afectar esas tareas.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="my-4 p-3 bg-amber-50 dark:bg-amber-950 rounded-md border border-amber-200 dark:border-amber-800">
          <p className="text-sm text-amber-800 dark:text-amber-200">
            ¿Deseas continuar con la eliminación? Se mostrarán los detalles del producto a eliminar.
          </p>
        </div>

        {usedInTasks && usedInTasks.length > 0 && (
          <div className="my-2 p-3 bg-amber-50 dark:bg-amber-950 rounded-md border border-amber-200 dark:border-amber-800">
            <p className="text-sm font-medium mb-2 text-amber-800 dark:text-amber-200">
              Este producto se encuentra en las siguientes tareas:
            </p>
            <ul className="list-disc list-inside text-sm text-amber-800 dark:text-amber-200 space-y-1">
              {usedInTasks.map((task) => (
                <li key={task.id}>
                  <strong>{task.task_description}</strong>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex justify-end gap-3">
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={onContinue} className="bg-amber-600 hover:bg-amber-700 text-white">
            Continuar
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}
