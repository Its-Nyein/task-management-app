import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";
import { dbService } from "../lib/db";
import type { Task, TaskStore } from "@/types";

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],
  isLoading: true,
  error: null,

  fetchTasks: async () => {
    try {
      set({ isLoading: true, error: null });
      const tasks = await dbService.getTasks();
      set({ tasks, isLoading: false });
    } catch (error) {
      console.error("Error fetching tasks:", error);
      set({ error: "Failed to load tasks", isLoading: false });
    }
  },

  addTask: async (taskData) => {
    try {
      const newTask: Task = {
        id: uuidv4(),
        ...taskData,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      await dbService.addTask(newTask);
      set((state) => ({ tasks: [...state.tasks, newTask] }));
    } catch (error) {
      console.error("Error adding task:", error);
      set({ error: "Failed to add task" });
    }
  },

  updateTask: async (id, updates) => {
    try {
      const { tasks } = get();
      const taskIndex = tasks.findIndex((task) => task.id === id);

      if (taskIndex === -1) {
        throw new Error("Task not found");
      }

      const updatedTask: Task = {
        ...tasks[taskIndex],
        ...updates,
        updatedAt: Date.now(),
      };

      await dbService.updateTask(updatedTask);

      set((state) => ({
        tasks: state.tasks.map((task) => (task.id === id ? updatedTask : task)),
      }));
    } catch (error) {
      console.error("Error updating task:", error);
      set({ error: "Failed to update task" });
    }
  },

  deleteTask: async (id) => {
    try {
      await dbService.deleteTask(id);
      set((state) => ({
        tasks: state.tasks.filter((task) => task.id !== id),
      }));
    } catch (error) {
      console.error("Error deleting task:", error);
      set({ error: "Failed to delete task" });
    }
  },

  moveTask: async (taskId, destination) => {
    try {
      await get().updateTask(taskId, { status: destination });
    } catch (error) {
      console.error("Error moving task:", error);
      set({ error: "Failed to move task" });
    }
  },
}));
