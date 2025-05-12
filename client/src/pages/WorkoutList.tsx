import { useEffect, useState } from "react";
import api from "../api/axios";
import { useSearchParams } from "react-router-dom";
import type { Workout } from "../types/workout";
import { getNext12Months } from "../utils/date";

import WorkoutGrid from "../components/WorkoutGrid";
import FiltersPanel from "../components/FilterPanel";
import ResetFiltersButton from "../components/ResetFilterButton";
import Pagination from "../components/Pagination";

const WorkoutList = () => {
  const [totalPages, setTotalPages] = useState(1);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [filteredCount, setFilteredCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  const page = parseInt(searchParams.get("page") || "1");
  const selectedCategories = (searchParams.get("category") || "")
    .split(",")
    .filter(Boolean);
  const currentMonth = new Date();
  const defaultMonth = `${currentMonth.getFullYear()}-${String(
    currentMonth.getMonth() + 1
  ).padStart(2, "0")}`;
  const startDate = searchParams.get("startDate") ?? defaultMonth;

  const allCategories = ["c1", "c2", "c3", "c4", "c5", "c6", "c7"];
  const months = getNext12Months();

  useEffect(() => {
    const params = new URLSearchParams();
    params.set("page", page.toString());

    if (selectedCategories.length > 0) {
      params.set("category", selectedCategories.join(","));
    }

    if (startDate && startDate !== "all") {
      params.set("startDate", startDate);
    }

    setLoading(true);
    api
      .get(`/workouts?${params.toString()}`)
      .then((res) => {
        setWorkouts(res.data.workouts);
        setFilteredCount(res.data.total);
        setTotalPages(Math.ceil(res.data.total / res.data.pageSize));
      })
      .catch((err) => console.error("Failed to fetch workouts:", err))
      .finally(() => setLoading(false));
  }, [searchParams]);

  useEffect(() => {
    api
      .get(`/workouts`)
      .then((res) => setTotalCount(res.data.total))
      .catch((err) => console.error("Failed to fetch total workouts:", err));
  }, []);

  const showReset =
    selectedCategories.length > 0 ||
    (typeof startDate === "string" &&
      startDate !== defaultMonth &&
      startDate !== "all");

  const handlePageChange = (newPage: number) => {
    setSearchParams({
      page: newPage.toString(),
      category: selectedCategories.join(","),
      ...(startDate && startDate !== "all" && { startDate }),
    });
  };

  if (loading) return <p>Loading workouts...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Workout List</h1>

      <div className="md:hidden mb-4 flex justify-end">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="px-4 py-2 bg-primary text-white rounded"
        >
          {showFilters ? "Hide Filters" : "Show Filters"}
        </button>
      </div>

      {showFilters && (
        <div className="md:hidden mt-4 p-4 bg-gray-50 border rounded shadow-inner">
          <FiltersPanel
            selectedCategories={selectedCategories}
            startDate={startDate}
            setSearchParams={setSearchParams}
            allCategories={allCategories}
            months={months}
          />
        </div>
      )}

      <div className="hidden md:block mb-4 bg-white rounded-xl shadow-sm p-4 border border-gray-100">
        <FiltersPanel
          selectedCategories={selectedCategories}
          startDate={startDate}
          setSearchParams={setSearchParams}
          allCategories={allCategories}
          months={months}
        />
      </div>

      <ResetFiltersButton
        showReset={showReset}
        onReset={() => setSearchParams({ page: "1" })}
      />

      <p className="text-sm text-gray-600 mb-6">
        Showing {filteredCount} of {totalCount} workouts
      </p>

      <WorkoutGrid workouts={workouts} />

      {totalPages > 1 && filteredCount >= 20 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default WorkoutList;
