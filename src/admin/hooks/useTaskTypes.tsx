import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getTaskTypesAction } from "../actions/tasks/get-task-types.action";
import { createTaskTypeAction } from "../actions/tasks/create-task-type.action";


export const useTaskTypes = () => {

  const queryClient = useQueryClient();
  // Obtener tipos de tarea
  const taskTypesQuery = useQuery({
    queryKey: ["task-types"],
    queryFn: () => getTaskTypesAction(),
    staleTime: 1000 * 60 * 5,
  });

  // Crear nuevo tipo de tarea
  const createTaskTypeMutation = useMutation({
    mutationFn: (name: string) => createTaskTypeAction(name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["task-types"] });
    },
  });

  return {
    ...taskTypesQuery,
    createTaskTypeMutation,
    isCreatorTaskType: createTaskTypeMutation.isPending,
  };
};