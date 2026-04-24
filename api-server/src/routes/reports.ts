import { Router } from "express";
import { db, measurementsTable, poolsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { requireAuth } from "../middlewares/auth";
import { ExportMeasurementsCsvQueryParams } from "@workspace/api-zod";

const router: Router = Router();

router.get("/reports/measurements/csv", requireAuth, async (req, res): Promise<void> => {
  const params = ExportMeasurementsCsvQueryParams.safeParse(req.query);
  let measurements;

  if (params.success && params.data.poolId) {
    measurements = await db.select().from(measurementsTable)
      .where(eq(measurementsTable.poolId, params.data.poolId))
      .orderBy(measurementsTable.date);
  } else {
    measurements = await db.select().from(measurementsTable)
      .orderBy(measurementsTable.date);
  }

  // Get pool names
  const pools = await db.select().from(poolsTable);
  const poolMap = new Map(pools.map((p) => [p.id, p.name]));

  const header = "id,бассейн,дата,температура,pH,кислород,аммиак,нитриты,нитраты\n";
  const rows = measurements.map((m) => [
    m.id,
    `"${poolMap.get(m.poolId) || m.poolId}"`,
    m.date,
    m.temperature,
    m.ph,
    m.oxygen,
    m.ammonia,
    m.nitrites,
    m.nitrates,
  ].join(",")).join("\n");

  const csv = "\uFEFF" + header + rows; // BOM for Excel UTF-8

  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader("Content-Disposition", `attachment; filename="measurements.csv"`);
  res.send(csv);
});

export default router;
