/*
  # Create tasks table for Shared Task Board

  1. New Tables
    - `tasks`
      - `id` (uuid, primary key) - Unique identifier for each task
      - `title` (text, required) - Task title
      - `description` (text) - Detailed description of the task
      - `status` (text, required) - Task status: 'to-do', 'in-progress', or 'done'
      - `created_at` (timestamptz) - Timestamp when task was created
      - `updated_at` (timestamptz) - Timestamp when task was last updated

  2. Security
    - Enable RLS on `tasks` table
    - Add public SELECT policy - anyone can view all tasks
    - Add public INSERT policy - anyone can create new tasks
    - Add public UPDATE policy - anyone can update any task
    - Add public DELETE policy - anyone can delete any task
    
  3. Important Notes
    - This is a PUBLIC task board with NO authentication required
    - All users have full CRUD access to all tasks
    - Status is constrained to three values: 'to-do', 'in-progress', 'done'
*/

CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text DEFAULT '',
  status text NOT NULL DEFAULT 'to-do',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_status CHECK (status IN ('to-do', 'in-progress', 'done'))
);

ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view tasks"
  ON tasks FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Anyone can create tasks"
  ON tasks FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anyone can update tasks"
  ON tasks FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete tasks"
  ON tasks FOR DELETE
  TO anon
  USING (true);

CREATE INDEX IF NOT EXISTS tasks_status_idx ON tasks(status);
CREATE INDEX IF NOT EXISTS tasks_created_at_idx ON tasks(created_at DESC);