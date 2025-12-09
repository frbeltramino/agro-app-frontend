export interface CropSupplyCheckUsageResponse {
  can_delete: boolean;
  used_in_tasks: UsedInTask[];
}

export interface UsedInTask {
  id: number;
  task_id: number;
  task_description: string;
  total_used: number;
}
