import { Routes, Route } from "react-router-dom";
import WorkoutList from "./pages/WorkoutList";
import WorkoutDetail from "./pages/WorkoutDetail";

function App() {
  return (
    <main className="p-6 max-w-4xl mx-auto">
      <Routes>
        <Route path="/" element={<WorkoutList />} />
        <Route path="/workout/:id" element={<WorkoutDetail />} />
      </Routes>
    </main>
  );
}

export default App;
