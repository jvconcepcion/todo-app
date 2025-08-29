import { TodoStatsProps } from '@/lib/types';

function TodoStats({ activeCount, completedCount, onClearCompleted }: TodoStatsProps) {
  return (
    <div className="mt-6 flex justify-between items-center text-gray-600 text-sm">
      <span>
        {activeCount} item{activeCount !== 1 ? 's' : ''} left
      </span>
      {completedCount > 0 && (
        <button
          onClick={onClearCompleted}
          className="hover:text-red-600 transition"
        >
          Clear completed
        </button>
      )}
    </div>
  );
};

export default TodoStats;