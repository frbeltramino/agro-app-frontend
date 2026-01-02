"use client";

import { ReactNode, forwardRef } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  maxWidth?: string; // opcional, default sm
}

export const BaseModal = forwardRef<HTMLDivElement, BaseModalProps>(
  ({ isOpen, onClose, children }, ref) => {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent
          ref={ref}
          className={`
            w-[95vw] sm:max-w-[600px]
            max-h-[90vh]
            flex flex-col
            p-4 sm:p-6
          `}
        >
          {children}
        </DialogContent>
      </Dialog>
    );
  }
);

BaseModal.displayName = "BaseModal";
