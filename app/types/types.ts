export type Id = string | number;

export type Column = {
  id: Id;
  title: string;
  todos: Todo[];
};

export type Todo = {
  id: Id;
  columnId: Id;
  content: string;
};

export interface DragData {
  type: "Board" | "Task";
  column?: Column;
  todo?: Todo;
}
