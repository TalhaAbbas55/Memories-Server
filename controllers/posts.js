import PostMessage from "../models/postMessage.js";
import mongoose from "mongoose";

export const getPosts = async (req, res) => {
  let { page } = req.query;
  try {
    const LIMIT = 8;
    const startIndex = (Number(page) - 1) * LIMIT; // get the starting index of every page
    const total = await PostMessage.countDocuments({}); // get the total number of posts
    const posts = await PostMessage.find()
      .sort({ _id: -1 })
      .limit(LIMIT)
      .skip(startIndex);
    res
      .status(200)
      .json({
        data: posts,
        currentPage: Number(page),
        numberOfPages: Math.ceil(total / LIMIT),
      });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
// Query parameters are used to send additional information to the server for example in the URL: http://localhost:5000/posts?searchQuery=test&tags=tech we have two query parameters: searchQuery and tags. The searchQuery parameter is used to search for a specific post and the tags parameter is used to filter posts by tags. The searchQuery parameter is used to search for a specific post and the tags parameter is used to filter posts by tags.
// Params are used to send additional information to the server in the URL path. For example, in the URL: http://localhost:5000/posts/1234 we have the post ID 1234. The post ID is used to identify a specific post.
export const getPostsBySearch = async (req, res) => {
  const { searchQuery, tags } = req.query;
  try {
    const title = new RegExp(searchQuery, "i");
    const posts = await PostMessage.find({
      $or: [{ title }, { tags: { $in: tags.split(",") } }],
    });
    res.json({ data: posts });
  } catch (error) {
    console.log(error);
  }
};

export const createPost = async (req, res) => {
  const post = req.body;
  let newPost = new PostMessage({
    ...post,
    creator: req.userId,
    createdAt: new Date().toISOString(),
  });
  try {
    await newPost.save();
    res.status(201).json({ ...newPost._doc });
  } catch (error) {
    res.status("409").json({ message: error.message });
  }
};

export const updatePost = async (req, res) => {
  const { id: _id } = req.params;
  const post = req.body;
  if (!mongoose.Types.ObjectId.isValid(_id))
    return res.status(404).send("No post with that ID");
  const updatedPost = await PostMessage.findByIdAndUpdate(
    _id,
    { _id, ...post },
    { new: true }
  );
  res.json(updatedPost);
};

export const deletePost = async (req, res) => {
  const { id: _id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(_id))
    return res.status(404).send("No post with that ID");
  await PostMessage.findByIdAndDelete(_id);
  res.json({ message: "Post deleted successfully" });
};

export const likePost = async (req, res) => {
  const { id: _id } = req.params;
  if (!req.userId) return res.json({ message: "Unauthenticated User" });
  if (!mongoose.Types.ObjectId.isValid(_id))
    return res.status(404).send("No post with that ID");

  try {
    const post = await PostMessage.findById(_id);
    if (!post) return res.status(404).send("No post with that ID");

    const index = post.likes.findIndex((id) => id === String(req.userId));

    if (index === -1) {
      // If the user has not liked the post, the user's ID will be added to the likes array
      post.likes.push(req.userId);
    } else {
      // If the user has liked the post, the user's ID will be removed from the likes array
      post.likes = post.likes.filter((id) => id !== String(req.userId));
    }
    const updatedPost = await PostMessage.findByIdAndUpdate(_id, post, {
      new: true,
    });
    res.json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
