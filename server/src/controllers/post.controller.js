import asyncHandler from "express-async-handler";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import cloudinary from "../config/cloudinary.js";

import Notification from "../models/notification.model.js";
import Comment from "../models/comment.model.js";
import { sendError, sendSuccess } from "../utils/responseHandler.utils.js";

export const getPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find()
    .sort({ createdAt: -1 })
    .populate("user", "fullName profilePicture")
    .populate({
      path: "comments",
      populate: {
        path: "user",
        select: "fullName profilePicture",
      },
    });

  return sendSuccess(res, "Posts found", { posts }, 200);
});

export const getPost = asyncHandler(async (req, res) => {
  const { postId } = req.params;

  const post = await Post.findById(postId)
    .populate("user", "fullName profilePicture")
    .populate({
      path: "comments",
      populate: {
        path: "user",
        select: "fullName profilePicture",
      },
    });

  if (!post) return sendError(res, "Post not found", 404);
  return sendSuccess(res, "Post found", { post }, 200);
});

export const getUserPosts = asyncHandler(async (req, res) => {
  const { email } = req.params;

  const user = await User.findOne({ email });
  if (!user) return sendError(res, "user not found", 404);

  const posts = await Post.find({ user: user._id })
    .sort({ createdAt: -1 })
    .populate("user", "fullName profilePicture")
    .populate({
      path: "comments",
      populate: {
        path: "user",
        select: "fullName profilePicture",
      },
    });

  return sendSuccess(res, "Post found", { posts }, 200);
});

export const createPost = asyncHandler(async (req, res) => {
  const userId = req.auth.sub;
  const { content } = req.body;
  const imageFile = req.file;

  if (!content && !imageFile) {
    return sendError(res, "Post must contain either text or image", 400);
  }

  const user = await User.findOne({ oauthId: userId });
  if (!user) return sendError(res, "User not found", 404);

  let imageUrl = "";

  // upload image to Cloudinary if provided
  if (imageFile) {
    try {
      // convert buffer to base64 for cloudinary
      const base64Image = `data:${
        imageFile.mimetype
      };base64,${imageFile.buffer.toString("base64")}`;

      const uploadResponse = await cloudinary.uploader.upload(base64Image, {
        folder: "social_media_posts",
        resource_type: "image",
        transformation: [
          { width: 800, height: 600, crop: "limit" },
          { quality: "auto" },
          { format: "auto" },
        ],
      });
      imageUrl = uploadResponse.secure_url;
    } catch (uploadError) {
      console.error("Cloudinary upload error:", uploadError);
      return sendError(res, "Failed to upload image", 400);
    }
  }

  const post = await Post.create({
    user: user._id,
    content: content || "",
    image: imageUrl,
  });

  return sendSuccess(res, "Uploaded successfully", { post }, 200);
});

export const likePost = asyncHandler(async (req, res) => {
  const userId = req.auth.sub;
  const { postId } = req.params;

  const user = await User.findOne({ oauthId: userId });
  const post = await Post.findById(postId);

  if (!user || !post) return sendError(res, "User or post not found", 404);

  const isLiked = post.likes.includes(user._id);

  if (isLiked) {
    // unlike
    await Post.findByIdAndUpdate(postId, {
      $pull: { likes: user._id },
    });
  } else {
    // like
    await Post.findByIdAndUpdate(postId, {
      $push: { likes: user._id },
    });

    // create notification if not liking own post
    if (post.user.toString() !== user._id.toString()) {
      await Notification.create({
        from: user._id,
        to: post.user,
        type: "like",
        post: postId,
      });
    }
  }

  return sendSuccess(
    res,
    isLiked ? "Post unliked successfully" : "Post liked successfully",
    200
  );
});

export const deletePost = asyncHandler(async (req, res) => {
  const userId = req.auth.sub;
  const { postId } = req.params;

  const user = await User.findOne({ oauthId: userId });
  const post = await Post.findById(postId);

  if (!user || !post)
    return res.status(404).json({ error: "User or post not found" });

  if (post.user.toString() !== user._id.toString()) {
    return res
      .status(403)
      .json({ error: "You can only delete your own posts" });
  }

  // delete all comments on this post
  await Comment.deleteMany({ post: postId });

  // delete the post
  await Post.findByIdAndDelete(postId);

  res.status(200).json({ message: "Post deleted successfully" });
});
