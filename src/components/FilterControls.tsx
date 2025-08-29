import { FilterControlsProps } from '@/lib/types';

function FilterControls({ searchTerm, onSearchChange, filter, onFilterChange }: FilterControlsProps) {
  const filterButtons = [
    { value: 'all', label: 'All' },
    { value: 'active', label: 'Active' },
    { value: 'completed', label: 'Completed' },
  ] as const;

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
      <input
        type="text"
        placeholder="Search by name..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full sm:w-1/2 px-3 py-2 border border-gray-400 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 transition"
      />
      <div className="flex space-x-2">
        {filterButtons.map(btn => (
          <button
            key={btn.value}
            onClick={() => onFilterChange(btn.value)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition ${
              filter === btn.value
                ? 'bg-blue-600 text-white shadow'
                : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500'
            }`}
          >
            {btn.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FilterControls;