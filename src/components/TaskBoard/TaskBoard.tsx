import { useState, useEffect } from "react";
import {
  DndContext,
  DragOverlay,
  pointerWithin,
  rectIntersection,
  type DragEndEvent,
  type DragStartEvent,
  type DragOverEvent,
} from "@dnd-kit/core";
import { TaskColumn } from "./TaskColumn";
import { useTaskStore } from "../../hooks/useTaskStore";
import { TaskCard } from "../TaskCard/TaskCard";
import { TaskDialog } from "../TaskCard/TaskDialog";
import { Button } from "../ui/button";
import { PlusCircle } from "lucide-react";
import type { Column, Task, TaskStatus } from "@/types";
import type { CollisionDetection } from "@dnd-kit/core";

const columns: Column[] = [
  { id: "todo", title: "To Do", color: "blue" },
  { id: "in-progress", title: "In Progress", color: "amber" },
  { id: "done", title: "Done", color: "green" },
];

export function TaskBoard() {
  const { tasks, fetchTasks, moveTask } = useTaskStore();
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogStatus, setDialogStatus] = useState<TaskStatus>("todo");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const activeData = active.data.current;
    setActiveId(active.id as string);

    if (activeData?.type === "task") {
      setActiveTask(activeData.task);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { over } = event;
    setOverId(over?.id as string ?? null);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    
    const taskData = active.data.current?.task;
    setActiveTask(null);
    setActiveId(null);
    setOverId(null);

    if (!over || !taskData) {
      return;
    }

    const overData = over.data.current;
    const targetColumnId = overData?.type === "column" 
      ? overData.columnId 
      : overData?.columnId;
    
    if (!targetColumnId) {
      return;
    }

    const currentStatus = taskData.status;
    const targetStatus = targetColumnId as TaskStatus;
    
    if (columns.some(col => col.id === targetStatus) && targetStatus !== currentStatus) {
      await moveTask(active.id as string, targetStatus);
    }
  };

  const handleAddTask = (status: TaskStatus) => {
    setDialogStatus(status);
    setIsDialogOpen(true);
  };

  const getTasksByStatus = (status: TaskStatus) => {
    return tasks.filter((task) => task.status === status);
  };

  const collisionDetectionStrategy: CollisionDetection = (args) => {
    const pointerCollisions = pointerWithin(args);
    if (pointerCollisions.length > 0) {
      return pointerCollisions;
    }
  
    const rectCollisions = rectIntersection(args);
    return rectCollisions;
  };

  return (
    <div className="flex flex-col gap-6">
      <Button
        onClick={() => handleAddTask("todo")}
        className="w-full sm:w-auto gap-2"
      >
        <PlusCircle className="h-4 w-4" />
        <span>Add New Task</span>
      </Button>

      <DndContext
        collisionDetection={collisionDetectionStrategy}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {columns.map((column) => (
            <TaskColumn
              key={column.id}
              column={column}
              tasks={getTasksByStatus(column.id)}
              onAddTask={handleAddTask}
              activeId={activeId}
              overId={overId}
            />
          ))}
        </div>

        <DragOverlay>
          {activeTask && <TaskCard task={activeTask} isDragging />}
        </DragOverlay>
      </DndContext>

      <TaskDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        defaultStatus={dialogStatus}
      />
    </div>
  );
}