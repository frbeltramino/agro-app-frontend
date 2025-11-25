import { agroApi } from "@/api/agroApi";
import { TaskType } from "@/interfaces/cropTasks/taskType.interface";


export const createTaskTypeAction = async (name: string) => {


  const { data } = await agroApi<TaskType>({
    url: '/task/types/new',
    method: 'POST',
    data: {
      name
    }
  })

  return data;

}