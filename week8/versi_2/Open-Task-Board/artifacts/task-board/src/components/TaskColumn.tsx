import { type Task } from "@workspace/api-client-react";
import { TaskCard } from "./TaskCard";
import { AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export function TaskColumn({ 
  title, 
  status, 
  tasks 
}: { 
  title: string, 
  status: 'to-do' | 'in-progress' | 'done', 
  tasks: Task[] 
}) {
  
  const statusStyles = {
    'to-do': 'bg-slate-100/60 border-slate-200/60',
    'in-progress': 'bg-blue-50/60 border-blue-200/50',
    'done': 'bg-emerald-50/60 border-emerald-200/50',
  }[status];

  const badgeStyles = {
    'to-do': 'bg-slate-200 text-slate-700',
    'in-progress': 'bg-blue-200 text-blue-800',
    'done': 'bg-emerald-200 text-emerald-800',
  }[status];

  const emptyStateStyles = {
    'to-do': 'border-slate-200 text-slate-400 bg-slate-100/50',
    'in-progress': 'border-blue-200 text-blue-400 bg-blue-50/50',
    'done': 'border-emerald-200 text-emerald-400 bg-emerald-50/50',
  }[status];

  return (
    <div className={cn("flex flex-col rounded-[1.5rem] border p-4 xl:p-5 h-full", statusStyles)}>
      <div className="flex items-center justify-between mb-5 px-1">
        <h3 className="font-display font-bold text-base tracking-tight text-foreground">
          {title}
        </h3>
        <span className={cn("text-xs font-bold px-2.5 py-1 rounded-full", badgeStyles)}>
          {tasks.length}
        </span>
      </div>

      <div className="flex flex-col gap-3 flex-1 min-h-[200px]">
        <AnimatePresence>
          {tasks.map(task => (
            <TaskCard key={task.id} task={task} />
          ))}
        </AnimatePresence>
        
        {tasks.length === 0 && (
          <div className={cn(
            "flex-1 flex items-center justify-center border-2 border-dashed rounded-2xl py-8 mt-2 transition-colors",
            emptyStateStyles
          )}>
            <span className="text-sm font-semibold">No tasks</span>
          </div>
        )}
      </div>
    </div>
  );
}
