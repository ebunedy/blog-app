const User = require("../models/user.model");
const Post = require("../models/post.model");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const { BadrequestError, NotFoundError } = require("../errors/index");
const { StatusCodes } = require("http-status-codes");

const userPublicProfile = async (req, res) => {
  const userId = req.params.userId;
  const user = await User.findById(userId).select("-password -role");
  if (!user) throw new NotFoundError("user not found");
  let postsByUser = Post.find({
    author: user._id,
    state: "published",
  }).sort("-createdAt");

  const page = Number(req.query.page) || 1;
  const limit = 20;
  const skip = (page - 1) * limit;
  postsByUser = postsByUser.skip(skip).limit(limit);
  const sortedPostsByUser = await postsByUser
    .populate("tags", "_id name")
    .select("_id title description categories tags author createdAt updatedAt");
  res.status(StatusCodes.OK).json({ user, posts: sortedPostsByUser });
};

const userProfile = async (req, res) => {
  const { state } = req.query;
  if (req.user === undefined) {
    res.json({ message: "you have to be logged in to see this page" });
  } else {
    const user = await User.findById(req.user.userId).select(
      "-password -role -_id"
    );
    if (!user) throw new NotFoundError("user not found");

    const queryObject = {
      author: user._id,
    };

    if (state) queryObject.state = state.toLowerCase();
    let postsByUser = Post.find(queryObject).sort("-createdAt");
    const page = Number(req.query.page) || 1;
    const limit = 20;
    const skip = (page - 1) * limit;
    postsByUser = postsByUser.skip(skip).limit(limit);
    const sortedPostsByUser = await postsByUser
      .populate("tags", "_id name")
      .select(
        "_id title description categories tags author createdAt updatedAt"
      );
    res.status(StatusCodes.OK).json({ user, posts: sortedPostsByUser });
  }
};

const preUserUpdate = async (req, res) => {
  const user = await User.find(req.user.userId).select(
    "-password -createdAt -updatedAt"
  );
  if (!user) throw new NotFoundError("user not found");
  res.status(StatusCodes.OK).json({ user });
};

const userUpdate = async (req, res) => {
  if (req.body.password)
    throw new BadrequestError(
      "to update password, go to password reset page. update other fields"
    );
  const user = await User.findByIdAndUpdate(req.user.userId, req.body);
  if (!user) throw new BadrequestError("failed to update user");
  res.status(StatusCodes.OK).json({ message: "user updated successfully" });
};

const deleteUser = async (req, res) => {
  const user = await User.findByIdAndDelete(req.user.userId);
  if (!user) throw new BadrequestError("failed to delete user");
  res.status(StatusCodes.OK).json({ message: "user deleted successfully" });
};

module.exports = {
  userPublicProfile,
  userProfile,
  preUserUpdate,
  userUpdate,
  deleteUser,
};
