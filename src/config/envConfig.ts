import "dotenv/config";

export class EnvConfig {
  readonly PORT = Number(process.env.PORT) || 3000;
  readonly NODE_ENV = process.env.NODE_ENV || "development";
  readonly CLIENT_BASE_URL =
    process.env.CLIENT_BASE_URL || "http://localhost:5173";
  readonly MONGODB_URI =
    process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/taskflow";
}
