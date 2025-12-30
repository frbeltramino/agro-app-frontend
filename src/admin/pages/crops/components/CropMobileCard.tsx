import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Edit, Trash2, ChevronRight } from "lucide-react"
import { Crop } from "@/interfaces/crops/crop.interface"
import { formatKg } from "@/lib/format-kg"

interface CropMobileCardProps {
  crop: Crop
  onSelect: () => void
  onEdit: () => void
  onDelete: () => void
}

export const CropMobileCard = ({
  crop,
  onSelect,
  onEdit,
  onDelete,
}: CropMobileCardProps) => {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4 space-y-3">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-sm">{crop.crop_name}</h3>

            <p className="text-xs text-muted-foreground">
              Siembra: {new Date(crop.start_date).toLocaleDateString()}
            </p>

            <p className="text-xs text-muted-foreground">
              Cosecha:{" "}
              {crop.end_date
                ? new Date(crop.end_date).toLocaleDateString()
                : "Sin fecha"}
            </p>

            <p className="text-xs text-muted-foreground">
              Rendimiento:{" "}
              {crop.real_yield ? formatKg(crop.real_yield) : "—"}
            </p>
          </div>
        </div>

        {/* Actions */}
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
            onClick={(e) => {
              e.stopPropagation()
              onSelect()
            }}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
