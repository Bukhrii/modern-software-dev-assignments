import { TaskColumn } from "./TaskColumn";
import { useTasks } from "@/hooks/use-tasks";

export function TaskBoard() {
  const { data: tasks = [], isLoading, isError } = useTasks();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 xl:gap-8 items-start">
        {[1, 2, 3].map(i => (
          <div 
            key={i} 
            className="h-[600px] rounded-[1.5rem] bg-muted/40 animate-pulse border border-border/50" 
          />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-8 text-center bg-destructive/10 text-destructive rounded-2xl border border-destructive/20">
        <p className="font-semibold text-lg">Failed to load tasks</p>
        <p className="text-sm mt-1 opacity-80">Please check your connection and try again.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 xl:gap-8 items-stretch">
      <TaskColumn
        title="To Do"
        status="to-do"
        tasks={tasks.filter(t => t.status === "to-do")}
      />
      <TaskColumn
        title="In Progress"
        status="in-progress"
        tasks={tasks.filter(t => t.status === "in-progress")}
      />
      <TaskColumn
        title="Done"
        status="done"
        tasks={tasks.filter(t => t.status === "done")}
      />
    </div>
  );
}
