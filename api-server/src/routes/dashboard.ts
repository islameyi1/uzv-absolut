import { Router } from "express";
import { db, farmsTable, poolsTable, usersTable, tasksTable, measurementsTable } from "./db";
import { eq } from "drizzle-orm";
import { requireAuth } from "../middlewares/auth";

const router: Router = Router();

router.get("/dashboard/summary", requireAuth, async (req, res): Promise<void> => {
  const farms = await db.select().from(farmsTable).where(eq(farmsTable.ownerId, req.userId!));
  const farmIds = farms.map((f) => f.id);

  const allPools = await db.select().from(poolsTable);
  const myPools = farmIds.length > 0
    ? allPools.filter((p) => farmIds.includes(p.farmId))
    : allPools;

  const workers = await db.select().from(usersTable).where(eq(usersTable.role, "worker"));

  const allTasks = await db.select().from(tasksTable);
  const pendingTasks = allTasks.filter((t) => t.status !== "done").length;

  // Recent measurements (last 24h)
  const allMeasurements = await db.select().from(measurementsTable);
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
  const recentMeasurements = allMeasurements.filter((m) => m.date >= yesterday).length;

  // Calculate alerts (critical measurements)
  let alertCount = 0;
  for (const m of allMeasurements) {
    if (
      m.temperature < 12 || m.temperature > 35 ||
      m.ph < 6.0 || m.ph > 9.0 ||
      m.oxygen < 4 ||
      m.ammonia > 2 ||
      m.nitrites > 1 ||
      m.nitrates > 80
    ) {
      alertCount++;
    }
  }

  res.json({
    totalFarms: farms.length,
    totalPools: myPools.length,
    totalWorkers: workers.length,
    pendingTasks,
    recentMeasurements,
    alertCount,
  });
});

export default router;
