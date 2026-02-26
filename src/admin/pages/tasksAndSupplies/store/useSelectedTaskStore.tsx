import { CropTask } from "@/interfaces/cropTasks/cropTask.interface";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface SelectedTaskStore {
  selectedTask: CropTask | null;
  setSelectedTask: (task: any) => void;

  formMode: 'create' | 'edit';
  setFormMode: (mode: 'create' | 'edit') => void;
}

export const useSelectedTaskStore = create<SelectedTaskStore>()(
  devtools((set) => ({
    selectedTask: null,
    setSelectedTask: (task: CropTask | null) => set({ selectedTask: task }),

    formMode: 'create',
    setFormMode: (mode) => set({ formMode: mode }),
  }))
);