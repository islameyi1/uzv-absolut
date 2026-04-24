import { Router } from "express";
import { db, tasksTable, usersTable, poolsTable } from "./db";
import { eq, and } from "drizzle-orm";
import { requireAuth } from "../middlewares/auth";
import {
  CreateTaskBody,
  UpdateTaskBody,
  UpdateTaskStatusBody,
  GetTasksQueryParams,
} from "./api-zod";

const router: Router = Router();

async function enrichTask(task: typeof tasksTable.$inferSelect) {
  let assignedUser = undefined;
  let pool = undefined;

  if (task.assignedTo) {
    const [u] = await db.select().from(usersTable).where(eq(usersTable.id, task.assignedTo));
    if (u) {
      assignedUser = {
        id: u.id,
        email: u.email,
        name: u.name,
        role: u.role,
        farmId: u.farmId,
        createdAt: u.createdAt.toISOString(),
      };
    }
  }

  if (task.poolId) {
    const [p] = await db.select().from(poolsTable).where(eq(poolsTable.id, task.poolId));
    if (p) {
      pool = {
        id: p.id,
        name: p.name,
        shape: p.shape,
        length: p.length,
        width: p.width,
        diameter: p.diameter,
        depth: p.depth,
        volume: p.volume,
        farmId: p.farmId,
        createdAt: p.createdAt.toISOString(),
      };
    }
  }

  return {
    id: task.id,
    title: task.title,
    description: task.description,
    status: task.status,
    priority: task.priority,
    dueDate: task.dueDate,
    assignedTo: task.assignedTo,
    poolId: task.poolId,
    createdBy: task.createdBy,
    photo: task.photo,
    comment: task.comment,
    assignedUser,
    pool,
    createdAt: task.createdAt.toISOString(),
  };
}

router.get("/tasks", requireAuth, async (req, res): Promise<void> => {
  const params = GetTasksQueryParams.safeParse(req.query);
  let tasks;

  if (req.userRole === "worker") {
    tasks = await db.select().from(tasksTable).where(eq(tasksTable.assignedTo, req.userId!));
  } else {
    tasks = await db.select().from(tasksTable);
  }

  if (params.success) {
    if (params.data.status) {
      tasks = tasks.filter((t) => t.status === params.data.status);
    }
    if (params.data.poolId) {
      tasks = tasks.filter((t) => t.poolId === params.data.poolId);
    }
    if (params.data.assignedTo) {
      tasks = tasks.filter((t) => t.assignedTo === params.data.assignedTo);
    }
  }

  const enriched = await Promise.all(tasks.map(enrichTask));
  res.json(enriched);
});

router.post("/tasks", requireAuth, async (req, res): Promise<void> => {
  const parsed = CreateTaskBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [task] = await db.insert(tasksTable).values({
    ...parsed.data,
    createdBy: req.userId!,
    status: "todo",
  }).returning();

  res.status(201).json(await enrichTask(task));
});

router.get("/tasks/:id", requireAuth, async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  const [task] = await db.select().from(tasksTable).where(eq(tasksTable.id, id));
  if (!task) {
    res.status(404).json({ error: "Task not found" });
    return;
  }
  res.json(await enrichTask(task));
});

router.patch("/tasks/:id", requireAuth, async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  const parsed = UpdateTaskBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [task] = await db.update(tasksTable).set(parsed.data).where(eq(tasksTable.id, id)).returning();
  if (!task) {
    res.status(404).json({ error: "Task not found" });
    return;
  }
  res.json(await enrichTask(task));
});

router.delete("/tasks/:id", requireAuth, async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  await db.delete(tasksTable).where(eq(tasksTable.id, id));
  res.sendStatus(204);
});

router.patch("/tasks/:id/status", requireAuth, async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  const parsed = UpdateTaskStatusBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [task] = await db.update(tasksTable).set({ status: parsed.data.status }).where(eq(tasksTable.id, id)).returning();
  if (!task) {
    res.status(404).json({ error: "Task not found" });
    return;
  }
  res.json(await enrichTask(task));
});

export default router;
