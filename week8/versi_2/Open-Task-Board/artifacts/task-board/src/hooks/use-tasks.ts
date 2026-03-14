import { useQueryClient } from "@tanstack/react-query";
import {
  useListTasks,
  useCreateTask as useGeneratedCreateTask,
  useUpdateTask as useGeneratedUpdateTask,
  useDeleteTask as useGeneratedDeleteTask,
  getListTasksQueryKey
} from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";

export function useTasks() {
  return useListTasks();
}

export function useCreateTask() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useGeneratedCreateTask({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListTasksQueryKey() });
        toast({ title: "Task created successfully" });
      },
      onError: (error: any) => {
        toast({ 
          title: "Failed to create task", 
          description: error?.message || "An unexpected error occurred",
          variant: "destructive" 
        });
      }
    }
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useGeneratedUpdateTask({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListTasksQueryKey() });
      },
      onError: (error: any) => {
        toast({ 
          title: "Failed to update task", 
          description: error?.message || "An unexpected error occurred",
          variant: "destructive" 
        });
      }
    }
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useGeneratedDeleteTask({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListTasksQueryKey() });
        toast({ title: "Task deleted successfully" });
      },
      onError: (error: any) => {
        toast({ 
          title: "Failed to delete task", 
          description: error?.message || "An unexpected error occurred",
          variant: "destructive" 
        });
      }
    }
  });
}
