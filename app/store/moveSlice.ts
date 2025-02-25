import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Column, Todo } from "../types/types";

interface MoveState {
  activeBoard?: Column | null;
  activeTask?: Todo | null;
}

const initialState: MoveState = {
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

export const { setActiveBoard, setActiveTask } = moveSlice.actions;

export default moveSlice.reducer;
