import TodoItem from './TodoItem';
import { TodoListProps } from '@/lib/types';

function TodoList({ todos, onToggleComplete, onDeleteTodo, onUpdateTodo }: TodoListProps) {
  if (todos.length === 0) {
    return <p className="text-center text-gray-500 dark:text-gray-400 py-4">No todos found...</p>;
  }

  return (
    <ul className="space-y-3">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggleComplete={onToggleComplete}
          onDeleteTodo={onDeleteTodo}
          onUpdateTodo={onUpdateTodo}
        />
      ))}
    </ul>
  );
}

export default TodoList;