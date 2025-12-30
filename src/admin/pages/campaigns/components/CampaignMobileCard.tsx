import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Edit, Trash2, ChevronRight } from "lucide-react"
import { Campaign } from "@/interfaces/campaigns/campaign.interface"

interface Props {
  campaign: Campaign
  onEdit: () => void
  onDelete: () => void
  onSelect: () => void
  getStatusBadge: (status: "active" | "inactive") => React.ReactNode
}

export const CampaignMobileCard = ({
  campaign,
  onEdit,
  onDelete,
  onSelect,
  getStatusBadge,
}: Props) => {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4 space-y-3">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-sm">{campaign.name}</h3>
            <p className="text-xs text-muted-foreground">
              Inicio: {new Date(campaign.start_date).toLocaleDateString()}
            </p>
            <p className="text-xs text-muted-foreground">
              Fin: {campaign.end_date
                ? new Date(campaign.end_date).toLocaleDateString()
                : "Sin fecha"}
            </p>
          </div>
          {getStatusBadge(campaign.status as any)}
        </div>

        <div className="flex justify-between items-center pt-2">
          <div className="flex gap-2">
            <Button size="icon" variant="ghost" onClick={onEdit}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="ghost" onClick={onDelete} className="text-destructive">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          <Button size="icon" variant="ghost" onClick={onSelect}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
