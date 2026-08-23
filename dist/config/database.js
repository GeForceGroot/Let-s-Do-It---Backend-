"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDatabase = connectDatabase;
const mongoose_1 = __importDefault(require("mongoose"));
const envConfig_1 = require("./envConfig");
async function connectDatabase() {
    const env = new envConfig_1.EnvConfig();
    await mongoose_1.default.connect(env.MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
    console.info("MongoDB connected");
}
//# sourceMappingURL=database.js.map