import type { Task } from "@/types";

const DB_NAME = "task-management-db";
const DB_VERSION = 1;
const TASKS_STORE = "tasks";

export class DBService {
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => {
        reject(new Error("Failed to open database"));
      };

      request.onsuccess = (event) => {
        this.db = (event.target as IDBOpenDBRequest).result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        if (!db.objectStoreNames.contains(TASKS_STORE)) {
          const store = db.createObjectStore(TASKS_STORE, { keyPath: "id" });
          store.createIndex("status", "status", { unique: false });
          store.createIndex("dueDate", "dueDate", { unique: false });
        }
      };
    });
  }

  async getTasks(): Promise<Task[]> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([TASKS_STORE], "readonly");
      const store = transaction.objectStore(TASKS_STORE);
      const request = store.getAll();

      request.onsuccess = () => {
        resolve(request.result as Task[]);
      };

      request.onerror = () => {
        reject(new Error("Failed to get tasks"));
      };
    });
  }

  async addTask(task: Task): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([TASKS_STORE], "readwrite");
      const store = transaction.objectStore(TASKS_STORE);
      const request = store.add(task);

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = () => {
        reject(new Error("Failed to add task"));
      };
    });
  }

  async updateTask(task: Task): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([TASKS_STORE], "readwrite");
      const store = transaction.objectStore(TASKS_STORE);
      const request = store.put(task);

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = () => {
        reject(new Error("Failed to update task"));
      };
    });
  }

  async deleteTask(id: string): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([TASKS_STORE], "readwrite");
      const store = transaction.objectStore(TASKS_STORE);
      const request = store.delete(id);

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = () => {
        reject(new Error("Failed to delete task"));
      };
    });
  }
}

export const dbService = new DBService();
