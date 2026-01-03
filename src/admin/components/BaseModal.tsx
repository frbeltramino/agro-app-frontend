"use client"

import { type ReactNode, forwardRef } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"

interface BaseModalProps {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
}

export const BaseModal = forwardRef<HTMLDivElement, BaseModalProps>(
  ({ isOpen, onClose, children }, ref) => {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent
          ref={ref}
          className="
            w-full h-[100dvh]
            sm:w-[95vw] sm:max-w-[600px] sm:max-h-[90vh]
            flex flex-col
            p-0
            rounded-none sm:rounded-lg
            border-0 sm:border
            overflow-hidden
          "
        >
          <div className="flex flex-col flex-1 min-h-0 px-4 py-4 sm:px-6 sm:py-6">
            {children}
          </div>
        </DialogContent>
      </Dialog>
    )
  }
)

BaseModal.displayName = "BaseModal"