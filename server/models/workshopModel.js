import mongoose from "mongoose";

const workshopSchema = new mongoose.Schema(
  {
    courseName: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    courseType: { type: String, required: true },
    description: { type: String },
    location: { type: String },
    image: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("workshops", workshopSchema);
