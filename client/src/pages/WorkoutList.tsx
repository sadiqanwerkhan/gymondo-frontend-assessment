import { useEffect, useState } from "react";
import api from "../api/axios";
import { Link, useSearchParams } from "react-router-dom";
import type { Workout } from "../types/workout";

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

      <div className="mb-6 bg-white rounded-xl shadow-sm p-4 border border-gray-100 space-y-4">
        <div>
          <label className="block text-sm font-medium text-text mb-2">
            Filter by Category:
          </label>
          <div className="flex flex-wrap gap-3">
            {allCategories.map((cat) => (
              <label key={cat} className="text-sm flex items-center gap-1">
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
                      ...(startDate && { startDate }),
                    };

                    setSearchParams(next);
                  }}
                />
                {cat}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-text mb-2">
            Filter by Start Date (Month):
          </label>
          <input
            type="month"
            value={startDate}
            onChange={(e) => {
              const next = {
                page: "1",
                category: selectedCategories.join(","),
                startDate: e.target.value,
              };
              setSearchParams(next);
            }}
            className="border rounded px-3 py-1"
          />
        </div>

        {(selectedCategories.length > 0 || startDate) && (
          <button
            onClick={() => setSearchParams({ page: "1" })}
            className="text-sm text-red-500 underline"
          >
            Reset Filters
          </button>
        )}
      </div>

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
                <div className="text-xs text-gray-500">
                  <span className="inline-block mr-3">
                    🏷 Category: {workout.category}
                  </span>
                  <span>
                    📅 {new Date(workout.startDate).toLocaleDateString()}
                  </span>
                </div>
                <Link
                  to={`/workout/${workout.id}`}
                  className="text-sm text-blue-500 underline hover:text-blue-700"
                >
                  View Details →
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="flex justify-between mt-6">
        <button
          onClick={() =>
            setSearchParams({
              page: (page - 1).toString(),
              category: selectedCategories.join(","),
              ...(startDate && { startDate }),
            })
          }
          disabled={page === 1}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          ← Prev
        </button>

        <span className="self-center">
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
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Next →
        </button>
      </div>
    </div>
  );
};

export default WorkoutList;
