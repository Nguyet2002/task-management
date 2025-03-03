import { List } from "@/types/task";
import { useDroppable } from "@dnd-kit/core";

interface DroppableListProps {
  list: List;
  children: React.ReactNode;
}

export function DroppableList({ list, children }: DroppableListProps) {
  const { setNodeRef } = useDroppable({
    id: list.id,
    data: { listId: list.id },
  });

  return (
    <div
      ref={setNodeRef}
      className="w-80 bg-gray-200 rounded-lg shadow-md flex-shrink-0"
    >
      {children}
    </div>
  );
}
