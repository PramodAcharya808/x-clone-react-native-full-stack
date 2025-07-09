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
userRoutes.put("/oauth/sync", jwtCheck, syncUserData);
userRoutes.put("/me", jwtCheck, getCurrentUser);
userRoutes.put("/followUser/:targetUserId", jwtCheck, followUser);

export default userRoutes;
