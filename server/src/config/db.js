import mongoose from "mongoose";
import { ENV } from "./env.js";

export const connectDB = async () => {
  try {
    await mongoose.connect(ENV.MONGODB_URI);
    console.log("✅ connected to database");
  } catch (err) {
    console.log("failed to connect database. ", err.message);
    process.exit(1);
  }
};
