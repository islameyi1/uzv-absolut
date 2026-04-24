import { Router } from "express";
import { db, usersTable, farmsTable } from "./db";
import { eq } from "drizzle-orm";
import { requireOwner } from "../middlewares/auth";

const router: Router = Router();

router.get("/users/workers", requireOwner, async (req, res): Promise<void> => {
  const farms = await db.select().from(farmsTable).where(eq(farmsTable.ownerId, req.userId!));
  const farmIds = farms.map((f) => f.id);

  const workers = await db.select().from(usersTable).where(eq(usersTable.role, "worker"));
  const myWorkers = farmIds.length > 0
    ? workers.filter((w) => w.farmId !== null && farmIds.includes(w.farmId!))
    : workers;

  res.json(myWorkers.map((w) => ({
    id: w.id,
    email: w.email,
    name: w.name,
    role: w.role,
    farmId: w.farmId,
    createdAt: w.createdAt.toISOString(),
  })));
});

export default router;
