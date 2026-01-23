import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: LucideIcon;
  variant?: "default" | "primary" | "secondary";
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  variant = "default",
  trend,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl p-4 sm:p-6 transition-all duration-300 hover:shadow-soft w-full max-w-full",
        "animate-fade-in",
        variant === "default" && "bg-card border border-border",
        variant === "primary" && "bg-primary text-primary-foreground",
        variant === "secondary" && "bg-secondary text-secondary-foreground"
      )}
      style={{
        animationDelay: "0.1s",
        ...(variant === "secondary"
          ? { backgroundColor: "hsl(35, 85%, 55%)", color: "hsl(30, 10%, 15%)" }
          : {}),
      }}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
        <div className="space-y-1 sm:space-y-2">
          <p
            className={cn(
              "text-sm font-medium",
              variant === "default" && "text-muted-foreground",
              variant !== "default" && "opacity-80"
            )}
          >
            {title}
          </p>
          <p className="text-2xl sm:text-3xl font-display font-bold tracking-tight">{value}</p>
          {subtitle && (
            <p
              className={cn(
                "text-sm",
                variant === "default" && "text-muted-foreground",
                variant !== "default" && "opacity-70"
              )}
            >
              {subtitle}
            </p>
          )}
          {trend && (
            <div className="flex items-center gap-1 mt-1 flex-wrap sm:flex-nowrap">
              <span
                className={cn(
                  "text-sm font-medium",
                  trend.isPositive ? "text-primary" : "text-destructive"
                )}
              >
                {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
              </span>
              <span className="text-xs text-muted-foreground">vs período anterior</span>
            </div>
          )}
        </div>

        <div
          className={cn(
            "p-3 rounded-lg flex-shrink-0",
            variant === "default" && "bg-accent",
            variant === "primary" && "bg-primary-foreground/10",
            variant === "secondary" && "bg-secondary-foreground/10"
          )}
        >
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}
