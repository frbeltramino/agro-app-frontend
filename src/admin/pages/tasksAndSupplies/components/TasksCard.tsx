import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"

import { currencyFormatter } from "@/lib/currency-formatter"
import { Plus, Search, Edit, Trash2, ChevronDown, ChevronRight, Package } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button";
import { CardTitleSummary } from "./CardTitleSummary"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { CustomTasksSuppliesPagination } from "@/components/custom/CustomTasksSuppliesPagination"
import { useCropStore } from "@/admin/store/crop.store"
import { useTasks } from "@/admin/hooks/useTasks"
import { CustomLoadingCard } from "@/components/custom/CustomLoadingCard"
import { TaskForm } from "./FormTask"
import { useStock } from "@/admin/hooks/useStock"
import React from "react";
import { useTaskTypes } from "@/admin/hooks/useTaskTypes"
import { toast } from "sonner"
import { CustomNoResultsCard } from "@/components/custom/CustomNoResultsCard"
import { CropTask } from "@/interfaces/cropTasks/cropTask.interface"
import { DeleteDialog } from "@/admin/components/DeleteDialog"



export const TasksCard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [deletingItem, setDeletingItem] = useState<any | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [, setCurrentPage] = useState(1);
  const [page, setPage] = useState(1);
  const [openTaskForm, setOpenTaskForm] = useState(false)
  const { data: dataStock } = useStock();
  const { data: taskTypesData } = useTaskTypes();
  const [workTypeFilter, setWorkTypeFilter] = useState("all");
  const { selectedCrop } = useCropStore();
  const { data: tasksData, isLoading, deleteTask } = useTasks({
    cropId: selectedCrop?.id || 0,
    page,
    search: searchTerm,
    type: workTypeFilter == "all" ? undefined : workTypeFilter,
  });
  const [expandedWorks, setExpandedWorks] = useState<number[]>([]);
  const filteredTasks = tasksData?.tasks || [];
  const tasksPagination = {
    page: tasksData?.page || 1,
    limit: tasksData?.limit || 10,
    total: tasksData?.total || 0,
    totalPages: tasksData?.totalPages || 1,
  };

  const toggleWorkExpansion = (workId: number) => {
    setExpandedWorks(prev =>
      prev.includes(workId)
        ? prev.filter(id => id !== workId)
        : [...prev, workId]
    );
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleDeleteTask = async (task: CropTask) => {

    await deleteTask.mutateAsync({
      crop_id: selectedCrop?.id,
      task_id: task.id,
    });

    setCurrentPage(1);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitleSummary title="Lista de Trabajos" count={tasksPagination.total || 0} label="trabajos registrados" />
            </div>
            <Button
              onClick={() => setOpenTaskForm(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Trabajo
            </Button>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <Select
              value={workTypeFilter}
              onValueChange={setWorkTypeFilter}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Tipo de trabajo" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">Todos los tipos</SelectItem>
                {taskTypesData?.taskTypes?.map((t: any) => (
                  <SelectItem key={t.id} value={String(t.id)}>
                    {t.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Buscar por descripción"
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {
            isLoading && <CustomLoadingCard />
          }
          {
            !isLoading && filteredTasks.length === 0 &&
            <CustomNoResultsCard
              title="No se encontraron tareas"
              message="Prueba cambiando la búsqueda o los filtros."
            />
          }
          {
            !isLoading && filteredTasks.length > 0 && (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Suministros usados</TableHead>
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
                    {filteredTasks?.map((task) => {
                      const isOpen = expandedWorks.includes(task.id);

                      return (
                        <React.Fragment key={task.id}>
                          {/* FILA PRINCIPAL */}
                          <TableRow key={task.id}>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => toggleWorkExpansion(task.id)}
                              >
                                {isOpen ? (
                                  <ChevronDown className="h-4 w-4" />
                                ) : (
                                  <ChevronRight className="h-4 w-4" />
                                )}
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
                                <Button variant="ghost" size="icon"
                                  onClick={() => { toast.success("Función de editar próximamente") }}>
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon"
                                  onClick={() => {
                                    setDeletingItem(task);
                                    setIsDeleteDialogOpen(true)
                                  }}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>

                          {/* FILA EXPANDIBLE */}
                          {isOpen && (
                            <TableRow>
                              <TableCell colSpan={7} className="bg-muted/30 p-0">
                                <div className="p-4">
                                  <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                                    <Package className="h-4 w-4" />
                                    Suministros utilizados en este trabajo
                                  </h4>
                                  {
                                    task.supplies.length === 0 && <p className="text-sm text-muted-foreground">No hay suministros utilizados en este trabajo</p>
                                  }
                                  {
                                    task.supplies.length > 0 && <Table>
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
                                        {task.supplies.map((product) => (

                                          <TableRow key={product.supply_id ?? product.stock_id}>
                                            <TableCell className="font-medium">
                                              {product.supply_name}
                                            </TableCell>
                                            <TableCell>
                                              <Badge variant="outline">{product.category_name}</Badge>
                                            </TableCell>
                                            <TableCell>
                                              {product.dose_per_ha} {product.unit}
                                            </TableCell>
                                            <TableCell>
                                              {product.hectares}
                                            </TableCell>
                                            <TableCell>
                                              ${product.price_per_unit.toLocaleString()}
                                            </TableCell>
                                            <TableCell className="text-right font-medium">
                                              ${(product.total_used * product.price_per_unit).toLocaleString()}
                                            </TableCell>

                                          </TableRow>
                                        ))

                                        }
                                      </TableBody>
                                    </Table>
                                  }


                                </div>
                              </TableCell>
                            </TableRow>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </TableBody>
                </Table>
                <div className="mt-4">
                  {
                    tasksPagination.totalPages > 1 && <CustomTasksSuppliesPagination
                      totalPages={Number(tasksPagination?.totalPages) || 1}
                      currentPage={page}
                      onPageChange={(newPage) => setPage(newPage)}
                    />
                  }
                </div>

              </div>
            )}

        </CardContent>
      </Card>
      <TaskForm
        open={openTaskForm}
        onOpenChange={setOpenTaskForm}
        stock={dataStock?.stock}
      />
      <DeleteDialog
        title="Eliminar Tarea"
        description="Esta acción no se puede deshacer."
        item={deletingItem}
        itemData={[
          { label: "Descripción", value: deletingItem?.description || "No hay descripción" },
          { label: "Proveedor", value: deletingItem?.provider || "" },
          { label: "Fecha", value: deletingItem?.date ? new Date(deletingItem?.date).toLocaleDateString() : "No hay fecha de vencimiento" },
        ]}
        isOpen={isDeleteDialogOpen}
        onConfirm={handleDeleteTask}
        onCancel={() => setIsDeleteDialogOpen(false)}

      />
    </>

  )
}
