const Post = require("../models/post.model");
const Tag = require("../models/tag.model");
const { BadrequestError } = require("../errors/index");
const { StatusCodes } = require("http-status-codes");
const smartTrim = require("../helper/smart.trim");
const readTime = require("../helper/read.time");

const createPost = async (req, res) => {
  const { title, body, tags } = req.body;
  if (!title || !body || !tags)
    throw new BadrequestError("title, body, tags are all required");
  req.body.description = smartTrim(body, 380, "</p>", "...");
  req.body.author = req.user.userId;
  readTime(body, title, req);
  const { description } = req.body;
  const postExist = await Post.findOne({ title, description });
  if (postExist)
    throw new BadrequestError(
      "post might already exist. please make changes to the post body"
    );

  const post = await Post.create(req.body);
  if (!post) throw new BadrequestError("failed to create post");
  res
    .status(StatusCodes.CREATED)
    .json({ message: "post created successfully" });
};

const searchSortPaginatePosts = async (req, res) => {
  const { search, date_created, author, read_count, reading_time } = req.query;
  const queryObject = {};
  if (search)
    queryObject.$or = [
      { title: { $regex: search, $options: "i" } },
      { body: { $regex: search, $options: "i" } },
      /*{
        author: { $regex: search, $options: "i" }
      },*/
    ];
  let sortPosts = Post.find(queryObject);
  const lowercaseSort = date_created?.toLowerCase();
  const lowercaseAuthor = author?.toLowerCase();
  const readCount = read_count?.toLowerCase();
  const readTime = reading_time?.toLowerCase();
  const sortObject = {};
  if (lowercaseSort === "latest") sortObject.createdAt = -1;
  if (lowercaseSort === "oldest") sortObject.createdAt = 1;
  if (lowercaseAuthor === "z-a") sortObject.author = -1;
  if (lowercaseAuthor === "a-z") sortObject.author = 1;
  if (readCount === "descending") sortObject.read_count = -1;
  if (readCount === "ascending") sortObject.read_count = 1;
  if (readTime === "descending") sortObject.reading_time = -1;
  if (readTime === "ascending") sortObject.reading_time = 1;

  sortPosts = sortPosts.sort(sortObject);
  const page = Number(req.query.page) || 1;
  const limit = 20;
  const skip = (page - 1) * limit;
  sortPosts = sortPosts.skip(skip).limit(limit);

  const posts = await sortPosts
    .populate("tags")
    .populate("author", "_id name username");

  res.status(StatusCodes.OK).json({ posts });
};

const getSinglePost = async (req, res) => {
  const id = req.params.postId;
  const post = await Post.findById(id)
    .populate("tags")
    .populate("author", "_id name username")
    .select("-description");
  if (!post) throw new BadrequestError("failed to fetch post");
  post.read_count += 1;
  await post.save();
  res.status(StatusCodes.OK).json({ post });
};

const relatedPost = async (req, res) => {
  const { tag } = req.query;
  const id = req.params.postId;
  const objectQuery = { _id: { $ne: id } };
  if (!tag)
    throw new BadrequestError(
      "please provide either a tag to get related post"
    );
  const tagId = await Tag.find({ name: tag.toLowerCase() });
  if (tagId) objectQuery.tags = { $in: tagId._id };
  const posts = await Post.find(objectQuery);
  res.status(StatusCodes.OK).json({ relatedPosts: posts });
};

const prePostUpdate = async (req, res) => {
  const id = req.params.postId;
  const post = await Post.findById(id).populate("tags").select("-description");
  const tags = await Tag.find({});
  if (!post) throw new BadrequestError("failed to fetch post");
  if (!tags) throw new BadrequestError("failed to fetch tags");
  res.status(StatusCodes.OK).json({ post, tags });
};

const updatePost = async (req, res) => {
  const id = req.params.postId;
  const author = await Post.findById(id).select("author title");
  if (author?.author.toString() !== req.user.userId.toString())
    throw new BadrequestError("only the writter can update the post");
  if (req.body.body) {
    req.body.description = smartTrim(req.body.body, 380, "</p>", " ...");
    readTime(body, author.title, req);
  }
  const post = await Post.findByIdAndUpdate(id, req.body);
  if (!post) throw new BadrequestError("failed to update post");
  res.status(StatusCodes.OK).json({ message: "post updated successfully" });
};

const deletePost = async (req, res) => {
  const id = req.params.postId;
  const author = await Post.findById(id).select("author");
  if (author?.author.toString() !== req.user.userId.toString())
    throw new BadrequestError("only the writter can delete the post");
  const post = await Post.findByIdAndDelete(id);
  if (!post) throw new BadrequestError("failed to delete post");
  res.status(StatusCodes.OK).json({ message: "post deleted successfully" });
};

const addLike = async (req, res) => {
  const id = req.params.postId;
  const post = await Post.findByIdAndUpdate(id, {
    $addToSet: { likes: req.user._id },
  });
  if (!post) throw BadrequestError("failed to add like");
  res.status(StatusCodes.OK).json({
    message: `like added successfully`,
  });
};

const removeLike = async (req, res) => {
  const { postId } = req.params;
  const post = await Post.findByIdAndUpdate(postId, {
    $pull: { likes: req.user.userId },
  });
  if (!post) throw BadrequestError("failed to remove like");
  res.status(StatusCodes.OK).json({
    message: `like removed successfully`,
  });
};

module.exports = {
  createPost,
  searchSortPaginatePosts,
  getSinglePost,
  relatedPost,
  prePostUpdate,
  updatePost,
  deletePost,
  addLike,
  removeLike,
};
