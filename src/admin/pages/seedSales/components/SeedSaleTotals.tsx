import { formatTn } from "@/lib/format-tn"

interface SeedSaleTotalsProps {
  totalTn: number
  totalTnSold: number
  availableTn: number
  totalTnLabel?: string
}

export const SeedSaleTotals = ({
  totalTn,
  totalTnSold,
  availableTn,
  totalTnLabel = "tn Totales a Entregar"
}: SeedSaleTotalsProps) => {
  return (
    <div className="bg-muted p-3 md:p-4 rounded-lg">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-xs text-muted-foreground">{totalTnLabel}</p>
          <p className="text-lg md:text-2xl font-bold">
            {formatTn(totalTn)}
          </p>
        </div>

        <div>
          <p className="text-xs text-muted-foreground">tn Vendidas</p>
          <p className="text-lg md:text-2xl font-bold text-green-600">
            {formatTn(totalTnSold)}
          </p>
        </div>

        <div>
          <p className="text-xs text-muted-foreground">tn Disponibles</p>
          <p className="text-lg md:text-2xl font-bold text-blue-600">
            {formatTn(availableTn)}
          </p>
        </div>
      </div>
    </div>
  )
}
