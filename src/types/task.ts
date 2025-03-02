export type KanbanCard = {
    id: string;
    title: string;
    priority: 'Low' | 'Medium' | 'High';
  };
  
  export type KanbanColumn = {
    id: string;
    title: string;
    cards: KanbanCard[];
  };