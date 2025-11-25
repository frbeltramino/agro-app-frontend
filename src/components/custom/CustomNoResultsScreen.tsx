import { SearchX } from "lucide-react";

interface CustomEmptyStateProps {
  message: string;
}


export const CustomNoResultsScreen = ({ message }: CustomEmptyStateProps) => {
  return (
    <div className="flex h-full w-full items-center justify-center py-10">
      <div className="flex flex-col items-center gap-3 text-center">
        <SearchX className="h-10 w-10 text-muted-foreground" />
        <p className="text-lg font-medium text-muted-foreground">
          {message}
        </p>
      </div>
    </div>
  );
};
