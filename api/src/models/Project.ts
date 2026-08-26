import { Schema, model, Document, Types } from "mongoose";

export type ProjectStatus = "Planning" | "In Progress" | "Completed" | "Archived";
export const PROJECT_STATUSES: ProjectStatus[] = ["Planning", "In Progress", "Completed", "Archived"];

export interface IProject extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  name: string;
  description?: string;
  status: ProjectStatus;
  color: string;
  createdAt: Date;
  updatedAt: Date;
}

const projectSchema = new Schema<IProject>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    name: { type: String, required: true, trim: true, maxlength: 120 },
    description: { type: String, trim: true, maxlength: 2000, default: "" },
    status: { type: String, enum: PROJECT_STATUSES, default: "Planning" },
    color: { type: String, default: "#FF5A4E" },
  },
  { timestamps: true }
);

projectSchema.index({ userId: 1, status: 1 });

export const Project = model<IProject>("Project", projectSchema);
