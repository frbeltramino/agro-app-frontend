import { CustomLoadingCard } from "@/components/custom/CustomLoadingCard";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StockCardProps {
  title: string;
  value: number | string;
  description?: string;
  isLoading?: boolean;
}

export const StockCard = ({ title, value, description, isLoading }: StockCardProps) => {
  return (
    <>
      {
        isLoading ? <CustomLoadingCard /> :
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
