import express, { type Request, type Response } from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { EnvConfig } from "./config/envConfig";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";
import taskRouter from "./routes/taskRoutes";

const env = new EnvConfig();
const app = express();

app.use(helmet());
app.use(
  cors({
    origin: env.CLIENT_BASE_URL,
    methods: ["GET", "POST", "PATCH", "DELETE"],
  }),
);
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    standardHeaders: true,
    legacyHeaders: false,
  }),
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.get("/health", (_req: Request, res: Response) => {
  res
    .status(200)
    .json({ statusCode: 200, success: true, message: "OK", data: null });
});

app.use("/api/tasks", taskRouter);
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
