import { Router } from "express";
import { requireAuth } from "../middlewares/auth";
import { db } from "./db";
import {
  feedTypesTable, feedingStrategiesTable, feedStockTable, feedingLogsTable,
  poolsTable, usersTable,
} from "./db";
import { eq, desc, and, gte, lte, sql } from "drizzle-orm";

const router: Router = Router();

// ─── Feed Types ──────────────────────────────────────────────────────────────

router.get("/feeding/feed-types", requireAuth, async (req, res): Promise<void> => {
  const rows = await db.select().from(feedTypesTable).orderBy(feedTypesTable.name);
  res.json(rows);
});

router.post("/feeding/feed-types", requireAuth, async (req, res): Promise<void> => {
  const { name, type, pelletSize, proteinPct, fatPct, energyKcal, manufacturer, notes } = req.body;
  if (!name) { res.status(400).json({ error: "name обязателен" }); return; }
  const [row] = await db.insert(feedTypesTable).values({
    name, type: type ?? "dry",
    pelletSize: pelletSize ?? null,
    proteinPct: proteinPct ?? null,
    fatPct: fatPct ?? null,
    energyKcal: energyKcal ?? null,
    manufacturer: manufacturer ?? null,
    notes: notes ?? null,
  }).returning();
  res.status(201).json(row);
});

router.put("/feeding/feed-types/:id", requireAuth, async (req, res): Promise<void> => {
  const id = parseInt(req.params.id);
  const { name, type, pelletSize, proteinPct, fatPct, energyKcal, manufacturer, notes } = req.body;
  const [row] = await db.update(feedTypesTable).set({
    name, type, pelletSize, proteinPct, fatPct, energyKcal, manufacturer, notes,
  }).where(eq(feedTypesTable.id, id)).returning();
  if (!row) { res.status(404).json({ error: "Не найден" }); return; }
  res.json(row);
});

router.delete("/feeding/feed-types/:id", requireAuth, async (req, res): Promise<void> => {
  const id = parseInt(req.params.id);
  await db.delete(feedTypesTable).where(eq(feedTypesTable.id, id));
  res.json({ success: true });
});

// ─── Feeding Strategies ──────────────────────────────────────────────────────

router.get("/feeding/strategies", requireAuth, async (req, res): Promise<void> => {
  const rows = await db
    .select({
      id: feedingStrategiesTable.id,
      name: feedingStrategiesTable.name,
      feedTypeId: feedingStrategiesTable.feedTypeId,
      dailyRatePct: feedingStrategiesTable.dailyRatePct,
      feedingTimesPerDay: feedingStrategiesTable.feedingTimesPerDay,
      notes: feedingStrategiesTable.notes,
      isPreset: feedingStrategiesTable.isPreset,
      createdAt: feedingStrategiesTable.createdAt,
      feedType: {
        id: feedTypesTable.id,
        name: feedTypesTable.name,
        type: feedTypesTable.type,
        pelletSize: feedTypesTable.pelletSize,
      },
    })
    .from(feedingStrategiesTable)
    .leftJoin(feedTypesTable, eq(feedingStrategiesTable.feedTypeId, feedTypesTable.id))
    .orderBy(desc(feedingStrategiesTable.isPreset), feedingStrategiesTable.name);
  res.json(rows);
});

router.post("/feeding/strategies", requireAuth, async (req, res): Promise<void> => {
  const { name, feedTypeId, dailyRatePct, feedingTimesPerDay, notes, isPreset } = req.body;
  if (!name || dailyRatePct == null) { res.status(400).json({ error: "name и dailyRatePct обязательны" }); return; }
  const [row] = await db.insert(feedingStrategiesTable).values({
    name,
    feedTypeId: feedTypeId ?? null,
    dailyRatePct: parseFloat(dailyRatePct),
    feedingTimesPerDay: parseInt(feedingTimesPerDay ?? 4),
    notes: notes ?? null,
    isPreset: isPreset ?? false,
  }).returning();
  res.status(201).json(row);
});

router.put("/feeding/strategies/:id", requireAuth, async (req, res): Promise<void> => {
  const id = parseInt(req.params.id);
  const { name, feedTypeId, dailyRatePct, feedingTimesPerDay, notes, isPreset } = req.body;
  const [row] = await db.update(feedingStrategiesTable).set({
    name, feedTypeId, dailyRatePct, feedingTimesPerDay, notes, isPreset,
  }).where(eq(feedingStrategiesTable.id, id)).returning();
  if (!row) { res.status(404).json({ error: "Не найден" }); return; }
  res.json(row);
});

router.delete("/feeding/strategies/:id", requireAuth, async (req, res): Promise<void> => {
  const id = parseInt(req.params.id);
  await db.delete(feedingStrategiesTable).where(eq(feedingStrategiesTable.id, id));
  res.json({ success: true });
});

// ─── Feed Stock (Warehouse) ───────────────────────────────────────────────────

router.get("/feeding/stock", requireAuth, async (req, res): Promise<void> => {
  const rows = await db
    .select({
      id: feedStockTable.id,
      feedTypeId: feedStockTable.feedTypeId,
      farmId: feedStockTable.farmId,
      quantityKg: feedStockTable.quantityKg,
      minStockKg: feedStockTable.minStockKg,
      notes: feedStockTable.notes,
      updatedAt: feedStockTable.updatedAt,
      feedType: {
        id: feedTypesTable.id,
        name: feedTypesTable.name,
        type: feedTypesTable.type,
        pelletSize: feedTypesTable.pelletSize,
      },
    })
    .from(feedStockTable)
    .leftJoin(feedTypesTable, eq(feedStockTable.feedTypeId, feedTypesTable.id))
    .orderBy(feedTypesTable.name);
  res.json(rows);
});

router.post("/feeding/stock", requireAuth, async (req, res): Promise<void> => {
  const { feedTypeId, farmId, quantityKg, minStockKg, notes } = req.body;
  if (!feedTypeId || quantityKg == null) { res.status(400).json({ error: "feedTypeId и quantityKg обязательны" }); return; }
  const [row] = await db.insert(feedStockTable).values({
    feedTypeId: parseInt(feedTypeId),
    farmId: farmId ? parseInt(farmId) : null,
    quantityKg: parseFloat(quantityKg),
    minStockKg: minStockKg ? parseFloat(minStockKg) : 10,
    notes: notes ?? null,
  }).returning();
  res.status(201).json(row);
});

router.put("/feeding/stock/:id", requireAuth, async (req, res): Promise<void> => {
  const id = parseInt(req.params.id);
  const { quantityKg, minStockKg, notes } = req.body;
  const [row] = await db.update(feedStockTable).set({
    quantityKg: parseFloat(quantityKg),
    minStockKg: minStockKg ? parseFloat(minStockKg) : undefined,
    notes,
    updatedAt: new Date(),
  }).where(eq(feedStockTable.id, id)).returning();
  if (!row) { res.status(404).json({ error: "Не найден" }); return; }
  res.json(row);
});

router.delete("/feeding/stock/:id", requireAuth, async (req, res): Promise<void> => {
  const id = parseInt(req.params.id);
  await db.delete(feedStockTable).where(eq(feedStockTable.id, id));
  res.json({ success: true });
});

// ─── Feeding Logs ─────────────────────────────────────────────────────────────

router.get("/feeding/logs", requireAuth, async (req, res): Promise<void> => {
  const { poolId, from, to, limit: limitParam } = req.query;
  const conditions = [];
  if (poolId) conditions.push(eq(feedingLogsTable.poolId, parseInt(poolId as string)));
  if (from) conditions.push(gte(feedingLogsTable.logDate, from as string));
  if (to) conditions.push(lte(feedingLogsTable.logDate, to as string));

  const rows = await db
    .select({
      id: feedingLogsTable.id,
      poolId: feedingLogsTable.poolId,
      feedTypeId: feedingLogsTable.feedTypeId,
      strategyId: feedingLogsTable.strategyId,
      quantityKg: feedingLogsTable.quantityKg,
      logDate: feedingLogsTable.logDate,
      notes: feedingLogsTable.notes,
      createdAt: feedingLogsTable.createdAt,
      pool: { id: poolsTable.id, name: poolsTable.name },
      feedType: { id: feedTypesTable.id, name: feedTypesTable.name, type: feedTypesTable.type },
    })
    .from(feedingLogsTable)
    .leftJoin(poolsTable, eq(feedingLogsTable.poolId, poolsTable.id))
    .leftJoin(feedTypesTable, eq(feedingLogsTable.feedTypeId, feedTypesTable.id))
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(feedingLogsTable.logDate), desc(feedingLogsTable.createdAt))
    .limit(parseInt((limitParam as string) ?? "100"));
  res.json(rows);
});

router.post("/feeding/logs", requireAuth, async (req, res): Promise<void> => {
  const { poolId, feedTypeId, strategyId, quantityKg, logDate, notes, stockId } = req.body;
  if (!poolId || !feedTypeId || quantityKg == null || !logDate) {
    res.status(400).json({ error: "poolId, feedTypeId, quantityKg, logDate обязательны" }); return;
  }
  const qty = parseFloat(quantityKg);

  // Deduct from stock if stockId provided
  if (stockId) {
    const [stock] = await db.select().from(feedStockTable).where(eq(feedStockTable.id, parseInt(stockId)));
    if (stock) {
      const newQty = Math.max(0, (stock.quantityKg ?? 0) - qty);
      await db.update(feedStockTable).set({ quantityKg: newQty, updatedAt: new Date() })
        .where(eq(feedStockTable.id, parseInt(stockId)));
    }
  }

  const [row] = await db.insert(feedingLogsTable).values({
    poolId: parseInt(poolId),
    feedTypeId: parseInt(feedTypeId),
    strategyId: strategyId ? parseInt(strategyId) : null,
    quantityKg: qty,
    logDate,
    notes: notes ?? null,
    createdBy: req.userId ?? null,
  }).returning();
  res.status(201).json(row);
});

router.delete("/feeding/logs/:id", requireAuth, async (req, res): Promise<void> => {
  const id = parseInt(req.params.id);
  await db.delete(feedingLogsTable).where(eq(feedingLogsTable.id, id));
  res.json({ success: true });
});

// ─── Growth Calculator ────────────────────────────────────────────────────────

router.post("/feeding/calc-growth", requireAuth, async (req, res): Promise<void> => {
  const { biomassKg, dailyRatePct, fcr, period, waterTemp } = req.body;
  if (!biomassKg || !dailyRatePct || !period) {
    res.status(400).json({ error: "biomassKg, dailyRatePct, period обязательны" }); return;
  }
  const B = parseFloat(biomassKg);
  const rate = parseFloat(dailyRatePct) / 100;
  const fcrVal = parseFloat(fcr ?? 1.3);
  const days = parseInt(period);
  const tempFactor = waterTemp ? (1 + (parseFloat(waterTemp) - 20) * 0.02) : 1;

  // Daily feed = biomass * daily_rate
  const dailyFeedKg = B * rate;

  // Simulated daily growth with compound growth
  let currentBiomass = B;
  const dailyGrowth = (dailyFeedKg / fcrVal) * tempFactor;
  const growthPerDay = [];

  for (let d = 1; d <= Math.min(days, 365); d++) {
    currentBiomass += dailyGrowth * (currentBiomass / B); // proportional growth
    growthPerDay.push({ day: d, biomassKg: parseFloat(currentBiomass.toFixed(2)) });
  }

  const finalBiomass = growthPerDay[growthPerDay.length - 1]?.biomassKg ?? B;
  const totalGain = finalBiomass - B;
  const totalFeedNeeded = dailyFeedKg * days;

  res.json({
    initialBiomassKg: B,
    finalBiomassKg: parseFloat(finalBiomass.toFixed(2)),
    gainKg: parseFloat(totalGain.toFixed(2)),
    gainPct: parseFloat(((totalGain / B) * 100).toFixed(1)),
    dailyFeedKg: parseFloat(dailyFeedKg.toFixed(3)),
    totalFeedKg: parseFloat(totalFeedNeeded.toFixed(2)),
    fcr: fcrVal,
    days,
    chartData: growthPerDay.filter((_, i) => i % Math.max(1, Math.floor(days / 30)) === 0 || i === growthPerDay.length - 1),
  });
});

export default router;
