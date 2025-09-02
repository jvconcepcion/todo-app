import { useState, useEffect, useMemo } from 'react';
import { Todo } from '@/lib/types';

export function useTodos() {

  const [currentPage,setCurrentPage] = useState(1);
  const [dateFilter, setDateFilter] = useState<Date | null>(null);

  // State for todos, loading initial todos from localStorage
  const [todos, setTodos] = useState<Todo[]>(() => {
    const savedTodos = localStorage.getItem('todos');
    return savedTodos ? JSON.parse(savedTodos) : [];
  });
  // State for Undo delete
  const [todoToDelete, setTodoToDelete] = useState<Todo | null>(null);

  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);

  const todosPerPage = 5;
  const indexOfFirstTodo = (currentPage - 1) * todosPerPage;
  const indexOfLastTodo = indexOfFirstTodo + todosPerPage;

  // Save todos to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => setCurrentPage(1), [filter, searchTerm, dateFilter]);

  useEffect(() => {
    // Set a timer if there's a todo pending to be deleted
    if (todoToDelete) {
      const timer = setTimeout(() => {
        // After 5 seconds, delete the todo permanently
        setTodos(prevTodos => prevTodos.filter(t => t.id !== todoToDelete.id));
        setTodoToDelete(null);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [todoToDelete]);

  const isDuplicateTodo = (text: string, currentId?: string): boolean => {
    // Normalize the input text (case insensitive, trim whitespace)
    const normalizedText = text.trim().toLowerCase();
    return todos.some(todo =>
        todo.id !== currentId && // Don't compare a todo to itself when updating
        todo.text.trim().toLowerCase() === normalizedText
    );
  }; 

  const addTodo = (text: string) => {
    if (isDuplicateTodo(text)) {
      setError('This todo already exists.');
      return;
    }

    setError(null);
    const newTodo: Todo = {
      id: crypto.randomUUID(),
      text: text.trim(),
      completed: false,
      dateAdded: new Date().toISOString(),
      dateCompleted: null,
      dateModified: null,
    };
    setTodos((prevTodos) => [...prevTodos, newTodo]);
  };

  const toggleComplete = (id: string) => {
    setTodos(todos.map(todo =>
      todo.id === id
        ? {
          ...todo,
          completed: !todo.completed,
          dateCompleted: !todo.completed ? new Date().toISOString() : null,
          dateModified: new Date().toISOString(),
        }
        : todo
    ));
  };

  const deleteTodo = (id: string) => {
    const todo = todos.find(t => t.id === id);
    if (todo) {
      // Set the todo in the pending deletion state
      setTodoToDelete(todo);
    }
  };

  const undoDelete = () => {
    // Clear the pending state, which cancels the deletion
    setTodoToDelete(null);
  };

  const updateTodo = (id: string, newText: string) => {
    if (isDuplicateTodo(newText, id)) {
      setError('Another todo with this name already exists.');
      return false;
    }

    setError(null);
    setTodos(
      todos.map(todo =>
        todo.id === id
          ? {
            ...todo,
            text: newText.trim(),
            dateModified: new Date().toISOString(),
          }
          : todo
      )
    );
    return true;
  };

  const clearCompleted = () => {
    setTodos(todos.filter(todo => !todo.completed));
  };

  // Memoized calculation for filtering and searching todos
  // Search Functionality and Filter Functionality
  const filteredTodos = useMemo(() => {
    let result = todos;

    if (filter) {
      result = result.filter(todo => {
        if (filter === 'active') return !todo.completed;
        if (filter === 'completed') return todo.completed;
        return true;
      });
    }

    // Filter by search name
    if (searchTerm) {
      result = result.filter(todo =>
        todo.text.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (dateFilter) {
      result = result.filter(todo => {
        // YYYY-MM-DD
        const todoDate = new Date(todo.dateAdded);
        
        // Compare the year, month, and day in the local timezone
        return (
          todoDate.getFullYear() === dateFilter.getFullYear() &&
          todoDate.getMonth() === dateFilter.getMonth() &&
          todoDate.getDate() === dateFilter.getDate()
        );
      });
    }
    return result;
  }, [todos, filter, searchTerm, dateFilter]);

  const currentTodos = filteredTodos.slice(indexOfFirstTodo, indexOfLastTodo);

  const totalPages = Math.ceil(filteredTodos.length / todosPerPage)

  const nextPage = () => setCurrentPage((prev) => Math.min(prev + 1, todosPerPage));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  const activeCount = useMemo(() => todos.filter(t => !t.completed).length, [todos]);
  const completedCount = useMemo(() => todos.length - activeCount, [todos]);

  return {
    // State & Derived State
    dateFilter,
    filteredTodos,
    filter,
    searchTerm,
    activeCount,
    completedCount,
    error,
    // State Setters & Handlers
    setDateFilter,
    addTodo,
    toggleComplete,
    deleteTodo,
    undoDelete,
    todoToDelete,
    updateTodo,
    clearCompleted,
    setFilter,
    setSearchTerm,
    // Pagination
    currentTodos,
    currentPage,
    totalPages,
    nextPage,
    prevPage,
    setCurrentPage,
  };
};