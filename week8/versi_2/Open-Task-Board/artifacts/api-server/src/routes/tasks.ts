import { Router, type IRouter } from "express";
import { db, tasksTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import {
  CreateTaskBody,
  UpdateTaskBody,
  UpdateTaskParams,
  DeleteTaskParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/tasks", async (_req, res) => {
  try {
    const tasks = await db.select().from(tasksTable).orderBy(tasksTable.id);
    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

router.post("/tasks", async (req, res) => {
  const parsed = CreateTaskBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { title, description, status } = parsed.data;
  try {
    const [task] = await db
      .insert(tasksTable)
      .values({
        title,
        description: description ?? "",
        status: status ?? "to-do",
      })
      .returning();
    res.status(201).json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create task" });
  }
});

router.put("/tasks/:taskId", async (req, res) => {
  const paramsParsed = UpdateTaskParams.safeParse({ taskId: req.params.taskId });
  if (!paramsParsed.success) {
    res.status(400).json({ error: "Invalid task ID" });
    return;
  }

  const bodyParsed = UpdateTaskBody.safeParse(req.body);
  if (!bodyParsed.success) {
    res.status(400).json({ error: bodyParsed.error.message });
    return;
  }

  const taskId = paramsParsed.data.taskId;
  const updates = bodyParsed.data;

  if (Object.keys(updates).length === 0) {
    res.status(400).json({ error: "No fields provided to update" });
    return;
  }

  try {
    const [task] = await db
      .update(tasksTable)
      .set(updates)
      .where(eq(tasksTable.id, taskId))
      .returning();

    if (!task) {
      res.status(404).json({ error: "Task not found" });
      return;
    }

    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update task" });
  }
});

router.delete("/tasks/:taskId", async (req, res) => {
  const paramsParsed = DeleteTaskParams.safeParse({ taskId: req.params.taskId });
  if (!paramsParsed.success) {
    res.status(400).json({ error: "Invalid task ID" });
    return;
  }

  const taskId = paramsParsed.data.taskId;

  try {
    const [deleted] = await db
      .delete(tasksTable)
      .where(eq(tasksTable.id, taskId))
      .returning();

    if (!deleted) {
      res.status(404).json({ error: "Task not found" });
      return;
    }

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete task" });
  }
});

export default router;
