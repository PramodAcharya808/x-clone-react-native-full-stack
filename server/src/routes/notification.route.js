import express from "express";
import { jwtCheck } from "../middleware/auth.middleware.js";
import {
  getNotifications,
  deleteNotification,
} from "../controllers/notification.controller.js";

const notificationRoutes = express.Router();

notificationRoutes.get("/", jwtCheck, getNotifications);
notificationRoutes.delete("/:notificationId", jwtCheck, deleteNotification);

export default notificationRoutes;
