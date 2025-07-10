import "dotenv/config";
import { ENV } from "./config/env.js";
import { connectDB } from "./config/db.js";
import app from "./app.js";

const startServer = async () => {
  try {
    await connectDB();

    if (ENV.NODE_ENV !== "PROD")
      app.listen(ENV.PORT, () => {
        console.log(`✅ Server running on port: ${ENV.PORT}`);
      });
  } catch (err) {
    console.error("❌ Failed to connect to DB:", err.message);
    process.exit(1);
  }
};

startServer();

export default app;
