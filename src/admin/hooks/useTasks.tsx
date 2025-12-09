
import { createTaskAction } from "../actions/tasks/create-task.action";
import { deleteTaskByCropIdAction } from "../actions/tasks/delete-task-by-crop-id.action";
import { getTasksByCropIdAction } from "../actions/tasks/get-tasks-by-crop-id.action";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface UseTasksOptions {
  cropId: number;
  page?: number;
  type?: string | number;
  limit?: number;
  search?: string;
}

export const useTasks = ({ cropId, page, limit, type, search }: UseTasksOptions) => {

  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["tasks", { cropId, page, limit, type, search }],
    queryFn: () =>
      getTasksByCropIdAction({
        cropId,
        page,
        limit,
        type,
        description: search,
      }),
    staleTime: 1000 * 60 * 5,
  });

  const createUpdateTask = useMutation({
    mutationFn: createTaskAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["supply"] });
    },
    onError: (error) => {
      console.log(error);
    }
  });

  const deleteTask = useMutation({
    mutationFn: async (payload: any) => {
      const response = await deleteTaskByCropIdAction(payload);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["supply"] });
    },
    onError: (error) => {
      console.log(error);
    }
  });

  return {
    ...query,
    createTaskMutation: createUpdateTask.mutateAsync,
    isCreatingTask: createUpdateTask.isPending,
    deleteTask
  };
};



//TODO: ejemplos de filtros
//?type=Siembra
//?description=urea
//?type=Fumigación&description=herbicida
//?page=1
//&page=2&limit=5