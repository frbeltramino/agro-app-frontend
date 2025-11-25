import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CropTask } from "@/interfaces/cropTasks/cropTask.interface";


type TaskState = {
  // properties
  selectedTask: CropTask | null;
  // getters

  // actions
  setSelectedTask: (task: CropTask) => void;
}

export const useTaskStore = create<TaskState>()(
  persist(
    (set) => ({
      selectedTask: null,
      setSelectedTask: (task) => set({ selectedTask: task }),
    }),
    {
      name: "task-storage",
    }
  )
);