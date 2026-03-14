import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, "..", "..", "tasks.db");

const db = new Database(dbPath);

db.pragma("journal_mode = WAL");

db.exec(`
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT DEFAULT '',
    status TEXT NOT NULL DEFAULT 'to-do' CHECK(status IN ('to-do', 'in-progress', 'done'))
  )
`);

export type Task = {
  id: number;
  title: string;
  description: string;
  status: "to-do" | "in-progress" | "done";
};

export const taskDb = {
  getAll(): Task[] {
    return db.prepare("SELECT * FROM tasks ORDER BY id DESC").all() as Task[];
  },
  getById(id: number): Task | undefined {
    return db.prepare("SELECT * FROM tasks WHERE id = ?").get(id) as Task | undefined;
  },
  create(title: string, description: string, status: string): void {
    db.prepare("INSERT INTO tasks (title, description, status) VALUES (?, ?, ?)").run(title, description, status);
  },
  updateStatus(id: number, status: string): void {
    db.prepare("UPDATE tasks SET status = ? WHERE id = ?").run(status, id);
  },
  update(id: number, title: string, description: string, status: string): void {
    db.prepare("UPDATE tasks SET title = ?, description = ?, status = ? WHERE id = ?").run(title, description, status, id);
  },
  delete(id: number): void {
    db.prepare("DELETE FROM tasks WHERE id = ?").run(id);
  },
};

export default db;
