import { Link } from "react-router-dom";
import type { Workout } from "../types/workout";

const WorkoutCard = ({ workout }: { workout: Workout }) => {
  return (
    <li className="bg-white rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition h-full flex flex-col">
      <div className="flex flex-col gap-2 flex-1 p-5">
        <h2 className="text-lg font-bold text-primary">{workout.name}</h2>
        <p className="text-sm text-gray-700">
          {workout.description.substring(0, 100)}...
        </p>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>🏷 Category: {workout.category}</span>
          <span>📅 {new Date(workout.startDate).toLocaleDateString()}</span>
        </div>
        <div className="mt-auto pt-2">
          <Link
            to={`/workout/${workout.id}`}
            className="inline-block px-4 py-1.5 text-sm text-white bg-primary rounded hover:bg-red-600 transition"
          >
            View Details →
          </Link>
        </div>
      </div>
    </li>
  );
};

export default WorkoutCard;
