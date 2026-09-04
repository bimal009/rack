import express, { type Express, type ErrorRequestHandler } from "express";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import pinoHttp from "pino-http";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./auth";
import { logger } from "./lib/logger";
import { handleError } from "./lib/errors";
import gymRoutes from "./modules/gym/gym.routes";
import plansRoutes from "./modules/plans/plans.routes";
import staffRoutes from "./modules/staff/staff.routes";
import mediaRoutes from "./modules/media/media.routes";
import sportRoutes from "./modules/sport/sport.routes";
import featureRoutes from "./modules/feature/feature.routes";
import areaTypeRoutes from "./modules/areaType/areaType.routes";
import instructorTypeRoutes from "./modules/instructorType/instructorType.routes";
import classTypeRoutes from "./modules/classType/classType.routes";
import brandRoutes from "./modules/brand/brand.routes";
import productCategoryRoutes from "./modules/productCategory/productCategory.routes";
import taxRateRoutes from "./modules/taxRate/taxRate.routes";
import membershipCategoryRoutes from "./modules/membershipCategory/membershipCategory.routes";
import payRateRoutes from "./modules/payRate/payRate.routes";
import areaRoutes from "./modules/area/area.routes";
import membershipPlanRoutes from "./modules/membershipPlan/membershipPlan.routes";

const isDev = process.env.NODE_ENV === "development";

const app: Express = express();

app.set("trust proxy", 1);

app.use(helmet());

app.use(pinoHttp({ logger}));

app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(",") ?? (isDev ? "http://localhost:3000" : false),
    credentials: true,
     methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  })
);

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: true,
    legacyHeaders: false,
  })
);
app.all("/api/v1/auth/*splat", toNodeHandler(auth));
app.use(express.json({ limit: "10kb" }));

app.use("/api/v1/gyms", gymRoutes);
app.use("/api/v1/gyms/:slug/staff", staffRoutes);
app.use("/api/v1/gyms/:slug/sports", sportRoutes);
app.use("/api/v1/gyms/:slug/features", featureRoutes);
app.use("/api/v1/gyms/:slug/settings/area-types", areaTypeRoutes);
app.use("/api/v1/gyms/:slug/settings/instructor-types", instructorTypeRoutes);
app.use("/api/v1/gyms/:slug/settings/class-types", classTypeRoutes);
app.use("/api/v1/gyms/:slug/settings/brands", brandRoutes);
app.use("/api/v1/gyms/:slug/settings/product-categories", productCategoryRoutes);
app.use("/api/v1/gyms/:slug/settings/tax-rates", taxRateRoutes);
app.use(
  "/api/v1/gyms/:slug/settings/membership-categories",
  membershipCategoryRoutes
);
app.use("/api/v1/gyms/:slug/pay-rates", payRateRoutes);
app.use("/api/v1/gyms/:slug/areas", areaRoutes);
app.use("/api/v1/gyms/:slug/memberships", membershipPlanRoutes);
app.use("/api/v1/plans", plansRoutes);
app.use("/api/v1/media", mediaRoutes);

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok",uptime:process.uptime() });
});

app.use((_req, res) => {
  res.status(404).json({ error: "Not found" });
});

const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  req.log.error({ err }, "Unhandled error");
  const { status, body } = handleError("request", err);
  res.status(status).json(body);
};
app.use(errorHandler);

export default app;
