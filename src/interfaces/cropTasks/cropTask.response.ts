import { CropTask } from "./cropTask.interface";

export interface CropTaskResponse {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  tasks: CropTask[];
}





