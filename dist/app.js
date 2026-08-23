"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const envConfig_1 = require("./config/envConfig");
const errorHandler_1 = require("./middleware/errorHandler");
const taskRoutes_1 = __importDefault(require("./routes/taskRoutes"));
const env = new envConfig_1.EnvConfig();
const app = (0, express_1.default)();
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: env.CLIENT_BASE_URL,
    methods: ["GET", "POST", "PATCH", "DELETE"],
}));
app.use((0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 300,
    standardHeaders: true,
    legacyHeaders: false,
}));
app.use(express_1.default.json({ limit: "10mb" }));
app.use(express_1.default.urlencoded({ extended: true, limit: "10mb" }));
app.get("/health", (_req, res) => {
    res
        .status(200)
        .json({ statusCode: 200, success: true, message: "OK", data: null });
});
app.use("/api/tasks", taskRoutes_1.default);
app.use(errorHandler_1.notFoundHandler);
app.use(errorHandler_1.errorHandler);
exports.default = app;
//# sourceMappingURL=app.js.map