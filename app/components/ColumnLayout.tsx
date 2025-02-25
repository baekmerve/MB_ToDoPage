import React, { useMemo, useState } from "react";
import { Column, Id } from "../model/types";
import { LuCirclePlus } from "react-icons/lu";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store/store";
import { v4 as uuidv4 } from "uuid";
import TodoCard from "./TodoCard";
import { addTodo, deleteColumn, updateColumn } from "../store/columnSlice";
import useToast from "../helper/showToast";
import { MdDeleteOutline } from "react-icons/md";

interface Props {
  column: Column;
}

const ColumnContainer = ({ column }: Props) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editedTitle, setEditedTitle] = useState<string>(column.title);
  const dispatch = useDispatch<AppDispatch>();
  const { showToast } = useToast();

  const todoIdList = useMemo(
    () => column.todos?.map((todo) => todo.id),
    [column.todos]
  );
  const generateId = () => {
    return uuidv4();
  };

  const toggleEditMode = () => {
    setIsEditing((prev) => !prev);
  };

  // Function to handle delete a column
  const handleDeleteColumn = (id: Id) => {
    dispatch(deleteColumn({ id }));
    showToast("column has been deleted");
  };
  // Function to handle confirm edit
  const confirmEditing = (id: Id, newTitle: string) => {
    if (newTitle.trim() === "" || newTitle.trim() === column.title.trim()) {
      setIsEditing(false);
      return;
    }
    dispatch(updateColumn({ id, newTitle }));
    showToast("column has been edited");
    setIsEditing(false);
  };
  // Function to handle calcel edit

  const handleCreateTodo = (columnId: Id) => {
    const newTodo = {
      id: generateId(),
      columnId,
      content: `New Task`,
    };
    dispatch(addTodo(newTodo));
  };

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: {
      type: "Board",
      column,
    },
    disabled: isEditing, //disable dragging while editing
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  if (isDragging) {
    return (
      <Card
        ref={setNodeRef}
        style={style}
        className="bg-secondary w-[350px] opacity-40 border-2 border-primary/50 min-h-[500px] max-h-[800px] rounded-md flex flex-col  "
      />
    );
  }

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className="bg-secondary w-[250px] min-h-[500px]  rounded-md flex flex-col border-2 "
    >
      {/* Board Header */}
      <CardHeader
        {...attributes}
        {...listeners}
        className=" text-md h-[80px] cursor-grab rounded-md rounded-b-none py-4 px-2 font-bold  flex items-center justify-between border-b-4 border-primary/50 "
      >
        <div className=" w-full flex justify-between items-center gap-2">
          {/* Task count */}
          <span className=" text-white bg-primary/70 rounded-full px-3 py-1 ">
            {column.todos.length}
          </span>
          <CardTitle>
            {!isEditing ? (
              <div onClick={toggleEditMode} className="text-lg">
                {column.title}
              </div>
            ) : (
              <Input
                type="text"
                value={editedTitle}
                onBlur={() => confirmEditing(column.id, editedTitle)}
                autoFocus
                onKeyDown={(e) =>
                  e.key === "Enter" && confirmEditing(column.id, editedTitle)
                }
                onChange={(e) => setEditedTitle(e.target.value)}
                className="bg-background focus:border-primary/10  rounded-md outline-none px-3 py-1 "
              />
            )}
          </CardTitle>

          <button
            onClick={() => handleDeleteColumn(column.id)}
            className="bg-transparent opacity-60 hover:opacity-100 transition duration-200 shadow-none hover:bg-transparent"
          >
            <MdDeleteOutline className="h-6 w-6 " />
          </button>
        </div>
      </CardHeader>

      {/* To-Do List */}
      <Button
        onClick={() => handleCreateTodo(column.id)}
        className=" w-full mt-2 flex h-14 gap-2 items-center justify-center  border-2 rounded-md p-4 self-center"
      >
        <LuCirclePlus className="text-xl" />
        <span className="font-semibold"> Add New Task</span>
      </Button>
      <div className="flex flex-grow flex-col gap-4 p-2 overflow-x-hidden overflow-y-auto">
        <SortableContext items={todoIdList}>
          {column.todos?.map((todo) => (
            <TodoCard key={todo.id} todo={todo} />
          ))}
        </SortableContext>
      </div>
    </Card>
  );
};

export default ColumnContainer;
