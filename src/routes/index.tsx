import { useState } from "react";
import { Button } from "@/components/ui/button";
import { createFileRoute } from "@tanstack/react-router";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";

export const Route = createFileRoute("/")({
  component: TaskBoard,
});

const initialLists = [
  {
    id: "1",
    title: "Product Backlog",
    cards: [
      {
        id: "1",
        text: "Create reusable React components",
        tags: ["Priority: Medium", "React"],
      },
      { id: "2", text: "Learn React Hooks", tags: ["React", "Hooks"] },
      {
        id: "3",
        text: "Create Beautiful Drag and Drop Capability",
        tags: ["Priority: Low", "react-beautiful-dnd"],
      },
    ],
  },
  {
    id: "2",
    title: "Work In Progress",
    cards: [
      { id: "4", text: "Learn React", tags: ["Priority: High", "React"] },
      {
        id: "5",
        text: "Write my first React component",
        tags: ["Priority: Medium"],
      },
    ],
  },
  {
    id: "3",
    title: "Done",
    cards: [
      {
        id: "6",
        text: "Create React App",
        tags: ["Priority: Medium", "create-react-app"],
      },
      {
        id: "7",
        text: "Write my first React component",
        tags: ["Priority: Medium"],
      },
    ],
  },
];

export default function TaskBoard() {
  const [lists, setLists] = useState(initialLists);
  const [newListTitle, setNewListTitle] = useState("");
  const [isAddingList, setIsAddingList] = useState(false);
  const [newTaskText, setNewTaskText] = useState("");
  const [addingTaskListId, setAddingTaskListId] = useState("");
  interface Task {
    text: string;
    tags: string[];
    listId: string;
    cardId: string;
  }

  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [newTag, setNewTag] = useState("");

  const addNewList = () => {
    if (!newListTitle.trim()) return;
    const newList = {
      id: String(lists.length + 1),
      title: newListTitle,
      cards: [],
    };
    setLists([...lists, newList]);
    setNewListTitle("");
    setIsAddingList(false);
  };

  const addNewTask = (listId: string) => {
    const newTask = {
      id: String(Date.now()),
      text: newTaskText,
      tags: [],
    };
    const newLists = lists.map((list) => {
      if (list.id === listId) {
        return {
          ...list,
          cards: [...list.cards, newTask],
        };
      }
      return list;
    });
    setLists(newLists);
    setNewTaskText("");
    setAddingTaskListId("");
  };

  const addTagToTask = () => {
    if (!newTag.trim() || !editingTask) return;
    const updatedLists = lists.map((list) =>
      list.id === editingTask.listId
        ? {
            ...list,
            cards: list.cards.map((card) =>
              card.id === editingTask.cardId
                ? { ...card, tags: [...card.tags, newTag] }
                : card
            ),
          }
        : list
    );
    setLists(updatedLists);
    setEditingTask((prev) =>
      prev ? { ...prev, tags: [...prev.tags, newTag] } : prev
    );
    setNewTag("");
  };

  const onDragEnd = (result: DropResult) => {
    console.log("🚀 ~ onDragEnd ~ result:", result);
    if (!result.destination) return;

    const { source, destination } = result;
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;

    const sourceList = lists.find((list) => list.id === source.droppableId);
    const destinationList = lists.find(
      (list) => list.id === destination.droppableId
    );

    if (!sourceList || !destinationList) return;

    const draggedTask = sourceList.cards[source.index];

    sourceList.cards.splice(source.index, 1);
    destinationList.cards.splice(destination.index, 0, {
      ...draggedTask,
    });

    setLists([...lists]);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="h-screen w-screen bg-[#2a5e87] pb-4">
        <div className="w-screen h-16 flex items-center justify-center uppercase text-white text-2xl font-bold text-center mb-4 bg-[#1e485f]">
          Task Board
        </div>

        <div className="flex gap-4 overflow-x-auto p-4">
          {lists.map((list) => (
            <div
              key={list.id}
              className="w-80 bg-gray-200 rounded-lg shadow-md"
            >
              <div className="bg-gray-200 rounded-tr-lg rounded-tl-lg p-4 flex flex-col">
                <span className="px-4 text-md font-bold mb-2 text-gray-700 leading-none ">
                  {list.title}
                </span>
                <span className="px-4 text-gray-700 text-xs font-semibold leading-none">
                  {list.cards.length} Task
                </span>
              </div>
              <Droppable droppableId={list.id} key={list.id}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="px-3 flex flex-col gap-2"
                  >
                    {list.cards.map((card, index) => (
                      <Draggable
                        key={card.id}
                        draggableId={card.id}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="border rounded bg-white p-2"
                            onClick={() =>
                              setEditingTask({
                                listId: list.id,
                                cardId: card.id,
                                text: card.text,
                                tags: card.tags,
                              })
                            }
                          >
                            <p className="text-sm font-medium text-black">
                              {card.text}
                            </p>
                            <div className="flex flex-wrap mt-1 gap-1">
                              {card.tags.map((tag, i) => (
                                <span
                                  key={i}
                                  className="bg-orange-200 text-orange-800 text-xs font-semibold px-2 py-1 rounded"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}{" "}
                    {/* Đặt placeholder đúng chỗ để tránh lỗi */}
                  </div>
                )}
              </Droppable>

              <div className="p-2">
                {addingTaskListId === list.id ? (
                  <div className="flex flex-col gap-2">
                    <input
                      type="text"
                      className="text-gray-700 w-full p-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
                      placeholder="Enter task name..."
                      value={newTaskText}
                      onChange={(e) => setNewTaskText(e.target.value)}
                    />
                    <Button
                      className="bg-blue-500 text-white hover:bg-blue-600"
                      onClick={() => addNewTask(list.id)}
                    >
                      Add Task
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
          ))}

          <div className="p-3 w-80 bg-gray-200 rounded-lg shadow-md">
            {isAddingList ? (
              <div className="flex flex-col gap-2 p-3 bg-black text-white rounded">
                <input
                  type="text"
                  className="w-full text-gray-700 p-2 border rounded focus:outline-none focus:ring focus:ring-blue-300 bg-gray-800 text-white"
                  placeholder="Enter list name..."
                  value={newListTitle}
                  onChange={(e) => setNewListTitle(e.target.value)}
                />
                <div className="flex gap-2">
                  <Button
                    className="bg-blue-500 text-white hover:bg-blue-600 flex-1"
                    onClick={addNewList}
                  >
                    Add list
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
                + Thêm danh sách task mới
              </Button>
            )}
          </div>
          <Dialog
            open={!!editingTask}
            onOpenChange={() => setEditingTask(null)}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingTask?.text}</DialogTitle>
              </DialogHeader>
              <div className="flex flex-wrap gap-2 mb-4">
                {editingTask?.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-purple-400 text-white text-xs font-semibold px-2 py-1 rounded"
                  >
                    {tag}
                  </span>
                ))}
                <Input
                  type="text"
                  placeholder="Add a tag"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                />
                <Button onClick={addTagToTask}>+</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </DragDropContext>
  );
}
