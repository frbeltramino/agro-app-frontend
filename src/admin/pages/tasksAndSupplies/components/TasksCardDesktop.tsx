import React from "react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronRight, Edit, Trash2, Package } from "lucide-react";
import { CropTask } from "@/interfaces/cropTasks/cropTask.interface";
import { formatKg } from "@/lib/format-kg";
import { currencyFormatter } from "@/lib/currency-formatter";


interface TasksCardDesktopProps {
  tasks: CropTask[];
  expandedWorks: number[];
  toggleWorkExpansion: (taskId: number) => void;
  onEdit: (task: CropTask) => void;
  onDelete: (task: CropTask) => void;
}

export const TasksCardDesktop = ({
  tasks,
  expandedWorks,
  toggleWorkExpansion,
  onEdit,
  onDelete,
}: TasksCardDesktopProps) => {
  if (!tasks || tasks.length === 0) {
    return <p className="text-muted-foreground">No se encontraron tareas</p>;
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead />
            <TableHead>Tipo</TableHead>
            <TableHead>Descripción</TableHead>
            <TableHead>Fecha de realización</TableHead>
            <TableHead>Proveedor</TableHead>
            <TableHead>Costo M/O</TableHead>
            <TableHead>Costo total</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map(task => {
            const isOpen = expandedWorks.includes(task.id);

            return (
              <React.Fragment key={task.id}>
                {/* FILA PRINCIPAL */}
                <TableRow>
                  <TableCell>
                    <Button variant="ghost" size="icon" onClick={() => toggleWorkExpansion(task.id)}>
                      {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </Button>
                  </TableCell>
                  <TableCell className="font-medium">{task.type}</TableCell>
                  <TableCell>{task.description || "No hay descripción"}</TableCell>
                  <TableCell>{new Date(task.date).toLocaleDateString()}</TableCell>
                  <TableCell>{task.provider}</TableCell>
                  <TableCell>{currencyFormatter(Number(task.laborCost))}</TableCell>
                  <TableCell>{currencyFormatter(Number(task.total_price))}</TableCell>


                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => onEdit(task)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => onDelete(task)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>

                {/* FILA EXPANDIBLE */}
                {isOpen && (
                  <TableRow>
                    <TableCell colSpan={8} className="bg-muted/30 p-0">
                      <div className="p-4">
                        <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                          <Package className="h-4 w-4" /> Suministros utilizados en este trabajo
                        </h4>

                        {task.supplies.length === 0 && (
                          <p className="text-sm text-muted-foreground ml-4">No hay suministros utilizados en este trabajo</p>
                        )}

                        {task.supplies.length > 0 && (
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Suministro</TableHead>
                                <TableHead>Tipo</TableHead>
                                <TableHead>Dosis/h</TableHead>
                                <TableHead>Cant/h</TableHead>
                                <TableHead>Costo/Unidad</TableHead>
                                <TableHead className="text-right">Costo Total</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {task.supplies.map(s => (
                                <TableRow key={s.supply_id ?? s.stock_id} className="border-b last:border-b-0">
                                  <TableCell className="font-medium">{s.supply_name}</TableCell>
                                  <TableCell>
                                    <Badge variant="outline">{s.category_name}</Badge>
                                  </TableCell>
                                  <TableCell>{formatKg(s.dose_per_ha)} {s.unit}</TableCell>
                                  <TableCell>{formatKg(s.hectares)}</TableCell>
                                  <TableCell>{currencyFormatter(s.price_per_unit)}</TableCell>
                                  <TableCell className="text-right font-medium">{currencyFormatter((s.dose_per_ha * s.hectares) * s.price_per_unit)}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            );
          })}
        </TableBody>
      </Table>
    </>
  );
};
