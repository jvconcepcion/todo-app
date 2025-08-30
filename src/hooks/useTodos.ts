import { useState, useEffect, useMemo } from 'react';
import { Todo } from '@/lib/types';

export function useTodos() {
  // State for todos, loading initial todos from localStorage
  const [todos, setTodos] = useState<Todo[]>(() => {
    const savedTodos = localStorage.getItem('todos');
    return savedTodos ? JSON.parse(savedTodos) : [];
  });

  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);

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
    setTodos(todos.filter(todo => todo.id !== id));
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
    // This ensures search and filter work together
    return todos
      .filter(todo => { // Filter by status (All, Active, Completed)
        if (filter === 'active') return !todo.completed;
        if (filter === 'completed') return todo.completed;
        return true;
      })
      .filter(todo => // Filter by search name
        todo.text.toLowerCase().includes(searchTerm.toLowerCase())
      );
  }, [todos, filter, searchTerm]);

  const activeCount = useMemo(() => todos.filter(t => !t.completed).length, [todos]);
  const completedCount = useMemo(() => todos.length - activeCount, [todos]);

  return {
    // State & Derived State
    filteredTodos,
    filter,
    searchTerm,
    activeCount,
    completedCount,
    error,
    // State Setters & Handlers
    addTodo,
    toggleComplete,
    deleteTodo,
    updateTodo,
    clearCompleted,
    setFilter,
    setSearchTerm,
  };
};