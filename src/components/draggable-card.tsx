import { Card, EditingTask } from "@/types/task";
import { useCallback } from "react";
import { Button } from "./ui/button";
import { Pencil } from "lucide-react";
import { useDraggable } from "@dnd-kit/core";

interface DraggableCardProps {
  card: Card;
  index: number;
  listId: string;
  onEdit: (task: EditingTask) => void;
}

export function DraggableCard({
  card,
  index,
  listId,
  onEdit,
}: DraggableCardProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `${listId}-${card.id}`,
    data: { card, listId, index },
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        transition: "transform 0.2s ease",
      }
    : {};

  const handleEdit = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onEdit({
        listId,
        cardId: card.id,
        text: card.text,
        tags: card.tags,
      });
    },
    [card, listId, onEdit]
  );

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className=" border rounded bg-white p-2 cursor-move flex justify-between items-start shadow-sm"
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
