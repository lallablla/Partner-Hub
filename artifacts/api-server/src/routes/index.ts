import { Router, type IRouter } from "express";
import healthRouter from "./health";
import aiRouter from "./ai";
import dashboardRouter from "./dashboard";
import salesRouter from "./sales";

const router: IRouter = Router();

router.use(healthRouter);
router.use(aiRouter);
router.use(dashboardRouter);
router.use(salesRouter);

export default router;
