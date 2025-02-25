import { v4 as uuidv4 } from "uuid";

import { Column } from "../model/types";

const generateId = () => {
  return uuidv4();
};

export const mockData: Column[] = [
  {
    id: generateId(),
    title: "Backlog",
    todos: [],
  },
  {
    id: generateId(),
    title: "In progess",
    todos: [],
  },
  {
    id: generateId(),
    title: "To test",
    todos: [],
  },
];
