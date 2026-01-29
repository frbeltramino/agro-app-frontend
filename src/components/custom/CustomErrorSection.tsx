import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface ErrorSectionProps {
  message: string;
  onClose?: () => void;
  showButton?: boolean;
}

export const CustomErrorSection = ({ message, onClose, showButton = true }: ErrorSectionProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <AlertTriangle className="w-12 h-12 text-destructive mb-4" />
      <p className="text-sm text-destructive mb-4">{message}</p>
      {showButton && onClose && (
        <Button
          className="mt-2 px-6 py-3"
          size="lg"
          onClick={onClose}
          variant="outline"
        >
          Cerrar
        </Button>
      )}
    </div>
  );
};