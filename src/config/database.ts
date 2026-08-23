import mongoose from "mongoose";
import { EnvConfig } from "./envConfig";

export async function connectDatabase(): Promise<void> {
  const env = new EnvConfig();
  await mongoose.connect(env.MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
  console.info("MongoDB connected");
}
