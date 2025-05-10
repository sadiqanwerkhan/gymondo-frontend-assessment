import { useEffect, useState } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";
import type { Workout } from "../types/workout";

const WorkoutList = () => {
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api
      .get(`/workouts?page=${page}`)
      .then((res) => {
        setWorkouts(res.data.workouts);
        setTotalPages(Math.ceil(res.data.total / res.data.pageSize));
      })
      .catch((err) => {
        console.error("Failed to fetch workouts:", err);
      })
      .finally(() => setLoading(false));
  }, [page]);

  if (loading) return <p>Loading workouts...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Workout List</h1>
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
      <div className="flex justify-between mt-6">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          ← Prev
        </button>

        <span className="self-center">
          Page {page} of {totalPages}
        </span>

        <button
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
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
