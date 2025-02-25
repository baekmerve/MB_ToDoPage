
export type Id = string | number;

export type Board = {
  id: Id;
  title: string;
};

export type Task = {
  id: Id;
  boardId: Id;
  content: string;
};

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
  type: "Board" | "Task"; // Can be 'Board' for columns, 'Task' for todos
  column?: Column; // Store column details if it's a column
  todo?: Todo; // Store todo details if it's a todo
}
