import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Edit, Trash2, ChevronRight } from "lucide-react"
import { Lot } from "@/interfaces/lots/lot.interface"

interface LotMobileCardProps {
  lot: Lot
  onSelect: () => void
  onEdit: () => void
  onDelete: () => void
}

export const LotMobileCard = ({
  lot,
  onSelect,
  onEdit,
  onDelete,
}: LotMobileCardProps) => {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4 space-y-3">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-sm">{lot.name}</h3>
            <p className="text-xs text-muted-foreground">
              Área: {lot.hectares} ha
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center pt-2">
          <div className="flex gap-2">
            <Button
              size="icon"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation()
                onEdit()
              }}
            >
              <Edit className="h-4 w-4" />
            </Button>

            <Button
              size="icon"
              variant="ghost"
              className="text-destructive"
              onClick={(e) => {
                e.stopPropagation()
                onDelete()
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          <Button
            size="icon"
            variant="ghost"
            onClick={onSelect}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
