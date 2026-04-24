import { Router } from "express";
import { db, farmsTable, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { requireAuth } from "../middlewares/auth";
import { CreateFarmBody, GetFarmParams, UpdateFarmParams, DeleteFarmParams } from "@workspace/api-zod";

const router: Router = Router();

router.get("/farms", requireAuth, async (req, res): Promise<void> => {
  const farms = await db.select().from(farmsTable).where(eq(farmsTable.ownerId, req.userId!));
  res.json(farms.map((f) => ({
    id: f.id,
    name: f.name,
    location: f.location,
    photo: f.photo,
    ownerId: f.ownerId,
    createdAt: f.createdAt.toISOString(),
  })));
});

router.post("/farms", requireAuth, async (req, res): Promise<void> => {
  const parsed = CreateFarmBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [farm] = await db.insert(farmsTable).values({
    ...parsed.data,
    ownerId: req.userId!,
  }).returning();

  res.status(201).json({
    id: farm.id,
    name: farm.name,
    location: farm.location,
    photo: farm.photo,
    ownerId: farm.ownerId,
    createdAt: farm.createdAt.toISOString(),
  });
});

router.get("/farms/:id", requireAuth, async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  const [farm] = await db.select().from(farmsTable).where(eq(farmsTable.id, id));
  if (!farm) {
    res.status(404).json({ error: "Farm not found" });
    return;
  }
  res.json({
    id: farm.id,
    name: farm.name,
    location: farm.location,
    photo: farm.photo,
    ownerId: farm.ownerId,
    createdAt: farm.createdAt.toISOString(),
  });
});

router.put("/farms/:id", requireAuth, async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  const parsed = CreateFarmBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [farm] = await db.update(farmsTable).set(parsed.data).where(eq(farmsTable.id, id)).returning();
  if (!farm) {
    res.status(404).json({ error: "Farm not found" });
    return;
  }
  res.json({
    id: farm.id,
    name: farm.name,
    location: farm.location,
    photo: farm.photo,
    ownerId: farm.ownerId,
    createdAt: farm.createdAt.toISOString(),
  });
});

router.delete("/farms/:id", requireAuth, async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  await db.delete(farmsTable).where(eq(farmsTable.id, id));
  res.sendStatus(204);
});

export default router;
