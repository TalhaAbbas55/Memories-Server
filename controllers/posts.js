import PostMessage from "../models/postMessage.js";
import mongoose from "mongoose";

export const getPosts = async (req, res) => {
    try {
        const postMessage = await PostMessage.find();
        res.status(200).json(postMessage)
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}

export const createPost = async (req, res) => {
    const post = req.body;
    let newPost = new PostMessage(post);
    newPost.title = post.title;
    console.log(post,newPost,'post');
    try {
        await newPost.save();
        const staticResponse = { message: "Post created successfully." };
        res.status(201).json({ ...staticResponse, post: newPost });
    } catch (error) {
        res.status('409').json({ message: error.message });
    }
}

export const updatePost = async (req,res)=>{
    const {id: _id} = req.params;
    const post = req.body;
    if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send('No post with that ID');
    const updatedPost = await PostMessage.findByIdAndUpdate(_id, post, {new:true});
    res.json(updatedPost);
}