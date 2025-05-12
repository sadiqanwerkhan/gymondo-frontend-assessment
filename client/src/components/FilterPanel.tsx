interface FiltersPanelProps {
  selectedCategories: string[];
  startDate: string;
  setSearchParams: (params: Record<string, string>) => void;
  allCategories: string[];
  months: string[];
}

const FiltersPanel = ({
  selectedCategories,
  startDate,
  setSearchParams,
  allCategories,
  months,
}: FiltersPanelProps) => {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className="block text-sm font-medium text-text mb-2">
          Filter by Category:
        </label>
        <div className="flex flex-wrap gap-2">
          {allCategories.map((cat) => (
            <label
              key={cat}
              className={`text-sm flex items-center gap-2 px-2 py-1 rounded border cursor-pointer transition ${
                selectedCategories.includes(cat)
                  ? "bg-red-50 border-red-500 text-red-600 font-medium"
                  : "bg-white border-gray-300 text-gray-700"
              }`}
            >
              <input
                type="checkbox"
                value={cat}
                checked={selectedCategories.includes(cat)}
                onChange={(e) => {
                  const value = e.target.value;
                  const updated = selectedCategories.includes(value)
                    ? selectedCategories.filter((c) => c !== value)
                    : [...selectedCategories, value];

                  const next = {
                    page: "1",
                    category: updated.join(","),
                    ...(startDate && startDate !== "all" && { startDate }),
                  };

                  setSearchParams(next);
                }}
                className="accent-red-500"
              />
              {cat}
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-text mb-2">
          Start Date (Month):
        </label>
        <select
          value={startDate}
          onChange={(e) => {
            const next = {
              page: "1",
              category: selectedCategories.join(","),
              startDate: e.target.value,
            };
            setSearchParams(next);
          }}
          className="border rounded px-3 py-2 w-full"
        >
          <option value="all">All</option>
          {months.map((m) => (
            <option key={m} value={m}>
              {new Date(m + "-01").toLocaleString("default", {
                month: "long",
                year: "numeric",
              })}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default FiltersPanel;
