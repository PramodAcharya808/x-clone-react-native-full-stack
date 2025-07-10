import express from "express";
import { jwtCheck } from "../middleware/auth.middleware.js";
import {
  createComment,
  getComments,
  deleteComment,
} from "../controllers/comment.controller.js";

const commentsRoutes = express.Router();

// public routes
commentsRoutes.get("/post/:postId", getComments);

// protected routes
commentsRoutes.post("/post/:postId", jwtCheck, createComment);
commentsRoutes.delete("/:commentId", jwtCheck, deleteComment);

export default commentsRoutes;
