
import { agroApi } from "@/api/agroApi";

export const deleteTaskByCropIdAction = async (payload: any) => {
  const { crop_id, task_id } = payload;

  const { data } = await agroApi({
    url: `/tasks/crop/${crop_id}/${task_id}`,
    method: "DELETE",
  });

  return data;
};