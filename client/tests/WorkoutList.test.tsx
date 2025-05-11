import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import WorkoutList from "../src/pages/WorkoutList";
import { describe, it, vi, expect } from "vitest";
import api from "../src/api/axios";

vi.mock("../src/api/axios");

const mockApi = api.get as ReturnType<typeof vi.fn>;

const mockWorkouts = [
  {
    id: "1",
    name: "Upper Body Blast",
    description: "A great upper body session",
    startDate: "2025-06-01T00:00:00.000Z",
    category: "c1",
  },
];

describe("WorkoutList", () => {
  it("renders list of workouts", async () => {
    mockApi.mockResolvedValueOnce({
      data: {
        workouts: mockWorkouts,
        total: 1,
        pageSize: 20,
      },
    });

    render(
      <BrowserRouter>
        <WorkoutList />
      </BrowserRouter>
    );

    expect(screen.getByText("Loading workouts...")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Upper Body Blast")).toBeInTheDocument();
      expect(screen.getByText(/Category: c1/i)).toBeInTheDocument();
    });
  });

  it("shows empty message when no workouts match", async () => {
    mockApi.mockResolvedValueOnce({
      data: {
        workouts: [],
        total: 0,
        pageSize: 20,
      },
    });

    render(
      <BrowserRouter>
        <WorkoutList />
      </BrowserRouter>
    );

    expect(screen.getByText("Loading workouts...")).toBeInTheDocument();

    await waitFor(() => {
      expect(
        screen.getByText(/no workouts found for these filters/i)
      ).toBeInTheDocument();
    });
  });
});
