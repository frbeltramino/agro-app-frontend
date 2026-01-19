import { ReactNode } from "react";
import { Wheat, Leaf, Sun, Flower2 } from "lucide-react";

const cropIconsMap: Record<string, ReactNode> = {
  "Maíz": <Wheat className="h-4 w-4" />,
  "Sorgo": <Leaf className="h-4 w-4" />,
  "Soja": <Leaf className="h-4 w-4" />,
  "Girasol": <Sun className="h-4 w-4" />,
  "Alfalfa": <Flower2 className="h-4 w-4" />,
};

// Función para obtener el ícono del cultivo con default
export function getCropIcon(cropName: string): ReactNode {
  return cropIconsMap[cropName] ?? <Leaf className="h-4 w-4" />; // Leaf como default
}