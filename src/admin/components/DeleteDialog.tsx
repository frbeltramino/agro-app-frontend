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

interface DeleteDialogProps {
  isOpen: boolean
  onConfirm: (item: any) => void
  onCancel: () => void
  itemId?: number | string | null
  item?: any;
  title?: string
  description?: string
  isLoading?: boolean
  itemData?: {
    label: string
    value: string
  }[]
}

export function DeleteDialog({
  isOpen,
  onConfirm,
  onCancel,
  itemId,
  item,
  title = "Eliminar elemento",
  description = "Esta acción no se puede deshacer.",
  isLoading = false,
  itemData = [],
}: DeleteDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onCancel}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>

        {itemData.length > 0 && (
          <div className="my-4 p-3 bg-muted rounded-md space-y-2">
            {itemData.map((item, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span className="font-medium text-foreground">{item.label}:</span>
                <span className="text-muted-foreground">{item.value}</span>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-end gap-3">
          <AlertDialogCancel disabled={isLoading}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => onConfirm(item ?? itemId)}
            disabled={isLoading}
            className="bg-destructive hover:bg-destructive/90 text-white"
          >
            {isLoading ? "Eliminando..." : "Eliminar"}
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}
