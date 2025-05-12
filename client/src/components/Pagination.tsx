interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) => {
  const renderPageButtons = () => {
    const buttons = [];

    if (totalPages <= 20) {
      for (let i = 1; i <= totalPages; i++) {
        buttons.push(
          <button
            key={i}
            onClick={() => onPageChange(i)}
            className={`px-3 py-1 rounded transition text-sm ${
              i === currentPage
                ? "bg-primary text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {i}
          </button>
        );
      }
    } else {
      for (let i = 1; i <= 20; i++) {
        buttons.push(
          <button
            key={i}
            onClick={() => onPageChange(i)}
            className={`px-3 py-1 rounded transition text-sm ${
              i === currentPage
                ? "bg-primary text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {i}
          </button>
        );
      }

      buttons.push(
        <span key="dots" className="text-gray-500 px-2">
          ...
        </span>
      );

      buttons.push(
        <button
          key={totalPages}
          onClick={() => onPageChange(totalPages)}
          className={`px-3 py-1 rounded transition text-sm ${
            currentPage === totalPages
              ? "bg-primary text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          {totalPages}
        </button>
      );
    }

    return buttons;
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-8 flex-wrap">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1 bg-primary text-white rounded disabled:opacity-50 hover:bg-red-600 transition"
      >
        ← Prev
      </button>

      {renderPageButtons()}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1 bg-primary text-white rounded disabled:opacity-50 hover:bg-red-600 transition"
      >
        Next →
      </button>
    </div>
  );
};

export default Pagination;
