import "./App.css";
import { TaskBoard } from "./components/TaskBoard/TaskBoard";
import { ThemeProvider } from "./components/ThemeProvider";
import { ThemeToggle } from "./components/ThemeToggle";

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="taskflow-theme">
      <main className="min-h-screen bg-background text-foreground">
        <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
          <header className="mb-8">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                Task Board
              </h1>
              <ThemeToggle />
            </div>
            <p className="mt-2 text-muted-foreground text-start">
              Manage your tasks with drag and drop functionality
            </p>
          </header>
          <TaskBoard />
        </div>
      </main>
    </ThemeProvider>
  );
}

export default App;
