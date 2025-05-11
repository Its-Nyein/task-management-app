import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { TaskCard } from "../TaskCard/TaskCard";
import { PlusCircle } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "../../lib/utils";
import type { Column, Task } from "@/types";

interface TaskColumnProps {
  column: Column;
  tasks: Task[];
  onAddTask: (status: Column["id"]) => void;
  activeId: string | null;
  overId: string | null;
}

export function TaskColumn({ column, tasks, onAddTask, activeId, overId }: TaskColumnProps) {
  const { id, title } = column;
  const taskIds = tasks.map((task) => task.id);

  const { setNodeRef, isOver } = useDroppable({
    id: id,
    data: {
      type: "column",
      columnId: id,
    },
  });

  const isColumnOver = isOver || overId === id;

  const getColumnColor = () => {
    switch (id) {
      case "todo":
        return "border-blue-200 bg-blue-50/50 dark:border-blue-900 dark:bg-blue-950/20";
      case "in-progress":
        return "border-amber-200 bg-amber-50/50 dark:border-amber-900 dark:bg-amber-950/20";
      case "done":
        return "border-green-200 bg-green-50/50 dark:border-green-900 dark:bg-green-950/20";
      default:
        return "border-gray-200 bg-gray-50/50 dark:border-gray-900 dark:bg-gray-950/20";
    }
  };

  const getTaskCountStyles = () => {
    switch (id) {
      case "todo":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200";
      case "in-progress":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-200";
      case "done":
        return "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-200";
    }
  };

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex h-full w-full flex-col rounded-xl border-2 transition-colors duration-200",
        getColumnColor(),
        isColumnOver && "ring-2 ring-primary/50",
        activeId && !isColumnOver && "opacity-60"
      )}
    >
      <div className="flex items-center justify-between p-4 border-b border-border/50">
        <div className="flex items-center gap-3">
          <h3 className="font-semibold tracking-tight">{title}</h3>
          <div
            className={cn(
              "flex h-6 min-w-6 items-center justify-center rounded-full px-2 text-xs font-medium",
              getTaskCountStyles()
            )}
          >
            {tasks.length}
          </div>
        </div>
        <Button
          onClick={() => onAddTask(id)}
          size="icon"
          variant="ghost"
          className="h-8 w-8 rounded-full"
        >
          <PlusCircle className="h-4 w-4" />
          <span className="sr-only">Add task to {title}</span>
        </Button>
      </div>

      <div 
        className={cn(
          "flex-grow overflow-y-auto p-4 transition-colors duration-200",
          isColumnOver && "bg-primary/5"
        )}
        data-droppable="true"
      >
        <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
          {tasks.length > 0 ? (
            <div 
              className="flex flex-col gap-3 min-h-[100px]"
              data-column-id={id}
            >
              {tasks.map((task) => (
                <TaskCard 
                  key={task.id} 
                  task={task} 
                  isOver={overId === task.id}
                  isActive={activeId === task.id}
                />
              ))}
            </div>
          ) : (
            <div 
              className={cn(
                "flex h-24 items-center justify-center rounded-lg border-2 border-dashed border-border/50 p-4 text-sm text-muted-foreground transition-colors duration-200",
                isColumnOver && "bg-primary/10 border-primary/30"
              )}
              data-column-id={id}
            >
              Drop tasks here
            </div>
          )}
        </SortableContext>
      </div>
    </div>
  );
}