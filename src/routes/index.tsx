import { DraggableCard } from "@/components/draggable-card";
import { DroppableList } from "@/components/droppable-list";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useStore } from "@/hooks/store";
import { useTaskBoard } from "@/hooks/useTaskBoard";
import { EditingTask } from "@/types/task";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { createFileRoute } from "@tanstack/react-router";
import { useCallback } from "react";

export const Route = createFileRoute("/")({
  component: TaskBoard,
});

export default function TaskBoard() {
  const {
    lists,
    newListTitle,
    isAddingList,
    newTaskText,
    addingTaskListId,
    editingTask,
    newTag,
    setNewListTitle,
    setIsAddingList,
    setNewTaskText,
    setAddingTaskListId,
    setEditingTask,
    setNewTag,
  } = useStore();

  const { addNewList, addNewTask, addTagToTask, handleDragEnd } =
    useTaskBoard();

  const handleEdit = useCallback((task: EditingTask) => {
    setTimeout(() => {
      setEditingTask(task);
    }, 0);
  }, []);

  return (
    <div className="h-screen w-screen bg-[#2a5e87]  flex flex-col">
      <div className="w-full h-16 flex items-center justify-center uppercase text-white text-2xl font-bold text-center mb-4 bg-[#1e485f]">
        Task Board
      </div>

      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <div className="flex gap-4 p-4 flex-1 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
          {lists.map((list) => (
            <div className="h-screen bg-gray-200 rounded-t-lg flex flex-col">
              <DroppableList key={list.id} list={list}>
                <div className="flex flex-col p-4">
                  <span className="px-4 text-md font-bold mb-2 text-gray-700 leading-none">
                    {list.title}
                  </span>
                  <span className="px-4 text-gray-700 text-xs font-semibold leading-none">
                    {list.tasks.length} Task
                  </span>
                </div>
                <div className="px-3 flex flex-col gap-2">
                  {list.tasks.map((card, index) => (
                    <DraggableCard
                      key={card.id}
                      index={index}
                      listId={list.id}
                      onEdit={handleEdit}
                      card={card}
                    />
                  ))}
                  <div className="p-2">
                    {addingTaskListId === list.id ? (
                      <div className="flex flex-col gap-2">
                        <Input
                          type="text"
                          className="w-full p-2 border rounded focus:outline-none focus:ring focus:ring-blue-300 text-gray-700"
                          placeholder="Enter task name..."
                          value={newTaskText}
                          onChange={(e) => setNewTaskText(e.target.value)}
                        />
                        <Button
                          className="bg-blue-500 text-white hover:bg-blue-600"
                          onClick={() => addNewTask(list.id)}
                        >
                          Thêm task
                        </Button>
                      </div>
                    ) : (
                      <Button
                        className="mt-2 w-full bg-blue-500 text-white hover:bg-blue-600"
                        onClick={() => setAddingTaskListId(list.id)}
                      >
                        + Thêm task mới
                      </Button>
                    )}
                  </div>
                </div>
              </DroppableList>
            </div>
          ))}
          <div className="p-3 w-80 bg-gray-200 rounded-lg shadow-md flex-shrink-0 h-screen">
            {isAddingList ? (
              <div className="flex flex-col gap-2 p-3 bg-black text-white rounded">
                <Input
                  type="text"
                  className="w-full p-2 border rounded focus:outline-none focus:ring focus:ring-blue-300 bg-gray-800 text-white"
                  placeholder="Tên cột..."
                  value={newListTitle}
                  onChange={(e) => setNewListTitle(e.target.value)}
                />
                <div className="flex gap-2">
                  <Button
                    className="bg-blue-500 text-white hover:bg-blue-600 flex-1"
                    onClick={addNewList}
                  >
                    Thêm cột mới
                  </Button>
                  <Button
                    className="bg-gray-500 text-white hover:bg-gray-600"
                    onClick={() => setIsAddingList(false)}
                  >
                    ✖
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                className="w-full bg-gray-300 text-white hover:bg-gray-400"
                onClick={() => setIsAddingList(true)}
              >
                + Thêm cột mới
              </Button>
            )}
          </div>
          <Dialog
            open={!!editingTask}
            onOpenChange={(open) => !open && setEditingTask(null)}
          >
            <DialogContent className="bg-white">
              <DialogHeader>
                <DialogTitle className="text-gray-800">
                  {editingTask?.text}
                </DialogTitle>
              </DialogHeader>
              <div className="flex flex-col gap-2 mb-4">
                <div className="flex flex-wrap gap-2">
                  {editingTask?.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-purple-400 text-white text-xs font-semibold px-2 py-1 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <Input
                  type="text"
                  placeholder="Thêm tag mới"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  className="flex-1 text-gray-800"
                />
                <Button onClick={addTagToTask}>+</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </DndContext>
    </div>
  );
}
