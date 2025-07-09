import express from "express";
import {
  followUser,
  getCurrentUser,
  getUserProfile,
  syncUserData,
  updateProfile,
} from "../controllers/user.controller.js";
import { jwtCheck } from "../middleware/auth.middleware.js";

const userRoutes = express.Router();

userRoutes.get("/profile/:email", getUserProfile);
userRoutes.put("/profile/update", jwtCheck, updateProfile);
userRoutes.post("/oauth/sync", jwtCheck, syncUserData);
userRoutes.post("/me", jwtCheck, getCurrentUser);
userRoutes.post("/followUser/:targetUserId", jwtCheck, followUser);

export default userRoutes;
