import Post from "../models/postModel.js";
import User from "../models/userModel.js";
import Notification from "../models/notificModel.js"
import cloudinary from "cloudinary"

export const createPost = async (req, res) => {
    try {

        const { text } = req.body;
        let { img } = req.body;
        const userId = req.user._id.toString();

        const user = await User.findOne({ _id: userId })

        if (!user) {
            return res.status(400).json({ error: "User not found" })
        }

        if (!text && !img) {
            return res.status(400).json({ error: "post must have text or img" })
        }

        if (img) {
            const uploadedRespone = await cloudinary.uploader.upload(img)
            img = uploadedRespone.secure_url;
        }

        const newPost = new Post({
            user: userId,
            text,
            img
        })
        await newPost.save();
        res.status(201).json(newPost)

    } catch (error) {
        console.log(`Error in createPost controller ${error}`, error.stack);
        res.status(500).json({ error: "Internal server error" })

    }
}

export const deletePost = async (req, res) => {
    try {
        const { id } = req.params;
        const post = await Post.findOne({ _id: id })

        if (!post) {
            return res.status(400).json({ error: "post not found" })
        }

        if (post.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ error: "you are not authorized to delete this post" })
        }

        if (post.img) {
            const imgId = post.img.split("/").pop().split(".")[0];
            await cloudinary.destroy(imgId)
        }
        await Post.findByIdAndDelete({ _id: id })
        res.status(200).json({ message: "post deleted success" });


    } catch (error) {
        console.log(`Error in delete post controller ${error}`);
        res.status(500).json({ error: "Internal server error" })
    }
}

export const createComment = async (req, res) => {
    try {
        const { text } = req.body;
        const postId = req.params.id;
        const userId = req.user._id;

        if (!text) {
            return res.status(400).json({ error: "comment text is required" })
        }

        const post = await Post.findOne({ _id: postId });

        if (!post) {
            return res.status(404).json({ error: "post not found" })
        }

        const comment = {
            user: userId,
            text
        }

        post.comments.push(comment)
        await post.save();
        res.status(200).json(post)

    } catch (error) {
        console.log(`Error in create comment controller ${error} `,);
        res.status(500).json({ error: "Internal server error" })
    }
}

export const likeUnlikePost = async (req, res) => { 
    try {
        const userId = req.user._id;
        const postId = req.params.id;

        const post = await Post.findOne({ _id: postId });

        if (!post) {
            return res.status(404).json({ error: "post not found" })
        }

        const userlikedPost = post.likes.includes(userId);

        if (userlikedPost) {
            await Post.updateOne({ _id: postId }, { $pull: { likes: userId } })
            await User.updateOne({ _id: userId }, { $pull: { likedPosts: postId } })

            const updatedLikes = post.likes.filter((id) => id.toString() !== userId.toString())
            res.status(200).json(updatedLikes)
        }
        else {
            post.likes.push(userId)
            await User.updateOne({ _id: userId }, { $push: { likedPosts: postId } })
            await post.save()

            const notification = new Notification({
                from: userId,
                to: post.user,
                type: "like"
            })
            await notification.save();
            const updatedLikes = post.likes;
            res.status(200).json(updatedLikes)
        }

    } catch (error) {
        console.log(`Error in likeUnlikePost controller ${error} `);
        res.status(500).json({ error: "Internal server error" })
    }
}

export const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 })
            .populate({
                path: "user",
                select: "-password"
            })
            .populate({
                path: "comments.user",
                select: ["-password", "-email", "-followers", "-following", "-bio", "-link"]
            })
        if (posts.length === 0) {
            return res.status(400).json([])
        }
        res.status(200).json(posts)

    } catch (error) {
        console.log(`Error in getAllPosts controller ${error} `);
        res.status(500).json({ error: "Internal server error" })
    }
}

export const getLikedPosts = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById({ _id: userId })

        if (!user) {
            return res.status(200).json({ error: "User not found" })
        }

        const likedPosts = await Post.find({ _id: { $in: user.likedPosts } })
            .populate({
                path: "user",
                select: "-password"
            })
            .populate({
                path: "comments.user",
                select: ["-password", "-email", "-followers", "-following", "-bio", "-link"]
            })

        res.status(200).json(likedPosts)

    } catch (error) {
        console.log(`Error in getLikedPosts controller ${error} `);
        res.status(500).json({ error: "Internal server error" })
    }
}

export const getFollowingPosts = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById({ _id: userId })

        if (!user) {
            return res.status(400).json({ error: "user not found" })
        }

        const following = user.following;

        const feedPosts = await Post.find({ user: { $in: following } }).sort({ createdAt: -1 })
            .populate({
                path: "user",
                select: "-password"
            })
            .populate({
                path: "comments.user",
                select: ["-password", "-email", "-followers", "-following", "-bio", "-link"]
            })

        res.status(200).json(feedPosts)

    } catch (error) {
        console.log(`Error in getFollowingPosts controller ${error} `);
        res.status(500).json({ error: "Internal server error" })
    }
}

export const getUserPosts = async (req, res) => {
    try {
        const { username } = req.params;
        const user = await User.findOne({ username })

        if (!user) {
            return res.status(404).json({ error: "user not found" })
        }

        const posts = await Post.find({ user: user._id }).sort({ createdAt: -1 })
            .populate({
                path: "user",
                select: "-password"
            })
            .populate({
                path: "comments.user",
                select: ["-password", "-email", "-followers", "-following", "-bio", "-link"]
            })

        res.status(200).json(posts)

    } catch (error) {
        console.log(`Error in getUserPosts controller:${error}`);
        res.status(500).json({ error: "Internal server error" })

    }
}