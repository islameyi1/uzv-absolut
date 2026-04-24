import { Router } from "express";
import { db, usersTable, farmsTable } from "./db";
import { eq } from "drizzle-orm";
import { hashPassword, verifyPassword, signToken } from "../lib/auth";
import { requireAuth, requireOwner } from "../middlewares/auth";
import {
  RegisterBody,
  LoginBody,
  InviteWorkerBody,
} from "./api-zod";

const router: Router = Router();

router.post("/auth/register", async (req, res): Promise<void> => {
  const parsed = RegisterBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { email, name, password, role } = parsed.data;

  const existing = await db.select().from(usersTable).where(eq(usersTable.email, email));
  if (existing.length > 0) {
    res.status(400).json({ error: "Email already registered" });
    return;
  }

  const passwordHash = await hashPassword(password);
  const [user] = await db.insert(usersTable).values({ email, name, passwordHash, role }).returning();
  const token = signToken({ userId: user.id, role: user.role });

  res.status(201).json({
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      farmId: user.farmId,
      createdAt: user.createdAt.toISOString(),
    },
    token,
  });
});

router.post("/auth/login", async (req, res): Promise<void> => {
  const parsed = LoginBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { email, password } = parsed.data;

  const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email));
  if (!user) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  const token = signToken({ userId: user.id, role: user.role });
  res.json({
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      farmId: user.farmId,
      createdAt: user.createdAt.toISOString(),
    },
    token,
  });
});

router.post("/auth/logout", async (_req, res): Promise<void> => {
  res.json({ success: true });
});

router.get("/auth/me", requireAuth, async (req, res): Promise<void> => {
  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, req.userId!));
  if (!user) {
    res.status(401).json({ error: "User not found" });
    return;
  }
  res.json({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    farmId: user.farmId,
    createdAt: user.createdAt.toISOString(),
  });
});

router.post("/auth/invite", requireOwner, async (req, res): Promise<void> => {
  const parsed = InviteWorkerBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { email, name, password } = parsed.data;

  const existing = await db.select().from(usersTable).where(eq(usersTable.email, email));
  if (existing.length > 0) {
    res.status(400).json({ error: "Email already registered" });
    return;
  }

  const [owner] = await db.select().from(usersTable).where(eq(usersTable.id, req.userId!));
  const farms = await db.select().from(farmsTable).where(eq(farmsTable.ownerId, req.userId!));
  const farmId = farms.length > 0 ? farms[0].id : null;

  const passwordHash = await hashPassword(password);
  const [user] = await db.insert(usersTable).values({
    email,
    name,
    passwordHash,
    role: "worker",
    farmId: farmId ?? undefined,
  }).returning();

  res.status(201).json({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    farmId: user.farmId,
    createdAt: user.createdAt.toISOString(),
  });
});

export default router;
