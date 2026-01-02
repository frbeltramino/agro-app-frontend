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
  ({ isOpen, onClose, children, maxWidth = "sm:max-w-[600px]" }, ref) => {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent
          ref={ref}
          className={`
            w-[95vw] ${maxWidth}
            max-h-[90vh] overflow-y-auto overflow-x-hidden
            p-4 sm:p-6
            mt-8 sm:mt-0
            top-8 sm:top-1/2
            translate-y-0 sm:-translate-y-1/2
          `}
        >
          {children}
        </DialogContent>
      </Dialog>
    );
  }
);

BaseModal.displayName = "BaseModal";
