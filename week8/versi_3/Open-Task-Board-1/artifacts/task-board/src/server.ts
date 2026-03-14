import express, { type Request, type Response } from "express";
import path from "path";
import { fileURLToPath } from "url";
import { taskDb, isValidStatus, type Status } from "./db.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "..", "views"));

app.get("/", (_req: Request, res: Response) => {
  const tasks = taskDb.getAll();
  const grouped = {
    "to-do": tasks.filter((t) => t.status === "to-do"),
    "in-progress": tasks.filter((t) => t.status === "in-progress"),
    done: tasks.filter((t) => t.status === "done"),
  };
  res.render("index", { tasks, grouped, error: null });
});

app.post("/tasks", (req: Request, res: Response) => {
  const { title, description, status } = req.body as {
    title?: string;
    description?: string;
    status?: string;
  };

  if (!title || title.trim() === "") {
    const tasks = taskDb.getAll();
    const grouped = {
      "to-do": tasks.filter((t) => t.status === "to-do"),
      "in-progress": tasks.filter((t) => t.status === "in-progress"),
      done: tasks.filter((t) => t.status === "done"),
    };
    return res.status(400).render("index", {
      tasks,
      grouped,
      error: "Title cannot be empty.",
    });
  }

  const safeStatus = isValidStatus(status ?? "") ? (status as Status) : "to-do";
  taskDb.create(title.trim(), (description ?? "").trim(), safeStatus);
  res.redirect("/");
});

app.post("/tasks/:id/status", (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  const { status } = req.body as { status?: string };
  if (!isNaN(id) && isValidStatus(status ?? "")) {
    taskDb.updateStatus(id, status as Status);
  }
  res.redirect("/");
});

app.post("/tasks/:id/delete", (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  if (!isNaN(id)) {
    taskDb.delete(id);
  }
  res.redirect("/");
});

app.post("/tasks/:id/edit", (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  const { title, description, status } = req.body as {
    title?: string;
    description?: string;
    status?: string;
  };

  if (!title || title.trim() === "") {
    return res.redirect("/");
  }

  const safeStatus = isValidStatus(status ?? "") ? (status as Status) : "to-do";
  if (!isNaN(id)) {
    taskDb.update(id, title.trim(), (description ?? "").trim(), safeStatus);
  }
  res.redirect("/");
});

app.listen(PORT, () => {
  console.log(`Shared Task Board running on port ${PORT}`);
});
