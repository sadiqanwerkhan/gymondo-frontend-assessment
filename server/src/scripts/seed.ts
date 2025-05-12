import fs from "fs";
import { faker } from "@faker-js/faker";
import path from "path";

const categories = ["c1", "c2", "c3", "c4", "c5", "c6", "c7"];

const generateWorkout = (id: number) => ({
  id: id.toString(),
  name: faker.lorem.words(3),
  description: faker.lorem.paragraphs(15),
  startDate: faker.date.soon({ days: 365 }),
  category: faker.helpers.arrayElement(categories),
});

const workouts = Array.from({ length: 1000 }, (_, i) => generateWorkout(i + 1));

const filePath = path.join(__dirname, "../workouts.json");
fs.writeFileSync(filePath, JSON.stringify(workouts, null, 2));
