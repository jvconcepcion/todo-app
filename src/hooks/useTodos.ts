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


  const addTodo = (text: string) => {
    // Normalize the input text (case insensitive, trim whitespace)
    const normalizedText = text.trim().toLowerCase();

    // Check for duplicate todo
    const isDuplicate = todos.some(todo => todo.text.trim().toLowerCase() === normalizedText);

    if (isDuplicate) {
      setError('Todo already exists!');
      return;
    }

    // If it's a new todo, clear any previous error and add it
    setError(null);
    const newTodo: Todo = { 
      id: crypto.randomUUID(), 
      text: text.trim(), 
      completed: false 
    };
    setTodos(prevTodos => [...prevTodos, newTodo]);
  };

  const toggleComplete = (id: string) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const updateTodo = (id: string, newText: string) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, text: newText } : todo
    ));
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