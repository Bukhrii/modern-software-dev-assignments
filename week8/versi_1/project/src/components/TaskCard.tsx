import { CreditCard as Edit2, Trash2, ChevronRight } from 'lucide-react';
import type { Task } from '../lib/database.types';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onStatusChange: (taskId: string, newStatus: Task['status']) => void;
}

const statusColors = {
  'to-do': 'bg-gray-100 text-gray-700',
  'in-progress': 'bg-blue-100 text-blue-700',
  'done': 'bg-green-100 text-green-700',
};

const statusLabels = {
  'to-do': 'To Do',
  'in-progress': 'In Progress',
  'done': 'Done',
};

export function TaskCard({ task, onEdit, onDelete, onStatusChange }: TaskCardProps) {
  const getNextStatus = (currentStatus: Task['status']): Task['status'] | null => {
    if (currentStatus === 'to-do') return 'in-progress';
    if (currentStatus === 'in-progress') return 'done';
    return null;
  };

  const nextStatus = getNextStatus(task.status);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-semibold text-gray-900 flex-1 pr-2">{task.title}</h3>
        <div className="flex gap-1">
          <button
            onClick={() => onEdit(task)}
            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
            title="Edit task"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
            title="Delete task"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {task.description && (
        <p className="text-sm text-gray-600 mb-3 whitespace-pre-wrap">{task.description}</p>
      )}

      <div className="flex items-center justify-between gap-2">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[task.status]}`}>
          {statusLabels[task.status]}
        </span>

        {nextStatus && (
          <button
            onClick={() => onStatusChange(task.id, nextStatus)}
            className="flex items-center gap-1 text-xs text-gray-600 hover:text-blue-600 transition-colors"
            title={`Move to ${statusLabels[nextStatus]}`}
          >
            Move to {statusLabels[nextStatus]}
            <ChevronRight size={14} />
          </button>
        )}
      </div>

      <div className="mt-3 pt-3 border-t border-gray-100">
        <p className="text-xs text-gray-400">
          Created {new Date(task.created_at).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}
