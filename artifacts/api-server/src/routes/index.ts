import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import usersRouter from "./users";
import farmsRouter from "./farms";
import poolsRouter from "./pools";
import measurementsRouter from "./measurements";
import tasksRouter from "./tasks";
import diseasesRouter from "./diseases";
import calculatorsRouter from "./calculators";
import reportsRouter from "./reports";
import dashboardRouter from "./dashboard";
import feedingRouter from "./feeding";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(usersRouter);
router.use(farmsRouter);
router.use(poolsRouter);
router.use(measurementsRouter);
router.use(tasksRouter);
router.use(diseasesRouter);
router.use(calculatorsRouter);
router.use(reportsRouter);
router.use(dashboardRouter);
router.use(feedingRouter);

export default router;
