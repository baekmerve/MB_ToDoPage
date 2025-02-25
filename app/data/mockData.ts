import { v4 as uuidv4 } from "uuid";

import { Column } from "../types/types";

const generateId = () => {
  return uuidv4();
};

export const mockData: Column[] = [
  {
    id: generateId(),
    title: "Todo",
    todos: [],
  },
  {
    id: generateId(),
    title: "In progress",
    todos: [],
  },
  {
    id: generateId(),
    title: "Backlog",
    todos: [],
  },

  {
    id: generateId(),
    title: "To test",
    todos: [],
  },
];
