import Header from "./components/Header";
import { Routes, Route } from "react-router-dom";
import WorkoutList from "./pages/WorkoutList";
import WorkoutDetail from "./pages/WorkoutDetail";

function App() {
  return (
    <div className="bg-secondary min-h-screen">
      <Header />
      <main className="p-4 max-w-4xl mx-auto">
        <Routes>
          <Route path="/" element={<WorkoutList />} />
          <Route path="/workout/:id" element={<WorkoutDetail />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
