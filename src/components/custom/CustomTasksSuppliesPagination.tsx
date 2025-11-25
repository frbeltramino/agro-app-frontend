import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";

interface Props {
  totalPages: number;
  currentPage?: number; // opcional para controlar desde afuera
  onPageChange?: (page: number) => void; // callback cuando cambia página
}

export const CustomTasksSuppliesPagination = ({
  totalPages,
  currentPage: currentPageProp,
  onPageChange,
}: Props) => {
  const [currentPage, setCurrentPage] = useState(currentPageProp || 1);


  const handlePageChange = async (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;

    setCurrentPage(newPage); // estado local

    if (onPageChange) onPageChange(newPage); // avisar al padre
  };

  return (
    <div className="flex items-center justify-center space-x-2 mt-4">
      <Button
        variant="outline"
        size="sm"
        disabled={currentPage === 1}
        onClick={() => handlePageChange(currentPage - 1)}
      >
        <ChevronLeft className="h-4 w-4" />
        Previous
      </Button>

      {Array.from({ length: totalPages }).map((_, i) => {
        const pageNumber = i + 1;
        return (
          <Button
            key={pageNumber}
            variant={currentPage === pageNumber ? "default" : "outline"}
            size="sm"
            onClick={() => handlePageChange(pageNumber)}
          >
            {pageNumber}
          </Button>
        );
      })}

      <Button
        variant="outline"
        size="sm"
        disabled={currentPage === totalPages}
        onClick={() => handlePageChange(currentPage + 1)}
      >
        Next
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};