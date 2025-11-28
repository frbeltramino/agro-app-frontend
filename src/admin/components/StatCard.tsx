import { ReactNode } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CustomLoadingCard } from "@/components/custom/CustomLoadingCard";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

interface StatCardProps {
  title: string;
  value: number | string;
  icon: ReactNode;
  description?: string;
  tooltipContent?: string | ReactNode;
  isLoading?: boolean;
}

export const StatCard = ({
  title,
  value,
  icon,
  description,
  tooltipContent,
  isLoading
}: StatCardProps) => {
  return (
    <Card>
      {isLoading ? (
        <CustomLoadingCard />
      ) : (
        <>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            {tooltipContent ? (
              <Tooltip>
                <TooltipTrigger>
                  <CardTitle className="text-sm font-medium cursor-help">
                    {title}
                  </CardTitle>
                </TooltipTrigger>
                <TooltipContent>
                  {tooltipContent}
                </TooltipContent>
              </Tooltip>
            ) : (
              <CardTitle className="text-sm font-medium">
                {title}
              </CardTitle>
            )}

            {icon}
          </CardHeader>

          <CardContent>
            <div className="text-2xl font-bold">{value}</div>
            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
          </CardContent>
        </>
      )}
    </Card>
  );
};