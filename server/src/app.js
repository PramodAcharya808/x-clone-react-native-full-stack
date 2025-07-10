import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import userRoutes from "./routes/user.route.js";
import postRoutes from "./routes/post.route.js";
import notificationRoutes from "./routes/notification.route.js";
import commentsRoutes from "./routes/comment.route.js";
import { arcjetMiddleware } from "./middleware/arcjet.middleware.js";

const app = express();

// global middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(arcjetMiddleware);

app.get("/", (req, res) => {
  return res.send({
    status: 200,
    message: "health check OK",
  });
});

app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/comments", commentsRoutes);

export default app;
