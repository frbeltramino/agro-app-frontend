import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Plus, Search } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button";
import { CardTitleSummary } from "./CardTitleSummary"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CustomTasksSuppliesPagination } from "@/components/custom/CustomTasksSuppliesPagination"
import { useCropStore } from "@/admin/store/crop.store"
import { useTasks } from "@/admin/hooks/useTasks"
import { CustomLoadingCard } from "@/components/custom/CustomLoadingCard"
import { TaskForm } from "./FormTask"
import { useStock } from "@/admin/hooks/useStock"
import { useTaskTypes } from "@/admin/hooks/useTaskTypes"
import { CustomNoResultsCard } from "@/components/custom/CustomNoResultsCard"
import { CropTask } from "@/interfaces/cropTasks/cropTask.interface"
import { DeleteDialog } from "@/admin/components/DeleteDialog"
import { TasksCardMobile } from "./TasksCardMobile"
import { TasksCardDesktop } from "./TasksCardDesktop"



export const TasksCard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [deletingItem, setDeletingItem] = useState<any | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [selectedTask, setSelectedTask] = useState<any | null>(null);
  const [, setCurrentPage] = useState(1);
  const [page, setPage] = useState(1);
  const [openTaskForm, setOpenTaskForm] = useState(false)
  const { data: dataStock, adjustStock } = useStock();
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
    if (!task) return;
    // Si hay suministros de stock, ajustar el stock
    const stockSupplies = task.supplies.filter(s => s.from_stock);

    if (stockSupplies.length > 0) {
      for (const s of stockSupplies) {
        await adjustStock.mutateAsync({
          stockId: Number(s.stock_id),
          quantity: Number(s.total_used),
        });
      }
    }

    await deleteTask.mutateAsync({
      crop_id: selectedCrop?.id,
      task_id: task.id,
    });

    setIsDeleteDialogOpen(false);
    setCurrentPage(1);
  };

  const openEditForm = (task: CropTask) => {
    setFormMode('edit');
    setSelectedTask(task);
    setOpenTaskForm(true);
    console.log(task);
  };

  const handleOpenDeleteDialog = (task: CropTask) => {
    setDeletingItem(task);
    setIsDeleteDialogOpen(true);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <CardTitleSummary title="Lista de Trabajos" count={tasksPagination.total || 0} label="trabajos registrados" />
            </div>
            <Button
              className="w-full sm:w-auto"
              onClick={() => {
                setFormMode('create');
                setSelectedTask(null);
                setOpenTaskForm(true);
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Trabajo
            </Button>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 mt-4">
            <Select value={workTypeFilter} onValueChange={setWorkTypeFilter}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Tipo de trabajo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los tipos</SelectItem>
                {taskTypesData?.taskTypes?.map((t: any) => (
                  <SelectItem key={t.id} value={String(t.id)}>{t.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Buscar por descripción"
                className="pl-10 w-full"
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
              <>
                <div className="space-y-3 md:hidden">
                  <TasksCardMobile
                    tasks={filteredTasks}
                    onEdit={openEditForm}
                    onDelete={handleOpenDeleteDialog}
                  />
                </div>

                <div className="hidden md:block overflow-x-auto">
                  <TasksCardDesktop
                    tasks={filteredTasks}
                    expandedWorks={expandedWorks}
                    toggleWorkExpansion={toggleWorkExpansion}
                    onEdit={openEditForm}
                    onDelete={handleOpenDeleteDialog}
                  />
                </div>
                <div className="mt-4">
                  {
                    tasksPagination.totalPages > 1 && <CustomTasksSuppliesPagination
                      totalPages={Number(tasksPagination?.totalPages) || 1}
                      currentPage={page}
                      onPageChange={(newPage) => setPage(newPage)}
                    />
                  }
                </div>
              </>
            )}

        </CardContent>
      </Card>
      <TaskForm
        open={openTaskForm}
        onOpenChange={setOpenTaskForm}
        stock={dataStock?.stock}
        taskToEdit={formMode === 'edit' ? selectedTask : undefined}
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
