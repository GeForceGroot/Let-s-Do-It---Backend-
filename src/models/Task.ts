import { Schema, model, type InferSchemaType } from "mongoose";

const taskSchema = new Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 120 },
    description: { type: String, trim: true, maxlength: 1000, default: "" },
    scheduledFor: { type: Date, required: true, index: true },
    endsAt: { type: Date, required: true, index: true },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
      index: true,
    },
    status: {
      type: String,
      enum: ["open", "in_progress", "completed"],
      default: "open",
      index: true,
    },
  },
  { timestamps: true, versionKey: false },
);

taskSchema.index({ scheduledFor: 1, endsAt: 1, status: 1 });
taskSchema.index({ title: "text", description: "text" });

export type Task = InferSchemaType<typeof taskSchema>;
export const TaskModel = model("Task", taskSchema);
