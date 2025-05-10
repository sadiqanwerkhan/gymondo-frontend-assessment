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

      <div className="mb-4 space-y-2">
        <div>
          <label className="block font-medium mb-1">Category:</label>
          <div className="flex gap-2 flex-wrap">
            {allCategories.map((cat) => (
              <label key={cat} className="text-sm">
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
                  className="mr-1"
                />
                {cat}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block font-medium mb-1">Start Date (Month):</label>
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
            className="border px-2 py-1 rounded"
          />
        </div>

        {(selectedCategories.length > 0 || startDate) && (
          <button
            onClick={() => setSearchParams({ page: "1" })}
            className="text-sm text-red-500 underline mb-4 block"
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
        <ul className="space-y-4">
          {workouts.map((workout) => (
            <li key={workout.id} className="border p-4 rounded shadow">
              <h2 className="font-semibold">{workout.name}</h2>
              <p>{workout.description.substring(0, 100)}...</p>
              <p className="text-sm text-gray-500">
                Category: {workout.category}
              </p>
              <p className="text-sm text-gray-500">
                Start Date: {new Date(workout.startDate).toLocaleDateString()}
              </p>
              <Link
                to={`/workout/${workout.id}`}
                className="text-blue-500 underline block mt-2"
              >
                View Details →
              </Link>
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
