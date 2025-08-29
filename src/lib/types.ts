export interface Todo {
  id: string;
  text: string;
  completed: boolean;
};

export interface ThemeToggleProps {
  theme: 'light' | 'dark';
  onToggle: () => void;
}

export type Theme = 'light' | 'dark';

export interface TodoFormProps {
  onAddTodo: (text: string) => void;
};

export interface FilterControlsProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  filter: 'all' | 'active' | 'completed';
  onFilterChange: (filter: 'all' | 'active' | 'completed') => void;
};

export interface TodoListProps {
  todos: Todo[];
  onToggleComplete: (id: string) => void;
  onDeleteTodo: (id: string) => void;
  onUpdateTodo: (id: string, newText: string) => boolean;
};

export interface TodoItemProps {
  todo: Todo;
  onToggleComplete: (id: string) => void;
  onDeleteTodo: (id: string) => void;
  onUpdateTodo: (id: string, newText: string) => boolean;
};

export interface TodoStatsProps {
  activeCount: number;
  completedCount: number;
  onClearCompleted: () => void;
};