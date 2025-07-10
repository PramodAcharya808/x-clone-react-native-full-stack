import express from "express";
import {
  createPost,
  deletePost,
  getPost,
  getPosts,
  getUserPosts,
  likePost,
} from "../controllers/post.controller.js";
import { jwtCheck } from "../middleware/auth.middleware.js";
import upload from "../middleware/upload.middleware.js";

const postRoutes = express.Router();

// public routes
postRoutes.get("/", getPosts);
postRoutes.get("/:postId", getPost);
postRoutes.get("/user/:username", getUserPosts);

// protected proteced
postRoutes.post("/", jwtCheck, upload.single("image"), createPost);
postRoutes.post("/:postId/like", jwtCheck, likePost);
postRoutes.delete("/:postId", jwtCheck, deletePost);

export default postRoutes;
