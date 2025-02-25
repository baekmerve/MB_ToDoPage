import { Button } from "@/components/ui/button";
import React, { useEffect, useMemo } from "react";
import { LuCirclePlus } from "react-icons/lu";
import { Column } from "../types/types";
import { v4 as uuidv4 } from "uuid";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import {
  addColumn,
  moveTaskToAnotherColumn,
  moveTaskWithinColumn,
  reorderColumns,
} from "../store/columnSlice";
import ColumnLayout from "./ColumnLayout";
import useToast from "../helper/showToast";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import { setActiveBoard, setActiveTask } from "../store/moveSlice";
import TodoCard from "./TodoCard";
import { createPortal } from "react-dom";

const KanbanLayout = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { showToast } = useToast();
  const columns = useSelector(
    (state: RootState) => state.columns.present.columns
  );
  const { activeBoard, activeTask } = useSelector(
    (state: RootState) => state.move
  );

  const columnListId = useMemo(
    () => columns.map((column) => column.id),
    [columns]
  );

  // Function to generate a random ID for board
  const generateId = () => {
    return uuidv4();
  };

  // Function to create a new Column
  const handleAddColumn = () => {
    const newColumn: Column = {
      id: generateId(),
      title: `Untitled Board ${columns.length + 1}`,
      todos: [],
    };
    dispatch(addColumn(newColumn));
    showToast("a new column have been added");
  };

  //Function o distinguish normal click (for delete/edit) and drag
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3, //drag event will start after moving the board 3px
      },
    })
  );

  // Function to track active column when drag event is started
  const onDragStart = (event: DragStartEvent) => {
    const data = event.active.data.current;

    if (data?.type === "Board") {
      dispatch(setActiveBoard(data.column)); // Set only the board when dragging a board
    } else if (data?.type === "Task") {
      dispatch(setActiveTask(data.todo)); // Set only the task when dragging a task
    }
  };

  const onDragOver = (event: DragOverEvent) => {
    const { active, over } = event;

    // if no valid drop target, return
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    if (activeId === overId) return;

    const isActiveTask = active.data.current?.type === "Task";
    const isOverTask = over.data.current?.type === "Task";

    const isOverBoard = over.data.current?.type === "Board";

    if (!isActiveTask) return;

    const activeColumnId = active.data.current?.todo?.columnId;

    // If dropping onto another task, get the column of that task
    let overColumnId = over.data.current?.todo?.columnId;

    // If dropping onto an empty board, get the column's ID
    if (isOverBoard) {
      overColumnId = over.data.current?.column?.id;
    }

    if (!activeColumnId || !overColumnId) return;

    if (isActiveTask && isOverTask && activeColumnId === overColumnId) {
      // Move task within the same column
      dispatch(
        moveTaskWithinColumn({
          columnId: activeColumnId,
          taskId: activeId,
          destinationTaskId: overId,
        })
      );
    }

    if (isActiveTask && activeColumnId !== overColumnId) {
      // Move task to another column
      dispatch(
        moveTaskToAnotherColumn({
          activeColumnId,
          overColumnId,
          taskId: activeId,
          destinationTaskId: overId,
        })
      );
    }
  };

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    dispatch(setActiveTask(null)); // Ensure no task is selected
    dispatch(setActiveBoard(null)); // Ensure no board is selected

    // If no valid drop target, return
    if (!over) return;

    const activeColumnId = active.id as string;
    const overColumnId = over.id as string;

    if (activeColumnId === overColumnId) return;

    const activeColumnIndex = columns.findIndex(
      (col) => col.id === activeColumnId
    );
    const overColumnIndex = columns.findIndex((col) => col.id === overColumnId);

    dispatch(reorderColumns({ activeColumnIndex, overColumnIndex }));
  };

  useEffect(() => {
    localStorage.setItem("columns", JSON.stringify(columns));
  }, [columns]);

  return (
    <div className=" pt-20 flex min-h-screen w-full items-start pt-30 overflow-x-auto overflow-y-hidden px-[40px] ">
      {/* Draggable Columns */}
      <DndContext
        onDragStart={onDragStart}
        onDragOver={onDragOver}
        sensors={sensors}
        onDragEnd={onDragEnd}
      >
        <div className="  flex gap-4">
          <SortableContext items={columnListId}>
            {columns?.map((column) => (
              <ColumnLayout key={column.id} column={column} />
            ))}
          </SortableContext>

          <Button
            className="h-[60px] w-[250px] cursor-pointer rounded-lg  border-2 border-secondary p-4 ring-primary hover:ring-2 flex gap-2 font-bold "
            onClick={handleAddColumn}
          >
            <LuCirclePlus /> Add a New Board
          </Button>
        </div>

        {createPortal(
          <DragOverlay>
            {activeBoard && <ColumnLayout column={activeBoard} />}
            {activeTask && <TodoCard todo={activeTask} />}
          </DragOverlay>,
          document.body
        )}
      </DndContext>
    </div>
  );
};

export default KanbanLayout;
