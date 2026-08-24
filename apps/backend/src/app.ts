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

const isDev = process.env.NODE_ENV === "development";

const app: Express = express();

app.set("trust proxy", 1);

app.use(helmet());

app.use(pinoHttp({ logger}));

app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(",") ?? (isDev ? "http://localhost:3000" : false),
    credentials: true,
     methods: ["GET", "POST", "PUT", "DELETE"],
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
