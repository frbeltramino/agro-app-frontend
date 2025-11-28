import { Search } from 'lucide-react'

interface CustomNoResultsCardProps {
  title?: string;
  message?: string;
}

export const CustomNoResultsCard = ({ title, message }: CustomNoResultsCardProps) => {
  return (
    <div className="py-12 text-center text-muted-foreground">
      <Search className="mx-auto mb-3 h-10 w-10 opacity-50" />
      <p className="text-lg font-medium">{title || "No se encontraron resultados."}</p>
      <p className="text-sm">{message || "Prueba cambiando la búsqueda o los filtros."} </p>
    </div>
  )
}
