import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight, Edit, Trash2, Package } from "lucide-react";
import { useState } from "react";
import { formatKg } from "@/lib/format-kg";
import { currencyFormatter } from "@/lib/currency-formatter";
import { CropTask } from "@/interfaces/cropTasks/cropTask.interface";

interface TasksCardMobileProps {
  tasks: CropTask[];
  onEdit: (task: CropTask) => void;
  onDelete: (task: CropTask) => void;
}

export const TasksCardMobile = ({ tasks, onEdit, onDelete }: TasksCardMobileProps) => {
  const [expandedTasks, setExpandedTasks] = useState<number[]>([]);

  const toggleTask = (taskId: number) => {
    setExpandedTasks(prev =>
      prev.includes(taskId) ? prev.filter(id => id !== taskId) : [...prev, taskId]
    );
  };

  if (!tasks || tasks.length === 0) {
    return <p className="text-muted-foreground">No se encontraron tareas</p>;
  }

  return (
    <div className="space-y-4">
      {tasks.map(task => {
        const isOpen = expandedTasks.includes(task.id);
        return (
          <Card key={task.id}>
            <CardHeader className="flex justify-between items-start">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => toggleTask(task.id)}
                  >
                    {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  </Button>
                  <span className="font-medium">{task.type}</span>
                </div>
                <span className="text-sm text-muted-foreground">{task.description || "Sin descripción"}</span>
                <span className="text-xs text-muted-foreground">
                  {new Date(task.date).toLocaleDateString()} • {task.provider} • Costo: {currencyFormatter(Number(task.total_price))}
                </span>
              </div>
              <div className="flex gap-2">
                <Button size="icon" variant="ghost" onClick={() => onEdit(task)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="ghost" onClick={() => onDelete(task)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>

            {isOpen && task.supplies.length === 0 && (
              <p className="text-sm text-muted-foreground pl-6">
                No hay suministros utilizados en este trabajo
              </p>
            )}

            {isOpen && task.supplies.length > 0 && (
              <CardContent className="pt-0">
                <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                  <Package className="h-4 w-4" /> Suministros usados
                </h4>
                <div className="space-y-0">
                  {task.supplies.map((s) => (
                    <div
                      key={s.supply_id ?? s.stock_id}
                      className="py-3 border-b last:border-b-0 space-y-2"
                    >
                      {/* Header */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="font-medium truncate">
                            {s.supply_name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {s.category_name}
                          </p>
                        </div>

                        <Badge
                          variant={s.stock_id ? "secondary" : "outline"}
                          className="shrink-0"
                        >
                          {s.stock_id ? "Stock" : "Compra"}
                        </Badge>
                      </div>

                      {/* Data grid */}
                      <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-sm">
                        <div>
                          <p className="text-xs text-muted-foreground">Dosis/ha</p>
                          <p>{formatKg(s.dose_per_ha)} {s.unit}</p>
                        </div>

                        <div>
                          <p className="text-xs text-muted-foreground">Cant/ha</p>
                          <p>{formatKg(s.hectares)}</p>
                        </div>

                        <div>
                          <p className="text-xs text-muted-foreground">Costo/U</p>
                          <p>{currencyFormatter(s.price_per_unit)}</p>
                        </div>

                        <div>
                          <p className="text-xs text-muted-foreground">Total</p>
                          <p className="font-medium">
                            {currencyFormatter(s.total_used * s.price_per_unit)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            )}
          </Card>
        );
      })}
    </div>
  );
};
