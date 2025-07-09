import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import userRoutes from "./routes/user.route.js";

const app = express();

// global middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  return res.send({
    status: 200,
    message: "health check OK",
  });
});

app.use("/api/users", userRoutes);

export default app;
