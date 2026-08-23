"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnvConfig = void 0;
require("dotenv/config");
class EnvConfig {
    constructor() {
        this.PORT = Number(process.env.PORT) || 3000;
        this.NODE_ENV = process.env.NODE_ENV || "development";
        this.CLIENT_BASE_URL = process.env.CLIENT_BASE_URL || "http://localhost:5173";
        this.MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/taskflow";
    }
}
exports.EnvConfig = EnvConfig;
//# sourceMappingURL=envConfig.js.map