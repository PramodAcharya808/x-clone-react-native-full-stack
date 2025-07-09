import asyncHandler from "express-async-handler";
import User from "../models/user.model.js";
import Notification from "../models/notification.model.js";
import { sendError, sendSuccess } from "../utils/responseHandler.utils.js";

// gets user's profile
export const getUserProfile = asyncHandler(async (req, res) => {
  const { email } = req.params;
  const user = await User.findOne({ email });

  if (!user) return sendError(res, "User not found", 404);

  return sendSuccess(req, "User found!", { user }, 200);
});

// updates user's profile
export const updateProfile = asyncHandler(async (req, res) => {
  const userId = req.auth.sub;
  const user = await User.findOneAndUpdate({ oauthId: userId }, req.body, {
    new: true,
  });

  if (!user) return sendError(res, "User not found", 404);

  return sendSuccess(req, "User data updated", { user }, 201);
});

// sync oauth data to database
export const syncUserData = asyncHandler(async (req, res) => {
  const oauthId = req.auth.sub;

  const userData = {
    oauthId,
    email: req.auth.email,
    fullName: req.auth.name,
    profilePicture: req.auth.picture,
  };

  // check if user already exists
  let user = await User.findOne({ oauthId });

  if (!user) {
    user = await User.create(userData);
    if (!user) return sendError(res, "User creation failed", 500);
    return sendSuccess(res, "User Created!", { user }, 201);
  }

  // user exists
  return sendSuccess(res, "User already exists", { user }, 200);
});

// get current user
export const getCurrentUser = asyncHandler(async (req, res) => {
  const userId = req.auth.sub;
  const user = await User.findOne({ oauthId: userId });

  if (!user) return sendError(res, "User not found", 404);
  return sendSuccess(res, "User data fetched", { user }, 200);
});

// follow user

export const followUser = asyncHandler(async (req, res) => {
  const userId = req.auth.sub;
  const { targetUserId } = req.params;

  if (userId === targetUserId)
    return sendError(res, "You can't follow yourself", 400);

  const currentUser = await User.findOne({ oauthId: userId });
  const targetUser = await User.findById(targetUserId);

  if (!currentUser || !targetUser) return sendError(res, "User not found", 404);

  // true if already following
  const isFollowing = currentUser.following.includes(targetUserId);

  if (isFollowing) {
    // unfollow
    await User.findByIdAndUpdate(currentUser._id, {
      $pull: { following: targetUserId },
    });
    await User.findByIdAndUpdate(targetUserId, {
      $pull: { followers: currentUser._id },
    });
  } else {
    // follow
    await User.findByIdAndUpdate(currentUser._id, {
      $push: { following: targetUserId },
    });
    await User.findByIdAndUpdate(targetUserId, {
      $push: { followers: currentUser._id },
    });

    //   create notification
    await Notification.create({
      from: currentUser._id,
      to: targetUserId,
      type: "follow",
    });
  }

  return sendSuccess(
    res,
    isFollowing ? "User unfollowed successfully" : "User followed successfully",
    200
  );
});
