import type { Workout } from "../types/workout";
import WorkoutCard from "./WorkoutCards";

const WorkoutGrid = ({ workouts }: { workouts: Workout[] }) => {
  if (workouts.length === 0) {
    return (
      <p className="text-gray-500 italic">
        No workouts found for these filters.
      </p>
    );
  }

  return (
    <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {workouts.map((workout) => (
        <WorkoutCard key={workout.id} workout={workout} />
      ))}
    </ul>
  );
};

export default WorkoutGrid;
