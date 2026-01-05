import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect } from "react";

interface SidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  width?: "sm" | "md" | "lg";
}

const widths = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
};

export const SidePanel = ({
  isOpen,
  onClose,
  title,
  children,
  width = "md",
}: SidePanelProps) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;


  return (
    <div className="fixed inset-0 z-50">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      {/* Panel */}
      <aside
        className={cn(
          "fixed top-0 right-0 h-full bg-background shadow-xl flex flex-col animate-in slide-in-from-right duration-300 w-full sm:" + widths[width]
        )}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b px-4 py-3 bg-background">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button
            onClick={onClose}
            className="rounded-md p-1 hover:bg-muted"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          {children}
        </div>
      </aside>
    </div>
  );
};
