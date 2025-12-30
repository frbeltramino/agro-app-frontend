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
                      className="grid grid-cols-2 gap-2 text-sm py-2 border-b last:border-b-0"
                    >
                      <span className="font-medium">{s.supply_name}</span>
                      <Badge variant="outline">{s.category_name}</Badge>
                      <span>{formatKg(s.dose_per_ha)} {s.unit}</span>
                      <span>{formatKg(s.hectares)}</span>
                      <span>{currencyFormatter(s.price_per_unit)}</span>
                      <span className="font-medium">{currencyFormatter(s.total_used * s.price_per_unit)}</span>
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
