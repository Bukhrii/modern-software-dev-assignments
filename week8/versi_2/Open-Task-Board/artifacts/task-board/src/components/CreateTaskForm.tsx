import { useState } from "react";
import { useCreateTask } from "@/hooks/use-tasks";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";

export function CreateTaskForm() {
  const createTask = useCreateTask();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    createTask.mutate({
      data: { title, description, status: "to-do" }
    }, {
      onSuccess: () => {
        setTitle("");
        setDescription("");
        setIsExpanded(false);
      }
    });
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="bg-card rounded-2xl p-5 shadow-sm border border-border transition-all duration-300 hover:shadow-md hover:border-border/80 focus-within:ring-4 focus-within:ring-primary/10 focus-within:border-primary/30"
    >
      <div className="flex flex-col gap-3">
         <input
           value={title}
           onChange={(e) => {
             setTitle(e.target.value);
             if (e.target.value.length > 0) setIsExpanded(true);
           }}
           onFocus={() => setIsExpanded(true)}
           placeholder="What needs to be done?"
           className="w-full bg-transparent text-lg font-medium outline-none placeholder:text-muted-foreground"
         />
         
         {isExpanded && (
           <motion.div 
             initial={{ height: 0, opacity: 0 }} 
             animate={{ height: 'auto', opacity: 1 }} 
             className="flex flex-col gap-4 overflow-hidden"
           >
             <textarea
               value={description}
               onChange={e => setDescription(e.target.value)}
               placeholder="Add a description... (optional)"
               className="w-full bg-transparent text-sm resize-none outline-none placeholder:text-muted-foreground/60 min-h-[60px]"
             />
             <div className="flex justify-end gap-2 pt-2 border-t border-border/40">
               <button
                 type="button"
                 onClick={() => { 
                   setIsExpanded(false); 
                   setTitle(""); 
                   setDescription(""); 
                 }}
                 className="px-4 py-2 rounded-xl text-sm font-semibold text-muted-foreground hover:bg-muted transition-colors"
               >
                 Cancel
               </button>
               <button
                 type="submit"
                 disabled={createTask.isPending || !title.trim()}
                 className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2 rounded-xl text-sm font-semibold shadow-lg shadow-primary/20 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/30 transition-all active:translate-y-0 active:shadow-md disabled:opacity-50 disabled:transform-none disabled:shadow-none"
               >
                 <Plus className="w-4 h-4" />
                 {createTask.isPending ? "Adding..." : "Add Task"}
               </button>
             </div>
           </motion.div>
         )}
      </div>
    </form>
  );
}
