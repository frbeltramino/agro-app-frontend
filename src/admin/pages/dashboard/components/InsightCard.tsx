import { Lightbulb } from "lucide-react";
import { CustomLoadingCard } from "@/components/custom/CustomLoadingCard";

interface InsightCardProps {
  title: string;
  description: string;
  isLoading?: boolean;
}

export function InsightCard({
  title,
  description,
  isLoading = false,
}: InsightCardProps) {
  if (isLoading) {
    return <CustomLoadingCard />;
  }

  return (
    <div
      className="flex items-start gap-4 p-4 bg-accent/50 border border-accent rounded-xl animate-fade-in"
      style={{ animationDelay: "0.3s" }}
    >
      <div className="p-2 bg-primary/10 rounded-lg">
        <Lightbulb className="w-5 h-5 text-primary" />
      </div>
      <div>
        <h4 className="font-semibold text-foreground">{title}</h4>
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
      </div>
    </div>
  );
}