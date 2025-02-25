import { configureStore } from "@reduxjs/toolkit";

import moveReducer from "./moveSlice";
import undoableColumnReducer from "./columnSlice";

const store = configureStore({
  reducer: {
    move: moveReducer,
    columns: undoableColumnReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
