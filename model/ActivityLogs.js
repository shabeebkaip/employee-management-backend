import mongoose from "mongoose";
import { Schema } from "mongoose";

const schema = new Schema(
  {
    user_name: {
      type: String,
      required: true,
    },
    activity: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
const ActivityLog = mongoose.model("ActivityLog", schema);
export default ActivityLog;
