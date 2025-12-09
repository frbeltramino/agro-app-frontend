import { agroApi } from "@/api/agroApi";

export const createTaskAction = async (payload: any) => {

  const { task_id } = payload;
  const isCreating = task_id === null;

  const { data } = await agroApi<any>({
    url: isCreating ? "/tasks/new" : `/tasks/${task_id}`,
    method: isCreating ? "POST" : "PATCH",
    data: payload,
  });

  return data;
};