import { Router } from "express";
import { db, measurementsTable, poolsTable } from "./db";
import { eq, and, gte, lte } from "drizzle-orm";
import { requireAuth } from "../middlewares/auth";
import {
  CreateMeasurementBody,
  GetMeasurementsQueryParams,
  GetMeasurementsChartParams,
  GetMeasurementsChartQueryParams,
} from "./api-zod";

const router: Router = Router();

function getMeasurementStatus(m: {
  temperature: number; ph: number; oxygen: number;
  ammonia: number; nitrites: number; nitrates: number;
}): "normal" | "warning" | "critical" {
  const isCritical =
    m.temperature < 12 || m.temperature > 35 ||
    m.ph < 6.0 || m.ph > 9.0 ||
    m.oxygen < 4 ||
    m.ammonia > 2 ||
    m.nitrites > 1 ||
    m.nitrates > 80;

  if (isCritical) return "critical";

  const isWarning =
    m.temperature < 15 || m.temperature > 32 ||
    m.ph < 6.5 || m.ph > 8.5 ||
    m.oxygen < 5 ||
    m.ammonia > 0.5 ||
    m.nitrites > 0.1 ||
    m.nitrates > 20;

  return isWarning ? "warning" : "normal";
}

router.get("/measurements", requireAuth, async (req, res): Promise<void> => {
  const params = GetMeasurementsQueryParams.safeParse(req.query);

  let measurements;
  if (params.success && params.data.poolId) {
    measurements = await db.select().from(measurementsTable)
      .where(eq(measurementsTable.poolId, params.data.poolId))
      .orderBy(measurementsTable.createdAt);
  } else {
    measurements = await db.select().from(measurementsTable)
      .orderBy(measurementsTable.createdAt);
  }

  res.json(measurements.map((m) => ({
    id: m.id,
    poolId: m.poolId,
    temperature: m.temperature,
    ph: m.ph,
    oxygen: m.oxygen,
    ammonia: m.ammonia,
    nitrites: m.nitrites,
    nitrates: m.nitrates,
    date: m.date,
    createdAt: m.createdAt.toISOString(),
  })));
});

router.post("/measurements", requireAuth, async (req, res): Promise<void> => {
  const parsed = CreateMeasurementBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const data = parsed.data;
  const date = data.date || new Date().toISOString().split("T")[0];

  const [m] = await db.insert(measurementsTable).values({
    ...data,
    date,
  }).returning();

  res.status(201).json({
    id: m.id,
    poolId: m.poolId,
    temperature: m.temperature,
    ph: m.ph,
    oxygen: m.oxygen,
    ammonia: m.ammonia,
    nitrites: m.nitrites,
    nitrates: m.nitrates,
    date: m.date,
    createdAt: m.createdAt.toISOString(),
  });
});

router.get("/measurements/:poolId/chart", requireAuth, async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.poolId) ? req.params.poolId[0] : req.params.poolId;
  const poolId = parseInt(raw, 10);
  if (isNaN(poolId)) {
    res.status(400).json({ error: "Invalid poolId" });
    return;
  }

  const measurements = await db.select().from(measurementsTable)
    .where(eq(measurementsTable.poolId, poolId))
    .orderBy(measurementsTable.date);

  const chartData = measurements.map((m) => ({
    date: m.date,
    temperature: m.temperature,
    ph: m.ph,
    oxygen: m.oxygen,
    ammonia: m.ammonia,
    nitrites: m.nitrites,
    nitrates: m.nitrates,
  }));

  res.json(chartData);
});

router.get("/measurements/latest", requireAuth, async (req, res): Promise<void> => {
  const pools = await db.select().from(poolsTable);
  const result = [];

  for (const pool of pools) {
    const measurements = await db.select().from(measurementsTable)
      .where(eq(measurementsTable.poolId, pool.id))
      .orderBy(measurementsTable.createdAt)
      .limit(1);

    const latest = measurements[0];
    const status = latest ? getMeasurementStatus(latest) : "unknown";

    result.push({
      pool: {
        id: pool.id,
        name: pool.name,
        shape: pool.shape,
        length: pool.length,
        width: pool.width,
        diameter: pool.diameter,
        depth: pool.depth,
        volume: pool.volume,
        farmId: pool.farmId,
        createdAt: pool.createdAt.toISOString(),
      },
      measurement: latest ? {
        id: latest.id,
        poolId: latest.poolId,
        temperature: latest.temperature,
        ph: latest.ph,
        oxygen: latest.oxygen,
        ammonia: latest.ammonia,
        nitrites: latest.nitrites,
        nitrates: latest.nitrates,
        date: latest.date,
        createdAt: latest.createdAt.toISOString(),
      } : undefined,
      status,
    });
  }

  res.json(result);
});

export default router;
