import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Column, Todo } from "../model/types";

interface MoveState {
  sourceId: { columnId: string; todoId?: string };
  destinationId: { columnId: string; todoId?: string };
  activeBoard?: Column | null;
  activeTask?: Todo | null;
}

const initialState: MoveState = {
  sourceId: { columnId: "", todoId: undefined },
  destinationId: { columnId: "", todoId: undefined },
  activeBoard: null,
  activeTask: null,
};

const moveSlice = createSlice({
  name: "move",
  initialState,
  reducers: {
   
   
    setActiveBoard: (state, action: PayloadAction<Column | null>) => {
      state.activeBoard = action.payload;
    },
    setActiveTask: (state, action: PayloadAction<Todo | null>) => {
      state.activeTask = action.payload;
    },
  },
});

export const {  setActiveBoard, setActiveTask } =
  moveSlice.actions;

export default moveSlice.reducer;
