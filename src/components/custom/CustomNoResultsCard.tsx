import { Search } from 'lucide-react'

interface CustomNoResultsCardProps {
  title?: string;
  message?: string;
  icon?: React.ElementType;
}

export const CustomNoResultsCard = ({ title, message, icon: Icon }: CustomNoResultsCardProps) => {
  return (
    <div className="py-12 text-center text-muted-foreground">
      {Icon ? (
        <Icon className="mx-auto mb-3 h-10 w-10 opacity-50" />
      ) : (
        <Search className="mx-auto mb-3 h-10 w-10 opacity-50" />
      )}
      <p className="text-lg font-medium">{title || "No se encontraron resultados."}</p>
      <p className="text-sm">{message || "Prueba cambiando la búsqueda o los filtros."} </p>
    </div>
  )
}
