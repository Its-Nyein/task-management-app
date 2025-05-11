import { PlusCircle } from "lucide-react";
import { Button } from "../ui/button";

interface TaskColumnProps {
  title: string;
  count: number;
}

export function TaskColumn({ title, count }: TaskColumnProps) {
  return (
    <div className="rounded-lg border bg-muted/20 shadow-sm">
      <div className="flex items-center justify-between p-4 border-b border-border/50">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-base">{title}</h3>
          <span className="text-sm text-muted-foreground">{count}</span>
        </div>
        <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full">
          <PlusCircle className="h-4 w-4" />
          <span className="sr-only">Add task to {title}</span>
        </Button>
      </div>

      <div className="flex flex-col gap-2 p-4">
        <div className="rounded-md border bg-background p-3 shadow-sm">
          <p className="text-sm font-medium">Sample Task 1</p>
        </div>
        <div className="rounded-md border bg-background p-3 shadow-sm">
          <p className="text-sm font-medium">Sample Task 2</p>
        </div>
        <div className="rounded-md border bg-background p-3 shadow-sm">
          <p className="text-sm font-medium">Sample Task 3</p>
        </div>
      </div>
    </div>
  );
}
