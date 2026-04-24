import { Router } from "express";
import { db, poolsTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import { requireAuth } from "../middlewares/auth";
import { CreatePoolBody, GetPoolsQueryParams } from "@workspace/api-zod";

const router: Router = Router();

function calcVolume(shape: string, length?: number | null, width?: number | null, diameter?: number | null, depth?: number): number {
  const d = depth || 1;
  if (shape === "rectangular" && length && width) {
    return length * width * d;
  } else if (shape === "circular" && diameter) {
    return Math.PI * (diameter / 2) ** 2 * d;
  } else if (shape === "oval" && length && width) {
    return Math.PI * (length / 2) * (width / 2) * d;
  }
  return 0;
}

function poolToJson(p: typeof poolsTable.$inferSelect) {
  return {
    id: p.id,
    name: p.name,
    shape: p.shape,
    length: p.length,
    width: p.width,
    diameter: p.diameter,
    depth: p.depth,
    volume: p.volume,
    waterLevel: p.waterLevel,
    drainType: p.drainType,
    farmId: p.farmId,
    createdAt: p.createdAt.toISOString(),
  };
}

router.get("/pools", requireAuth, async (req, res): Promise<void> => {
  const params = GetPoolsQueryParams.safeParse(req.query);
  if (params.success && params.data.farmId) {
    const pools = await db.select().from(poolsTable).where(eq(poolsTable.farmId, params.data.farmId));
    res.json(pools.map(poolToJson));
    return;
  }
  const pools = await db.select().from(poolsTable);
  res.json(pools.map(poolToJson));
});

router.post("/pools", requireAuth, async (req, res): Promise<void> => {
  const parsed = CreatePoolBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { name, shape, length, width, diameter, depth, farmId } = parsed.data;
  const drainType: "bottom" | "side" = (req.body.drainType === "bottom" || req.body.drainType === "side")
    ? req.body.drainType : "side";
  const waterLevelRaw = parseFloat(req.body.waterLevel);
  const waterLevel = !isNaN(waterLevelRaw) && waterLevelRaw > 0 ? Math.min(waterLevelRaw, depth) : null;

  const volume = calcVolume(shape, length, width, diameter, depth);

  const [pool] = await db.insert(poolsTable).values({
    name, shape,
    length: length ?? null,
    width: width ?? null,
    diameter: diameter ?? null,
    depth, volume, drainType, waterLevel,
    farmId,
  }).returning();

  res.status(201).json(poolToJson(pool));
});

router.get("/pools/:id", requireAuth, async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  const [pool] = await db.select().from(poolsTable).where(eq(poolsTable.id, id));
  if (!pool) { res.status(404).json({ error: "Pool not found" }); return; }
  res.json(poolToJson(pool));
});

router.put("/pools/:id", requireAuth, async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }

  const parsed = CreatePoolBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }

  const { name, shape, length, width, diameter, depth, farmId } = parsed.data;
  const drainType: "bottom" | "side" = (req.body.drainType === "bottom" || req.body.drainType === "side")
    ? req.body.drainType : "side";
  const waterLevelRaw = parseFloat(req.body.waterLevel);
  const waterLevel = !isNaN(waterLevelRaw) && waterLevelRaw > 0 ? Math.min(waterLevelRaw, depth) : null;

  const volume = calcVolume(shape, length, width, diameter, depth);

  const [pool] = await db.update(poolsTable).set({
    name, shape,
    length: length ?? null,
    width: width ?? null,
    diameter: diameter ?? null,
    depth, volume, drainType, waterLevel,
    farmId,
  }).where(eq(poolsTable.id, id)).returning();

  if (!pool) { res.status(404).json({ error: "Pool not found" }); return; }
  res.json(poolToJson(pool));
});

router.delete("/pools/:id", requireAuth, async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  await db.delete(poolsTable).where(eq(poolsTable.id, id));
  res.sendStatus(204);
});

export default router;
