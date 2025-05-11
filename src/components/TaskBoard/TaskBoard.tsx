import { useState, useEffect } from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { TaskColumn } from "./TaskColumn";
import { useTaskStore } from "../../hooks/useTaskStore";
import { TaskCard } from "../TaskCard/TaskCard";
import { TaskDialog } from "../TaskCard/TaskDialog";
import { Button } from "../ui/button";
import { PlusCircle } from "lucide-react";
import type { Column, Task, TaskStatus } from "@/types";

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

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const activeData = active.data.current;

    if (activeData?.type === "task") {
      setActiveTask(activeData.task);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      setActiveTask(null);
      return;
    }

    if (over.id !== active.data.current?.task.status) {
      const newStatus = over.id as TaskStatus;
      await moveTask(active.id as string, newStatus);
    }

    setActiveTask(null);
  };

  const handleAddTask = (status: TaskStatus) => {
    setDialogStatus(status);
    setIsDialogOpen(true);
  };

  const getTasksByStatus = (status: TaskStatus) => {
    return tasks.filter((task) => task.status === status);
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
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {columns.map((column) => (
            <TaskColumn
              key={column.id}
              column={column}
              tasks={getTasksByStatus(column.id)}
              onAddTask={handleAddTask}
            />
          ))}
        </div>

        <DragOverlay>
          {activeTask && <TaskCard task={activeTask} />}
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
