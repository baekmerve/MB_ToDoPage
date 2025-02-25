import React, { useState } from "react";
import { Id, Todo } from "../model/types";
import { RiDeleteBinLine } from "react-icons/ri";
import { Card } from "@/components/ui/card";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store/store";
import { deleteTodo, updateTodo } from "../store/columnSlice";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface Props {
  todo: Todo;
}

const TodoCard = ({ todo }: Props) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editedContent, setEditedContent] = useState<string>(todo.content);
  const dispatch = useDispatch<AppDispatch>();

  const toggleEditMode = () => {
    setIsEditing(true);
  };

  // Function to delete a task
  const handleDeleteTodo = (id: Id, columnId: Id) => {
    dispatch(deleteTodo({ columnId, id }));
  };

  // Function to update a board
  const handleUpdateTodo = (id: Id, newContent: string, columnId: Id) => {
    if (newContent.trim() !== "" && newContent.trim() !== todo.content.trim()) {
      dispatch(updateTodo({ columnId, id, newContent }));
    }

    setIsEditing(false);
  };

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: todo.id,
    data: {
      type: "Task",
      todo,
    },
    disabled: isEditing, //disable dragging while editing
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="p-2.5 h-[100px] items-center flex text-left rounded-xl border-2 border-primary cursor-grab relative opacity-30 bg-gray-500"
      />
    );
  }

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={toggleEditMode}
      className="p-2.5  h-[100px] flex flex-col justify-between items-start rounded-xl shadow-md hover:ring-2 hover:ring-inset hover:ring-primary cursor-grab transition-transform transform hover:scale-105 relative task"
    >
      {!isEditing ? (
        <p className=" h-full px-3 pt-2  w-full overflow-y-auto overflow-x-hidden whitespace-pre-wrap  ">
          {todo.content}
        </p>
      ) : (
        <Textarea
          className="w-full h-[90%] resize-none rounded bg-transparent shadow-none focus:outline-none focus:border-none"
          value={editedContent}
          autoFocus
          rows={3}
          onBlur={() => handleUpdateTodo(todo.id, editedContent, todo.columnId)}
          placeholder="Add your task details here"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault(); // Prevent new line when Enter is pressed alone

              handleUpdateTodo(todo.id, editedContent, todo.columnId);
            }
          }}
          onChange={(e) => setEditedContent(e.target.value)}
        />
      )}

      <Button
        onClick={() => handleDeleteTodo(todo.id, todo.columnId)}
        className=" self-end p-2 transition duration-300 ease-in-out hover:scale-110"
      >
        <RiDeleteBinLine />
      </Button>
    </Card>
  );
};

export default TodoCard;
