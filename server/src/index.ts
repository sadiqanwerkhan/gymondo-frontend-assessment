import express, { Request, Response } from "express";
import cors from "cors";

type Workout = {
  id: string;
  name: string;
  description: string;
  startDate: string;
  category: string;
};

const allWorkouts: Workout[] = require("./workouts.json");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (_req: Request, res: Response) => {
  res.send("The backend API is running here..");
});

app.get("/workouts", (req: Request, res: Response) => {
  const { page = "1", category, startDate } = req.query;
  const pageNumber = parseInt(page as string) || 1;
  const PAGE_SIZE = 20;

  let filtered: Workout[] = allWorkouts;

  if (category) {
    const selected = (category as string).split(",");
    filtered = filtered.filter((w) => selected.includes(w.category));
  }

  if (startDate) {
    filtered = filtered.filter((w) => {
      const d = new Date(w.startDate);
      const [year, month] = (startDate as string).split("-");
      return (
        d.getFullYear() === parseInt(year) &&
        d.getMonth() + 1 === parseInt(month)
      );
    });
  }

  const total = filtered.length;
  const start = (pageNumber - 1) * PAGE_SIZE;
  const paginated = filtered.slice(start, start + PAGE_SIZE);

  res.json({
    total,
    page: pageNumber,
    pageSize: PAGE_SIZE,
    workouts: paginated,
  });
});

app.get(
  "/workouts/:id",
  (req: Request<{ id: string }>, res: Response): void => {
    const workout = allWorkouts.find((w) => w.id === req.params.id);
    if (!workout) {
      res.status(404).json({ error: "Workout not found" });
      return;
    }
    res.json(workout);
  }
);

app.use((_req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.listen(3001, () => {
  console.log("Backend running at http://localhost:3001");
});
