import { useEffect, useRef, useState } from "react";
import api from "../api/axios";
import { Link, useSearchParams } from "react-router-dom";
import type { Workout } from "../types/workout";
import { getNext12Months } from "../utils/date";

const WorkoutList = () => {
  const [totalPages, setTotalPages] = useState(1);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  const page = parseInt(searchParams.get("page") || "1");
  const selectedCategories = (searchParams.get("category") || "")
    .split(",")
    .filter(Boolean);
  const startDate = searchParams.get("startDate") || "";

  const allCategories = ["c1", "c2", "c3", "c4", "c5", "c6", "c7"];
  const months = getNext12Months();

  const initialized = useRef(false);
  useEffect(() => {
    if (!startDate && !initialized.current) {
      const now = new Date();
      const defaultMonth = `${now.getFullYear()}-${String(
        now.getMonth() + 1
      ).padStart(2, "0")}`;
      setSearchParams({
        page: "1",
        category: selectedCategories.join(","),
        startDate: defaultMonth,
      });
      initialized.current = true;
    }
  }, [startDate, selectedCategories, setSearchParams]);

  useEffect(() => {
    setLoading(true);

    const query = new URLSearchParams(searchParams);
    const page = parseInt(query.get("page") || "1");
    const selectedCategories = (query.get("category") || "")
      .split(",")
      .filter(Boolean);
    const startDate = query.get("startDate") || "";

    const apiParams = new URLSearchParams();
    apiParams.set("page", page.toString());
    if (selectedCategories.length > 0) {
      apiParams.set("category", selectedCategories.join(","));
    }
    if (startDate) {
      apiParams.set("startDate", startDate);
    }

    api
      .get(`/workouts?${apiParams.toString()}`)
      .then((res) => {
        setWorkouts(res.data.workouts);
        setTotalPages(Math.ceil(res.data.total / res.data.pageSize));
      })
      .catch((err) => {
        console.error("Failed to fetch workouts:", err);
      })
      .finally(() => setLoading(false));
  }, [searchParams]);

  if (loading) return <p>Loading workouts...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Workout List</h1>

      <div className="mb-6 bg-white rounded-xl shadow-sm p-4 border border-gray-100 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="md:flex-1">
          <label className="block text-sm font-medium text-text mb-2">
            Filter by Category:
          </label>
          <div className="flex flex-wrap gap-3">
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

                    setSearchParams({
                      page: "1",
                      category: updated.join(","),
                      ...(startDate && { startDate }),
                    });
                  }}
                  className="accent-red-500"
                />
                {cat}
              </label>
            ))}
          </div>
        </div>

        <div className="md:w-64">
          <label className="block text-sm font-medium text-text mb-2">
            Start Date (Month):
          </label>
          <select
            value={startDate}
            onChange={(e) => {
              setSearchParams({
                page: "1",
                category: selectedCategories.join(","),
                startDate: e.target.value,
              });
            }}
            className="border rounded px-3 py-2 w-full"
          >
            <option value="">All</option>
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

      {(selectedCategories.length > 0 || startDate) && (
        <div className="mb-4">
          <button
            onClick={() => setSearchParams({ page: "1" })}
            className="inline-block px-4 py-1.5 bg-red-100 text-sm text-red-600 rounded hover:bg-red-200 transition"
          >
            Reset Filters
          </button>
        </div>
      )}

      {workouts.length === 0 ? (
        <p className="text-gray-500 italic">
          No workouts found for these filters.
        </p>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {workouts.map((workout) => (
            <li
              key={workout.id}
              className="bg-white rounded-xl shadow-md p-5 border border-gray-100 hover:shadow-lg transition"
            >
              <div className="flex flex-col gap-2">
                <h2 className="text-lg font-bold text-primary">
                  {workout.name}
                </h2>
                <p className="text-sm text-gray-700">
                  {workout.description.substring(0, 100)}...
                </p>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>🏷 Category: {workout.category}</span>
                  <span>
                    📅 {new Date(workout.startDate).toLocaleDateString()}
                  </span>
                </div>
                <Link
                  to={`/workout/${workout.id}`}
                  className="self-start mt-2 px-4 py-1.5 text-sm text-white bg-primary rounded hover:bg-red-600 transition"
                >
                  View Details →
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="flex items-center justify-between mt-8">
        <button
          onClick={() =>
            setSearchParams({
              page: (page - 1).toString(),
              category: selectedCategories.join(","),
              ...(startDate && { startDate }),
            })
          }
          disabled={page === 1}
          className="px-4 py-2 bg-primary text-white rounded disabled:opacity-50 hover:bg-red-600 transition"
        >
          ← Prev
        </button>

        <span className="text-sm text-text font-medium">
          Page {page} of {totalPages}
        </span>

        <button
          onClick={() =>
            setSearchParams({
              page: (page + 1).toString(),
              category: selectedCategories.join(","),
              ...(startDate && { startDate }),
            })
          }
          disabled={page === totalPages}
          className="px-4 py-2 bg-primary text-white rounded disabled:opacity-50 hover:bg-red-600 transition"
        >
          Next →
        </button>
      </div>
    </div>
  );
};

export default WorkoutList;
