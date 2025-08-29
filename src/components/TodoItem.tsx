import { useState, KeyboardEvent, useRef, useEffect } from 'react';
import { TodoItemProps } from '@/lib/types';
import { 
  FaEdit,
  FaTrash,
} from 'react-icons/fa';

function TodoItem({ todo, onToggleComplete, onDeleteTodo, onUpdateTodo }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const editInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      editInputRef.current?.focus();
    }
  }, [isEditing]);

  const handleUpdate = () => {
    if (editText.trim()) {
      onUpdateTodo(todo.id, editText.trim());
      setIsEditing(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleUpdate();
    } else if (e.key === 'Escape') {
      setEditText(todo.text);
      setIsEditing(false);
    }
  };

  return (
    <li className="flex items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg shadow-sm transition hover:shadow-md">
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggleComplete(todo.id)}
        className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
      />
      {isEditing ? (
        <input
          ref={editInputRef}
          type="text"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onBlur={handleUpdate}
          onKeyDown={handleKeyDown}
          className="flex-grow mx-3 px-2 py-1 border border-blue-300 rounded"
        />
      ) : (
        <span
          onDoubleClick={() => setIsEditing(true)}
          className={`flex-grow mx-3 cursor-pointer ${
              todo.completed 
                ? 'line-through text-gray-400 dark:text-gray-500' 
                : 'text-gray-800 dark:text-gray-200'
          }`}
        >
          {todo.text}
        </span>
      )}
      <div className="space-x-2 ml-auto">
        <button onClick={() => setIsEditing(true)} className="text-blue-500 hover:text-blue-700"><FaEdit /></button>
        <button onClick={() => onDeleteTodo(todo.id)} className="text-red-500 hover:text-red-700"><FaTrash /></button>
      </div>
    </li>
  );
}

export default TodoItem;