export interface CropSupplyCheckUsageResponse {
  can_delete: boolean;
  used_in_tasks: UsedInTask[];
}

export interface UsedInTask {
  id: number;
  task_id: number;
  task_description: string;
  task_type_name: string;
  total_used: number;
}
