import { useTheme, useTodos } from './hooks';
import {
  ThemeToggle,
  FilterControls,
  TodoForm,
  TodoList,
  TodoStats,
  Divider
} from '@/components';


function App() {
  const [theme, toggleTheme] = useTheme();
  const {
    filteredTodos,
    filter,
    searchTerm,
    activeCount,
    completedCount,
    error,
    addTodo,
    toggleComplete,
    deleteTodo,
    updateTodo,
    clearCompleted,
    setFilter,
    setSearchTerm,
  } = useTodos();

  return (
    <div className="bg-gray-300 dark:bg-gray-900 min-h-screen font-sans transition-colors duration-300">
      <div className="container mx-auto max-w-2xl p-4 sm:p-8">
        <header className="flex justify-between items-center my-8">
          <h1 className="text-5xl font-extrabold text-gray-800 dark:text-gray-200">Todo App</h1>
          <ThemeToggle theme={theme} onToggle={toggleTheme} />
        </header>
        <main className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-6">
          {error && (
            <div className="text-red-500 text-xs mt-[-.5rem] mb-[1.2rem] text-center" role="alert">
              {error}
            </div>
          )}
          <TodoForm onAddTodo={addTodo} />
          <FilterControls
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            filter={filter}
            onFilterChange={setFilter}
          />
          <Divider />
          <TodoList
            todos={filteredTodos}
            onToggleComplete={toggleComplete}
            onDeleteTodo={deleteTodo}
            onUpdateTodo={updateTodo}
          />
          <TodoStats 
            activeCount={activeCount}
            completedCount={completedCount}
            onClearCompleted={clearCompleted}
          />
        </main>
      </div>
    </div>
  )
};

export default App;
