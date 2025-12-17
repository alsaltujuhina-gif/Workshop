import mongoose from "mongoose";

const enrollmentSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  title: { type: String, required: true },
  date: { type: Date, required: true }, 
  image: { type: String },     
  
});

export const Enrollment = mongoose.model("Enrollment", enrollmentSchema);
