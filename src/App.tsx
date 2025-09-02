import { useTheme, useTodos } from './hooks';
import {
  ThemeToggle,
  FilterControls,
  TodoForm,
  TodoList,
  TodoStats,
  Divider,
  TodoDateFilter,
} from '@/components';


function App() {
  const [theme, toggleTheme] = useTheme();
  const {
    filter,
    dateFilter,
    searchTerm,
    activeCount,
    completedCount,
    error,
    addTodo,
    toggleComplete,
    deleteTodo,
    undoDelete,
    todoToDelete,
    updateTodo,
    clearCompleted,
    setFilter,
    setSearchTerm,
    setDateFilter,
    currentTodos,
    currentPage,
    totalPages,
    nextPage,
    prevPage,
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
            dateFilter={dateFilter}
            setDateFilter={setDateFilter}
          />
          <Divider />
          <TodoList
            todos={currentTodos}
            onToggleComplete={toggleComplete}
            onDeleteTodo={deleteTodo}
            onUpdateTodo={updateTodo}
          />
          <TodoStats
            activeCount={activeCount}
            completedCount={completedCount}
            onClearCompleted={clearCompleted}
          />
          <div className='flex justify-center items-center mt-4 gap-2'>
            <button onClick={prevPage} disabled={currentPage === 1} className='text-xs'>
              Previous
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button onClick={nextPage} disabled={currentPage === totalPages} className='text-xs'>
              Next
            </button>
          </div>
        </main>
      </div>

      {/* Undo Delete Notification */}
      {todoToDelete && (
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 bg-gray-800 text-white py-3 px-5 rounded-lg shadow-lg flex items-center justify-between animate-fade-in-up">
          <span className="mr-4">
            Todo "{todoToDelete.text}" deleted.
          </span>
          <button
            onClick={undoDelete}
            className="font-bold text-blue-400 hover:text-blue-300 transition-colors"
          >
            Undo
          </button>
        </div>
      )}
    </div>
  )
};

export default App;
