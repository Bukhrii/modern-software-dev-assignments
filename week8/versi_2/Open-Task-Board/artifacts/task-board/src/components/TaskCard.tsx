import { useState } from "react";
import { motion } from "framer-motion";
import { Edit2, Trash2, ChevronDown, AlertTriangle } from "lucide-react";
import { useUpdateTask, useDeleteTask } from "@/hooks/use-tasks";
import { type Task, type TaskStatus } from "@workspace/api-client-react";
import { cn } from "@/lib/utils";

const StatusColors: Record<TaskStatus, string> = {
  'to-do': 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200 focus:ring-slate-200',
  'in-progress': 'bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200 focus:ring-blue-200',
  'done': 'bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-200 focus:ring-emerald-200',
};

export function TaskCard({ task }: { task: Task }) {
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();
  
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDesc, setEditDesc] = useState(task.description || '');

  const handleSave = () => {
    if (!editTitle.trim()) return;
    updateTask.mutate({
      taskId: task.id,
      data: { title: editTitle, description: editDesc }
    }, {
      onSuccess: () => setIsEditing(false)
    });
  };

  if (isDeleting) {
    return (
      <motion.div 
        layout 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-red-50 border border-red-100 rounded-2xl p-5 flex flex-col items-center justify-center text-center gap-3 shadow-sm"
      >
         <AlertTriangle className="w-6 h-6 text-red-500 mb-1" />
         <p className="text-sm font-semibold text-red-900 leading-snug">Delete "{task.title}"?</p>
         <div className="flex gap-2 w-full mt-2">
           <button 
             onClick={() => setIsDeleting(false)} 
             className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 transition-colors"
           >
             Cancel
           </button>
           <button 
             onClick={() => deleteTask.mutate({ taskId: task.id })} 
             disabled={deleteTask.isPending} 
             className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-red-600 text-white shadow-sm shadow-red-600/20 hover:bg-red-700 transition-colors disabled:opacity-50"
           >
             {deleteTask.isPending ? "Deleting..." : "Delete"}
           </button>
         </div>
      </motion.div>
    );
  }

  if (isEditing) {
    return (
      <motion.div 
        layout 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-card border-2 border-primary/40 rounded-2xl p-4 shadow-md focus-within:border-primary transition-colors"
      >
        <input
          value={editTitle}
          onChange={e => setEditTitle(e.target.value)}
          className="w-full text-sm font-bold text-foreground bg-transparent outline-none mb-2 placeholder:text-muted-foreground"
          placeholder="Task title"
          autoFocus
        />
        <textarea
          value={editDesc}
          onChange={e => setEditDesc(e.target.value)}
          className="w-full text-xs text-muted-foreground bg-transparent outline-none resize-none min-h-[60px] placeholder:text-muted-foreground/50"
          placeholder="Add description..."
        />
        <div className="flex justify-end gap-2 mt-3 pt-3 border-t border-border/50">
          <button 
            onClick={() => {
              setIsEditing(false);
              setEditTitle(task.title);
              setEditDesc(task.description || '');
            }} 
            className="px-3 py-1.5 rounded-lg text-xs font-bold text-muted-foreground hover:bg-muted transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={updateTask.isPending || !editTitle.trim()}
            className="px-4 py-1.5 rounded-lg text-xs font-bold bg-primary text-primary-foreground shadow-sm hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:transform-none"
          >
            {updateTask.isPending ? "Saving..." : "Save"}
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="bg-card border border-border shadow-[0_2px_8px_-4px_rgba(0,0,0,0.04)] rounded-2xl p-4 group hover:shadow-[0_8px_16px_-6px_rgba(0,0,0,0.08)] hover:border-border/80 transition-all duration-300 flex flex-col"
    >
      <div className="flex items-start justify-between gap-3 mb-2">
         <h4 className="font-display text-[15px] font-semibold text-foreground leading-tight">
           {task.title}
         </h4>
         <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
           <button 
             onClick={() => setIsEditing(true)} 
             className="p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
             aria-label="Edit task"
           >
             <Edit2 className="w-3.5 h-3.5" />
           </button>
           <button 
             onClick={() => setIsDeleting(true)} 
             className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
             aria-label="Delete task"
           >
             <Trash2 className="w-3.5 h-3.5" />
           </button>
         </div>
      </div>

      {task.description && (
        <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-3">
          {task.description}
        </p>
      )}

      <div className="mt-auto pt-4 border-t border-border/40 flex items-center justify-between">
        <div className="relative">
          <select
            value={task.status}
            onChange={(e) => updateTask.mutate({ taskId: task.id, data: { status: e.target.value as TaskStatus } })}
            className={cn(
              "appearance-none pl-3 pr-7 py-1.5 rounded-lg text-[11px] font-bold border transition-colors cursor-pointer outline-none focus:ring-2",
              StatusColors[task.status]
            )}
            aria-label="Change status"
          >
            <option value="to-do">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
          </select>
          <ChevronDown className="w-3 h-3 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none opacity-60" />
        </div>
      </div>
    </motion.div>
  );
}
