import { useState, useEffect } from 'react';
import { Plus, ListTodo, AlertCircle } from 'lucide-react';
import { TaskBoard } from './components/TaskBoard';
import { TaskForm } from './components/TaskForm';
import { supabase } from './lib/supabase';
import type { Task } from './lib/database.types';

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      setTasks(data || []);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError('Failed to load tasks. Please refresh the page.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTask = async (taskData: { title: string; description: string; status: Task['status'] }) => {
    try {
      setFormLoading(true);

      const { data, error: insertError } = await supabase
        .from('tasks')
        .insert([taskData])
        .select()
        .single();

      if (insertError) throw insertError;

      setTasks((prev) => [data, ...prev]);
      setShowForm(false);
    } catch (err) {
      console.error('Error creating task:', err);
      throw new Error('Failed to create task. Please try again.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdateTask = async (taskData: { title: string; description: string; status: Task['status'] }) => {
    if (!editingTask) return;

    try {
      setFormLoading(true);

      const { data, error: updateError } = await supabase
        .from('tasks')
        .update({ ...taskData, updated_at: new Date().toISOString() })
        .eq('id', editingTask.id)
        .select()
        .single();

      if (updateError) throw updateError;

      setTasks((prev) =>
        prev.map((task) => (task.id === editingTask.id ? data : task))
      );
      setEditingTask(null);
      setShowForm(false);
    } catch (err) {
      console.error('Error updating task:', err);
      throw new Error('Failed to update task. Please try again.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleStatusChange = async (taskId: string, newStatus: Task['status']) => {
    try {
      const { data, error: updateError } = await supabase
        .from('tasks')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', taskId)
        .select()
        .single();

      if (updateError) throw updateError;

      setTasks((prev) =>
        prev.map((task) => (task.id === taskId ? data : task))
      );
    } catch (err) {
      console.error('Error updating task status:', err);
      setError('Failed to update task status. Please try again.');
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return;

    try {
      const { error: deleteError } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId);

      if (deleteError) throw deleteError;

      setTasks((prev) => prev.filter((task) => task.id !== taskId));
    } catch (err) {
      console.error('Error deleting task:', err);
      setError('Failed to delete task. Please try again.');
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleEditClick = (task: Task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingTask(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <ListTodo size={32} className="text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Shared Task Board</h1>
                <p className="text-gray-600">Collaborate on tasks with your team</p>
              </div>
            </div>

            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl font-medium"
            >
              <Plus size={20} />
              New Task
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700">
            <AlertCircle size={20} />
            <p>{error}</p>
          </div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <TaskBoard
            tasks={tasks}
            onEdit={handleEditClick}
            onDelete={handleDeleteTask}
            onStatusChange={handleStatusChange}
          />
        )}

        {showForm && (
          <TaskForm
            onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
            onCancel={handleCloseForm}
            initialData={editingTask || undefined}
            isLoading={formLoading}
          />
        )}
      </div>
    </div>
  );
}

export default App;
