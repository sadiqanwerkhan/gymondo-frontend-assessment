import express from "express";
import cors from "cors";

const app = express();
app.use(cors());

app.get("/", (_req, res) => {
  res.send("Hello from backend!");
});

app.listen(3001, () => {
  console.log("Server running at http://localhost:3001");
});
