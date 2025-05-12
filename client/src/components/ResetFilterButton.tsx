interface ResetFiltersButtonProps {
  showReset: boolean;
  onReset: () => void;
}

const ResetFiltersButton = ({
  showReset,
  onReset,
}: ResetFiltersButtonProps) => {
  if (!showReset) return null;

  return (
    <div className="mb-2">
      <button
        onClick={onReset}
        className="inline-block px-4 py-1.5 bg-red-100 text-sm text-red-600 rounded hover:bg-red-200 transition"
      >
        Reset Filters
      </button>
    </div>
  );
};

export default ResetFiltersButton;
