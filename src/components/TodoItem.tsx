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
    };
  }, [isEditing]);

  const handleUpdate = () => {
    const trimmedText = editText.trim();

    // If text is empty, revert and exit
    if (!trimmedText) {
      setEditText(todo.text);
      setIsEditing(false);
      return;
    };

    // If text hasn't changed, just exit edit mode
    if (trimmedText === todo.text) {
      setIsEditing(false);
      return;
    };

    // Call onUpdateTodo and check if it was successful
    const success = onUpdateTodo(todo.id, trimmedText);

    // If it failed due to duplicate issue, revert the local text state
    if (!success) setEditText(todo.text);

    setIsEditing(false);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleUpdate();
    } else if (e.key === 'Escape') {
      setEditText(todo.text);
      setIsEditing(false);
    };
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
        <div className="flex-grow mx-3">
          {/* Title */}
          <span
            onDoubleClick={() => setIsEditing(true)}
            className={`cursor-pointer ${todo.completed
                ? 'line-through text-gray-400 dark:text-gray-500'
                : 'text-gray-800 dark:text-gray-200'
              }`}
          >
            {todo.text}
          </span>
          {/* Date Added, modified or  completed*/}
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {todo.dateCompleted
              ? `Completed: ${new Date(todo.dateCompleted).toLocaleString()}`
              : todo.dateModified
                ? `Modified: ${new Date(todo.dateModified).toLocaleString()}`
                : `Added: ${new Date(todo.dateAdded).toLocaleString()}`}
          </p>
        </div>
      )}
      <div className="space-x-2 ml-auto">
        <button onClick={() => setIsEditing(true)} className="text-blue-500 hover:text-blue-700"><FaEdit /></button>
        <button onClick={() => onDeleteTodo(todo.id)} className="text-red-500 hover:text-red-700"><FaTrash /></button>
      </div>
    </li>
  );
};

export default TodoItem;