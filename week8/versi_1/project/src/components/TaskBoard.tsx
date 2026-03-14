import { TaskCard } from './TaskCard';
import type { Task } from '../lib/database.types';

interface TaskBoardProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onStatusChange: (taskId: string, newStatus: Task['status']) => void;
}

const columns = [
  { id: 'to-do' as const, label: 'To Do', color: 'border-gray-300' },
  { id: 'in-progress' as const, label: 'In Progress', color: 'border-blue-300' },
  { id: 'done' as const, label: 'Done', color: 'border-green-300' },
];

export function TaskBoard({ tasks, onEdit, onDelete, onStatusChange }: TaskBoardProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {columns.map((column) => {
        const columnTasks = tasks.filter((task) => task.status === column.id);

        return (
          <div key={column.id} className="flex flex-col">
            <div className={`border-t-4 ${column.color} bg-gray-50 rounded-t-lg px-4 py-3`}>
              <h2 className="font-bold text-gray-900 text-lg">
                {column.label}
                <span className="ml-2 text-sm font-normal text-gray-500">
                  ({columnTasks.length})
                </span>
              </h2>
            </div>

            <div className="flex-1 bg-gray-50 rounded-b-lg p-4 space-y-3 min-h-[200px]">
              {columnTasks.length === 0 ? (
                <p className="text-center text-gray-400 text-sm py-8">No tasks</p>
              ) : (
                columnTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onStatusChange={onStatusChange}
                  />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
