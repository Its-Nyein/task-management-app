import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Calendar, Grip, Pencil, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { Badge } from "../ui/badge";
import { cn } from "../../lib/utils";
import { useState } from "react";
import { TaskDialog } from "./TaskDialog";
import { format } from "date-fns";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import type { Task } from "@/types";
import { useTaskStore } from "../../hooks/useTaskStore";

interface TaskCardProps {
  task: Task;
}

export function TaskCard({ task }: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: "task",
      task,
    },
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { deleteTask } = useTaskStore();

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleDelete = async () => {
    await deleteTask(task.id);
    setIsDeleting(false);
  };

  const getStatusColor = () => {
    switch (task.status) {
      case "todo":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "in-progress":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200";
      case "done":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const statusLabel =
    task.status === "todo"
      ? "To Do"
      : task.status === "in-progress"
      ? "In Progress"
      : "Done";

  return (
    <>
      <Card
        ref={setNodeRef}
        style={style}
        className={cn(
          "border shadow-sm transition-all",
          isDragging && "opacity-50 shadow-md rotate-3 z-10 cursor-grabbing"
        )}
      >
        <CardContent className="p-3">
          <div className="mb-2 flex items-center justify-between">
            <h4 className="font-medium line-clamp-1">{task.title}</h4>
            <div
              {...attributes}
              {...listeners}
              className="cursor-grab touch-none"
            >
              <Grip className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>

          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
            {task.description || "No description"}
          </p>

          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className={cn("text-xs", getStatusColor())}
            >
              {statusLabel}
            </Badge>

            {task.dueDate && (
              <div className="flex items-center text-xs text-muted-foreground">
                <Calendar className="mr-1 h-3 w-3" />
                {format(new Date(task.dueDate), "MMM d, yyyy")}
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="px-3 py-2 border-t bg-muted/20 flex justify-end gap-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => setIsEditing(true)}
                >
                  <Pencil className="h-3.5 w-3.5" />
                  <span className="sr-only">Edit</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Edit task</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-destructive hover:text-destructive"
                  onClick={() => setIsDeleting(true)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span className="sr-only">Delete</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Delete task</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardFooter>
      </Card>

      <TaskDialog task={task} open={isEditing} onOpenChange={setIsEditing} />

      <AlertDialog open={isDeleting} onOpenChange={setIsDeleting}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete task</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{task.title}"? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
