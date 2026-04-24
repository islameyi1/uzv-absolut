import { Router } from "express";
import { db, diseasesTable } from "@workspace/db";
import { eq, like, or, ilike } from "drizzle-orm";
import { requireAuth } from "../middlewares/auth";
import { CreateDiseaseBody, GetDiseasesQueryParams } from "@workspace/api-zod";

const router: Router = Router();

function diseaseToResponse(d: typeof diseasesTable.$inferSelect) {
  return {
    id: d.id,
    name: d.name,
    latinName: d.latinName,
    symptoms: d.symptoms,
    causes: d.causes,
    waterParameters: d.waterParameters,
    treatment: d.treatment,
    prevention: d.prevention,
    photo: d.photo,
    createdAt: d.createdAt.toISOString(),
  };
}

router.get("/diseases", requireAuth, async (req, res): Promise<void> => {
  const params = GetDiseasesQueryParams.safeParse(req.query);
  let diseases;

  if (params.success && params.data.q) {
    const q = params.data.q;
    diseases = await db.select().from(diseasesTable).where(
      or(
        ilike(diseasesTable.name, `%${q}%`),
        ilike(diseasesTable.symptoms, `%${q}%`),
        ilike(diseasesTable.latinName, `%${q}%`),
      )
    );
  } else {
    diseases = await db.select().from(diseasesTable);
  }

  res.json(diseases.map(diseaseToResponse));
});

router.post("/diseases", requireAuth, async (req, res): Promise<void> => {
  if (req.userRole !== "owner") {
    res.status(403).json({ error: "Owner access required" });
    return;
  }
  const parsed = CreateDiseaseBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [disease] = await db.insert(diseasesTable).values(parsed.data).returning();
  res.status(201).json(diseaseToResponse(disease));
});

router.get("/diseases/:id", requireAuth, async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  const [disease] = await db.select().from(diseasesTable).where(eq(diseasesTable.id, id));
  if (!disease) {
    res.status(404).json({ error: "Disease not found" });
    return;
  }
  res.json(diseaseToResponse(disease));
});

export default router;
