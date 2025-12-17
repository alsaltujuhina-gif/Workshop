import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    userEmail: { type: String, required: true }, 
    userPassword: { type: String, required: true },
    role: { type: String, enum: ["admin", "user"], default: "user" },
    userPhone: { type: String, required: true },
    userAddress: { type: String, required: true } 
  },
  { versionKey: false }
);

const userModel = mongoose.model("users", userSchema);

export default userModel;
