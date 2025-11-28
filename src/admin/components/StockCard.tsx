import { CustomLoadingCard } from "@/components/custom/CustomLoadingCard";
import { CustomNoResultsCard } from "@/components/custom/CustomNoResultsCard";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StockCardProps {
  title: string;
  value: number | string;
  description?: string;
  isLoading?: boolean;
  isStatsError?: boolean;
}

export const StockCard = ({ title, value, description, isLoading, isStatsError }: StockCardProps) => {
  return (
    <>
      {
        isLoading && <CustomLoadingCard />
      }

      {
        !isLoading && isStatsError &&
        <CustomNoResultsCard
          title="Error al obtener estadísticas"
          message="Revisa tu conexión a internet o intenta más tarde"
        />
      }

      {
        !isLoading && !isStatsError &&
        <>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{value}</div>
            <p className="text-xs text-muted-foreground">{description}</p>
          </CardContent>
        </>
      }

    </>
  )
}
