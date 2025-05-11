import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axios";
import type { Workout } from "../types/workout";

const WorkoutDetail = () => {
  const { id } = useParams();
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(`/workouts/${id}`)
      .then((res) => setWorkout(res.data))
      .catch(() => setWorkout(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p>Loading workout...</p>;
  if (!workout) return <p>Workout not found.</p>;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">{workout.name}</h1>
      <p>{workout.description}</p>
      <p className="text-sm text-gray-500">Category: {workout.category}</p>
      <p className="text-sm text-gray-500">
        Start Date: {new Date(workout.startDate).toLocaleDateString()}
      </p>
      <Link
        to="/"
        className="inline-block mb-4 px-4 py-1.5 text-sm text-white bg-primary rounded hover:bg-red-600 transition"
      >
        ← Back to Workout List
      </Link>
    </div>
  );
};

export default WorkoutDetail;
