// import { VOUCHERS } from '@/constants/voucher';

import { useCallback } from "react";
import { useStore } from "./store";
import { Card, List } from "@/types/task";
import { DragEndEvent } from "@dnd-kit/core";

export const useTaskBoard = () => {
  const {
    lists,
    newListTitle,
    newTaskText,
    editingTask,
    newTag,
    setLists,
    setNewListTitle,
    setIsAddingList,
    setNewTaskText,
    setAddingTaskListId,
    setEditingTask,
    setNewTag,
  } = useStore();

  const addNewList = useCallback((): void => {
    if (!newListTitle.trim()) return;
    const newList: List = {
      id: String(lists.length + 1),
      title: newListTitle,
      tasks: [],
    };
    setLists([...lists, newList]);
    setNewListTitle("");
    setIsAddingList(false);
  }, [newListTitle, lists]);

  const addNewTask = useCallback(
    (listId: string): void => {
      if (!newTaskText.trim()) return;
      const newTask: Card = {
        id: String(Date.now()),
        text: newTaskText,
        tags: [],
      };
      const newLists = lists.map((list: List) =>
        list.id === listId
          ? {
              ...list,
              tasks: [...list.tasks, newTask],
            }
          : list
      );
      setLists(newLists);
      setNewTaskText("");
      setAddingTaskListId("");
    },
    [newTaskText, lists]
  );
  const addTagToTask = useCallback((): void => {
    if (!newTag.trim() || !editingTask) return;
    const updatedLists = lists.map((list) =>
      list.id === editingTask.listId
        ? {
            ...list,
            tasks: list.tasks.map(
              (
                task 
              ) =>
                task.id === editingTask.cardId 
                  ? { ...task, tags: [...task.tags, newTag] }
                  : task
            ),
          }
        : list
    );

    setLists(updatedLists);
    setEditingTask(
      editingTask
        ? { ...editingTask, tags: [...editingTask.tags, newTag] }
        : editingTask
    );
    setNewTag("");
  }, [newTag, editingTask, lists]);

  const handleDragEnd = useCallback(
    (event: DragEndEvent): void => {
      const { active, over } = event;

      if (!over) return;

      const activeId = active.id as string;
      const overId = over.id as string;

      const [sourceListId, sourceCardId] = activeId.split("-");
      const destListId = overId.split("-")[0];

      const newLists = [...lists];
      const sourceListIndex = newLists.findIndex(
        (list) => list.id === sourceListId
      );
      const destListIndex = newLists.findIndex(
        (list) => list.id === destListId
      );
      const sourceCardIndex = newLists[sourceListIndex].tasks.findIndex(
        (card: Card) => card.id === sourceCardId
      );

      if (sourceListId === destListId) {
        const oldIndex = sourceCardIndex;
        const newIndex = over.data.current?.index ?? oldIndex;
        const newtasks = [...newLists[sourceListIndex].tasks];
        const [movedCard] = newtasks.splice(oldIndex, 1);
        newtasks.splice(newIndex, 0, movedCard);
        newLists[sourceListIndex] = {
          ...newLists[sourceListIndex],
          tasks: newtasks,
        };
      } else {
        const [movedCard] = newLists[sourceListIndex].tasks.splice(
          sourceCardIndex,
          1
        );
        newLists[destListIndex].tasks.push(movedCard);
      }

      setLists(newLists);
    },
    [lists]
  );

  return { addNewList, addNewTask, addTagToTask, handleDragEnd };
};
