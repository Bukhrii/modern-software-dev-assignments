import { CreateTaskForm } from "@/components/CreateTaskForm";
import { TaskBoard } from "@/components/TaskBoard";
import { SquareKanban } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="bg-card border-b border-border sticky top-0 z-20 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[72px] flex items-center gap-3">
          <div className="w-9 h-9 rounded-[10px] bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/25">
            <SquareKanban className="w-5 h-5" />
          </div>
          <h1 className="font-display font-extrabold text-[22px] text-foreground tracking-tight">
            TaskFlow
          </h1>
        </div>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="max-w-3xl mb-10">
          <h2 className="font-display text-3xl md:text-4xl font-extrabold text-foreground tracking-tight mb-3">
            Your Board
          </h2>
          <p className="text-muted-foreground text-lg">
            Manage your tasks, track your progress, and get things done.
          </p>
        </div>

        <div className="mb-12">
          <CreateTaskForm />
        </div>

        <div className="pb-20">
          <TaskBoard />
        </div>
      </main>
    </div>
  );
}
