import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { createFileRoute } from "@tanstack/react-router";
import { useState, useCallback } from "react";
import { DndContext, closestCenter, useDraggable, useDroppable, DragEndEvent } from '@dnd-kit/core';
import { Pencil } from 'lucide-react';

export const Route = createFileRoute("/")({
  component: TaskBoard,
});

interface Card {
  id: string;
  text: string;
  tags: string[];
}

interface List {
  id: string;
  title: string;
  cards: Card[];
}

interface EditingTask {
  text: string;
  tags: string[];
  listId: string;
  cardId: string;
}

const initialLists: List[] = [
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

// Draggable Card Component
interface DraggableCardProps {
  card: Card;
  index: number;
  listId: string;
  onEdit: (task: EditingTask) => void;
}

function DraggableCard({ card, index, listId, onEdit }: DraggableCardProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `${listId}-${card.id}`,
    data: { card, listId, index }
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    transition: 'transform 0.2s ease'
  } : {};

  const handleEdit = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit({
      listId,
      cardId: card.id,
      text: card.text,
      tags: card.tags,
    });
  }, [card, listId, onEdit]);

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="border rounded bg-white p-2 cursor-move flex justify-between items-start shadow-sm"
    >
      <div className="flex-1">
        <p className="text-sm font-medium text-black">{card.text}</p>
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
      <Button
        variant="ghost"
        size="sm"
        className="ml-2 h-6 w-6 p-0 hover:bg-gray-100"
        onMouseDown={handleEdit}
      >
        <Pencil className="h-4 w-4" />
      </Button>
    </div>
  );
}

// Droppable List Component
interface DroppableListProps {
  list: List;
  children: React.ReactNode;
}

function DroppableList({ list, children }: DroppableListProps) {
  const { setNodeRef } = useDroppable({
    id: list.id,
    data: { listId: list.id }
  });

  return (
    <div ref={setNodeRef} className="w-80 bg-gray-200 rounded-lg shadow-md flex-shrink-0">
      {children}
    </div>
  );
}

export default function TaskBoard() {
  const [lists, setLists] = useState<List[]>(initialLists);
  const [newListTitle, setNewListTitle] = useState<string>("");
  const [isAddingList, setIsAddingList] = useState<boolean>(false);
  const [newTaskText, setNewTaskText] = useState<string>("");
  const [addingTaskListId, setAddingTaskListId] = useState<string>("");
  const [editingTask, setEditingTask] = useState<EditingTask | null>(null);
  const [newTag, setNewTag] = useState<string>("");

  const addNewList = useCallback((): void => {
    if (!newListTitle.trim()) return;
    const newList: List = {
      id: String(lists.length + 1),
      title: newListTitle,
      cards: [],
    };
    setLists(prev => [...prev, newList]);
    setNewListTitle("");
    setIsAddingList(false);
  }, [newListTitle, lists]);

  const addNewTask = useCallback((listId: string): void => {
    if (!newTaskText.trim()) return;
    const newTask: Card = {
      id: String(Date.now()),
      text: newTaskText,
      tags: [],
    };
    const newLists = lists.map((list) =>
      list.id === listId
        ? {
            ...list,
            cards: [...list.cards, newTask],
          }
        : list
    );
    setLists(newLists);
    setNewTaskText("");
    setAddingTaskListId("");
  }, [newTaskText, lists]);

  const addTagToTask = useCallback((): void => {
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
  }, [newTag, editingTask, lists]);

  const handleDragEnd = useCallback((event: DragEndEvent): void => {
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const [sourceListId, sourceCardId] = activeId.split('-');
    const destListId = overId.split('-')[0];

    const newLists = [...lists];
    const sourceListIndex = newLists.findIndex(list => list.id === sourceListId);
    const destListIndex = newLists.findIndex(list => list.id === destListId);
    const sourceCardIndex = newLists[sourceListIndex].cards.findIndex(card => card.id === sourceCardId);

    if (sourceListId === destListId) {
      const oldIndex = sourceCardIndex;
      const newIndex = over.data.current?.index ?? oldIndex;
      const newCards = [...newLists[sourceListIndex].cards];
      const [movedCard] = newCards.splice(oldIndex, 1);
      newCards.splice(newIndex, 0, movedCard);
      newLists[sourceListIndex] = {
        ...newLists[sourceListIndex],
        cards: newCards
      };
    } else {
      const [movedCard] = newLists[sourceListIndex].cards.splice(sourceCardIndex, 1);
      newLists[destListIndex].cards.push(movedCard);
    }

    setLists(newLists);
  }, [lists]);

  const handleEdit = useCallback((task: EditingTask) => {
    setTimeout(() => {
      setEditingTask(task);
    }, 0);
  }, []);

  return (
    <div className="h-screen w-screen bg-[#2a5e87] pb-4 flex flex-col">
      <div className="w-full h-16 flex items-center justify-center uppercase text-white text-2xl font-bold text-center mb-4 bg-[#1e485f]">
        Task Board
      </div>

      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <div className="flex gap-4 overflow-x-auto p-4 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 flex-1">
          {lists.map((list) => (
            <DroppableList key={list.id} list={list}>
              <div className="bg-gray-200 rounded-t-lg p-4 flex flex-col">
                <span className="px-4 text-md font-bold mb-2 text-gray-700 leading-none">
                  {list.title}
                </span>
                <span className="px-4 text-gray-700 text-xs font-semibold leading-none">
                  {list.cards.length} Task
                </span>
              </div>
              <div className="px-3 flex flex-col gap-2">
                {list.cards.map((card, index) => (
                  <DraggableCard
                    key={card.id}
                    card={card}
                    index={index}
                    listId={list.id}
                    onEdit={handleEdit}
                  />
                ))}
              </div>
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
            </DroppableList>
          ))}
          <div className="p-3 w-80 bg-gray-200 rounded-lg shadow-md flex-shrink-0">
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
          <Dialog open={!!editingTask} onOpenChange={(open) => !open && setEditingTask(null)}>
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
                  placeholder="Thêm tag mới"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  className="flex-1"
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