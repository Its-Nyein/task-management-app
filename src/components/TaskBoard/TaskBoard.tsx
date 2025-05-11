import { PlusCircle } from "lucide-react";
import { Button } from "../ui/button";
import { TaskColumn } from "./TaskColumn";
import { TaskDialog } from "../TaskCard/TaskDialog";
import { useState } from "react";

export function TaskBoard() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleAddTask = () => {
    setIsDialogOpen(true);
  };
  return (
    <div className="p-4">
      <Button className="mb-4" onClick={() => handleAddTask()}>
        <PlusCircle className="mr-2 h-4 w-4" />
        <span>Add New Task</span>
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <TaskColumn title="To Do" count={3} />
        <TaskColumn title="In Progress" count={2} />
        <TaskColumn title="Done" count={5} />
      </div>

      {isDialogOpen && (
        <TaskDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
      )}
    </div>
  );
}
