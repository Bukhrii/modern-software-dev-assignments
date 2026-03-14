import { Router, type IRouter, type Request, type Response } from "express";
import { taskDb } from "../db/sqlite.js";

const router: IRouter = Router();

const VALID_STATUSES = ["to-do", "in-progress", "done"] as const;
type Status = (typeof VALID_STATUSES)[number];

function isValidStatus(s: string): s is Status {
  return VALID_STATUSES.includes(s as Status);
}

router.get("/", (_req: Request, res: Response) => {
  const tasks = taskDb.getAll();
  const grouped = {
    "to-do": tasks.filter((t) => t.status === "to-do"),
    "in-progress": tasks.filter((t) => t.status === "in-progress"),
    done: tasks.filter((t) => t.status === "done"),
  };
  res.render("index", { tasks, grouped, error: null });
});

router.post("/tasks", (req: Request, res: Response) => {
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

router.post("/tasks/:id/status", (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  const { status } = req.body as { status?: string };

  if (!isNaN(id) && isValidStatus(status ?? "")) {
    taskDb.updateStatus(id, status as Status);
  }
  res.redirect("/");
});

router.post("/tasks/:id/delete", (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  if (!isNaN(id)) {
    taskDb.delete(id);
  }
  res.redirect("/");
});

router.post("/tasks/:id/edit", (req: Request, res: Response) => {
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

export default router;
