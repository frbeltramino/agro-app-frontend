import { Info } from "lucide-react";
import { ReactNode } from "react";

interface EmptySectionProps {
  title?: string;
  message?: string;
  icon?: ReactNode;
}

export const ReportEmptySection = ({
  title = "Información",
  message = "No se pudo encontrar información.",
  icon = <Info className="w-4 h-4" />,
}: EmptySectionProps) => {
  return (
    <section className="mb-6">
      <h2 className="report-section-title flex items-center gap-2">
        {icon}
        {title}
      </h2>

      <div className="rounded-lg border border-border bg-muted/40 p-6 text-center">
        <p className="text-sm text-muted-foreground">
          {message}
        </p>
      </div>
    </section>
  );
};