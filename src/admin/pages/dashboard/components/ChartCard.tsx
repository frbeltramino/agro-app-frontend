import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import { CustomLoadingCard } from "@/components/custom/CustomLoadingCard";

interface ChartCardProps {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
  actions?: ReactNode;
  isLoading?: boolean; // <-- nuevo prop
}

export function ChartCard({
  title,
  description,
  children,
  className,
  actions,
  isLoading = false, // <-- default false
}: ChartCardProps) {
  return (
    <div
      className={cn(
        "bg-card border border-border rounded-xl p-6 shadow-card animate-fade-in",
        className
      )}
      style={{ animationDelay: "0.2s" }}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-xl font-display font-semibold text-foreground">
            {title}
          </h3>
          {description && (
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          )}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>

      {/* 🔹 Si está cargando, mostrar loading */}
      {isLoading ? (
        <CustomLoadingCard />
      ) : (
        children
      )}
    </div>
  );
}