export interface Card {
  id: string;
  text: string;
  tags: string[];
}

export interface List {
  id: string;
  title: string;
  tasks: Card[];
}

export interface EditingTask {
  text: string;
  tags: string[];
  listId: string;
  cardId: string;
}