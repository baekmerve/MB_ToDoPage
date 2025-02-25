import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Id, Column, Todo } from "../types/types";
import { mockData } from "../data/mockData";
import undoable from "redux-undo";
import { arrayMove } from "@dnd-kit/sortable";

interface ColumnState {
  columns: Column[];
}

const loadColumns = (): Column[] => {
  // Only access localStorage if you're on the client side, this can be done by checking if window is available
  if (typeof window !== "undefined") {
    try {
      const existingColumns = JSON.parse(
        localStorage.getItem("columns") || "[]"
      );

      // Ensure the data in localStorage is an array, fallback to mockData if it's not
      if (Array.isArray(existingColumns) && existingColumns.length > 0) {
        return existingColumns; // Return the columns from localStorage if they are valid
      } else {
        // If the data is invalid, reset it with mockData
        localStorage.setItem("columns", JSON.stringify(mockData));
        return mockData;
      }
    } catch (error) {
      console.error("Error loading columns from localStorage:", error);
      // If there's an error parsing the data, reset it with mockData
      localStorage.setItem("columns", JSON.stringify(mockData));
      return mockData;
    }
  }

  return mockData; // Return mockData if we're on the server side or if window is undefined
};

const initialState: ColumnState = {
  columns: loadColumns(),
};

const boardSlice = createSlice({
  name: "columns",
  initialState,
  reducers: {
    // Add a new column
    addColumn: (state, action: PayloadAction<Column>) => {
      state.columns.push(action.payload);
    },

    // Add a new todo to a column
    addTodo: (
      state,
      action: PayloadAction<{ columnId: Id; content: string; id: Id }>
    ) => {
      const { columnId, content, id } = action.payload;

      // Find the corresponding column and add the new todo to that column's todos array
      const column = state.columns.find(
        (col) => col.id === action.payload.columnId
      );
      if (column) {
        // Create a new todo object
        const newTodo: Todo = {
          id: id,
          content: content,
          columnId: columnId,
        };
        // Add the new todo to the column's todos
        column.todos.push(newTodo);
      }
    },

    // Delete a column (removes column and its todos)
    deleteColumn: (state, action: PayloadAction<{ id: Id }>) => {
      const columnId = action.payload.id;

      // find the column from the columns array
      const columnToDelete = state.columns.find(
        (column) => column.id === columnId
      );
      if (columnToDelete) {
        // Remove todos related to the deleted column (clearing the column's todos array)
        columnToDelete.todos = [];
      }

      // remove the column itself
      state.columns = state.columns.filter((column) => column.id !== columnId);
    },

    // Delete a todo from a column
    deleteTodo: (state, action: PayloadAction<{ columnId: Id; id: Id }>) => {
      const { columnId, id } = action.payload;

      // Find the column containing the todo
      const column = state.columns.find((column) => column.id === columnId);

      if (column) {
        // Remove the todo from the column's todos array
        column.todos = column.todos?.filter((todo) => todo.id !== id);
      }
    },

    // Update column title
    updateColumn: (
      state,
      action: PayloadAction<{ id: Id; newTitle: string }>
    ) => {
      const { id, newTitle } = action.payload;
      const column = state.columns.find((column) => column.id === id);

      if (column) {
        // Apply the new title to the column
        column.title = newTitle;
      }
    },

    // Update todo content
    updateTodo: (
      state,
      action: PayloadAction<{ columnId: Id; id: Id; newContent: string }>
    ) => {
      const { columnId, id, newContent } = action.payload;

      // Find the column
      const column = state.columns.find((col) => col.id === columnId);
      if (column) {
        // Find the todo within the column
        const todo = column.todos?.find((todo) => todo.id === id);

        if (todo) {
          // Update the todo content
          todo.content = newContent;
        }
      }
    },

    reorderColumns: (
      state,
      action: PayloadAction<{
        activeColumnIndex: number;
        overColumnIndex: number;
      }>
    ) => {
      const { activeColumnIndex, overColumnIndex } = action.payload;

      if (
        activeColumnIndex < 0 ||
        overColumnIndex < 0 ||
        activeColumnIndex >= state.columns.length ||
        overColumnIndex >= state.columns.length
      ) {
        return;
      }

      state.columns = arrayMove(
        state.columns,
        activeColumnIndex,
        overColumnIndex
      );
    },

    moveTaskWithinColumn: (
      state,
      action: PayloadAction<{
        columnId: string;
        taskId: string;
        destinationTaskId: string;
      }>
    ) => {
      const { columnId, taskId, destinationTaskId } = action.payload;
      const column = state.columns.find((col) => col.id === columnId);
      if (!column) return;

      const activeIndex = column.todos.findIndex((task) => task.id === taskId);
      const overIndex = column.todos.findIndex(
        (task) => task.id === destinationTaskId
      );

      if (activeIndex !== -1 && overIndex !== -1) {
        column.todos = arrayMove(column.todos, activeIndex, overIndex);
      }
    },

    moveTaskToAnotherColumn: (
      state,
      action: PayloadAction<{
        activeColumnId: string;
        overColumnId: string;
        taskId: string;
        destinationTaskId?: string; // Optional: ID of the task it's dropped over
      }>
    ) => {
      const { activeColumnId, overColumnId, taskId, destinationTaskId } =
        action.payload;

      const sourceColumn = state.columns.find(
        (col) => col.id === activeColumnId
      );
      const destinationColumn = state.columns.find(
        (col) => col.id === overColumnId
      );

      if (!sourceColumn || !destinationColumn) return;

      // Find and remove the task from the source column
      const activeTaskIndex = sourceColumn.todos.findIndex(
        (task) => task.id === taskId
      );
      if (activeTaskIndex === -1) return;

      const [movedTask] = sourceColumn.todos.splice(activeTaskIndex, 1);
      movedTask.columnId = overColumnId; // Update column ID for the task

      // Find the correct index to insert in the new column
      const destinationIndex = destinationTaskId
        ? destinationColumn.todos.findIndex(
            (task) => task.id === destinationTaskId
          )
        : destinationColumn.todos.length; // If no destinationTaskId, add to the end

      destinationColumn.todos.splice(destinationIndex, 0, movedTask);
    },
  },
});

const undoableColumnReducer = undoable(boardSlice.reducer);
export default undoableColumnReducer;

export const {
  addColumn,
  addTodo,
  updateColumn,
  updateTodo,
  deleteColumn,
  deleteTodo,
  reorderColumns,
  moveTaskWithinColumn,
  moveTaskToAnotherColumn,
} = boardSlice.actions;
