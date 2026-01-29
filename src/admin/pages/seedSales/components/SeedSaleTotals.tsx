import { formatTn } from "@/lib/format-tn"

interface SeedSaleTotalsProps {
  totalTn1: number
  totalTn2: number
  availableTn: number
  totalTnLabel1?: string
  totalTnLabel2?: string
}

export const SeedSaleTotals = ({
  totalTn1,
  totalTn2,
  availableTn,
  totalTnLabel1 = "tn Totales cosechadas",
  totalTnLabel2 = "tn entregadas"
}: SeedSaleTotalsProps) => {
  return (
    <div className="bg-muted p-3 md:p-4 rounded-lg">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-xs text-muted-foreground">{totalTnLabel1}</p>
          <p className="text-lg md:text-2xl font-bold">
            {formatTn(totalTn1)}
          </p>
        </div>

        <div>
          <p className="text-xs text-muted-foreground">{totalTnLabel2}</p>
          <p className="text-lg md:text-2xl font-bold text-green-600">
            {formatTn(totalTn2)}
          </p>
        </div>

        <div>
          <p className="text-xs text-muted-foreground">tn Disponibles</p>
          <p
            className={`text-lg md:text-2xl font-bold ${availableTn <= 0 ? "text-red-600" : "text-blue-600"
              }`}
          >
            {formatTn(availableTn)}
          </p>
        </div>
      </div>
    </div>
  )
}
