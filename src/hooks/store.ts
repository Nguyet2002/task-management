import { initialLists } from "@/components/data/data";
import { EditingTask, List } from "@/types/task";
import { create } from "zustand";



interface StoreState {
  lists: List[];
  newListTitle: string;
  isAddingList: boolean;
  newTaskText: string;
  addingTaskListId: string;
  editingTask: EditingTask | null;
  newTag: string;
  setLists: (lists: List[]) => void;
  setNewListTitle: (title: string) => void;
  setIsAddingList: (value: boolean) => void;
  setNewTaskText: (text: string) => void;
  setAddingTaskListId: (id: string) => void;
  setEditingTask: (task: EditingTask | null) => void;
  setNewTag: (tag: string) => void;
  addList: (list: List) => void;
  resetNewListFields: () => void;
  resetNewTaskFields: () => void;
}

export const useStore = create<StoreState>((set) => ({
  lists: initialLists,
  newListTitle: "",
  isAddingList: false,
  newTaskText: "",
  addingTaskListId: "",
  editingTask: null,
  newTag: "",

  setLists: (lists) => set({ lists }),
  setNewListTitle: (title) => set({ newListTitle: title }),
  setIsAddingList: (value) => set({ isAddingList: value }),
  setNewTaskText: (text) => set({ newTaskText: text }),
  setAddingTaskListId: (id) => set({ addingTaskListId: id }),
  setEditingTask: (task) => set({ editingTask: task }),
  setNewTag: (tag) => set({ newTag: tag }),

  addList: (list) =>
    set((state) => ({
      lists: [...state.lists, list],
    })),

  resetNewListFields: () =>
    set({
      newListTitle: "",
      isAddingList: false,
    }),

  resetNewTaskFields: () =>
    set({
      newTaskText: "",
      addingTaskListId: "",
    }),
}));
