import React from 'react';
import { useTodos } from '@/hooks/useTodos';

function TodoDateFilter() {
  const { dateFilter, setDateFilter } = useTodos();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateValue = e.target.value;
    if (dateValue) {
      // Create the date at midnight in the user's local timezone
      const localDate = new Date(`${dateValue}T00:00:00`);
      setDateFilter(localDate);
    } else {
      setDateFilter(null);
    }
  };

  return (
    <div className="flex items-center">
      <label htmlFor="date-filter" className="mr-2 text-sm text-gray-500 dark:text-gray-400">
        Filter by Date:
      </label>
      <input
        id="date-filter"
        type="date"
        value={dateFilter ? dateFilter.toISOString().split('T')[0] : ''}
        onChange={handleChange}
        className="border rounded px-2 py-1 bg-gray-100 dark:bg-gray-600 dark:border-gray-500 text-gray-800 dark:text-gray-200"
      />
      {dateFilter && (
        <button
          type="button"
          onClick={() => setDateFilter(null)}
          className="ml-2 text-red-500 hover:text-red-700 font-bold"
          aria-label="Clear date filter"
        >
          &times;
        </button>
      )}
    </div>
  );
}

export default TodoDateFilter;