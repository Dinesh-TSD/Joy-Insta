import express from "express"
import protectRoute from "../middleware/protectRoute.js";
import {
    createComment,
    createPost,
    deletePost,
    getAllPosts,
    getAllReels,
    getFollowingPosts,
    getLikedPosts, getUserPosts, likeUnlikePost
} from "../controllers/postController.js";
import  { uploadPost } from "../middleware/upload.js";

const router = express.Router();

router.get("/allposts", protectRoute, getAllPosts)
router.get("/allreels", protectRoute, getAllReels)
router.post("/create", protectRoute,uploadPost.single('file'), createPost)
router.post("/like/:id", protectRoute, likeUnlikePost)
router.post("/comment/:id", protectRoute, createComment) 
router.get("/likes/:id", protectRoute, getLikedPosts) 
router.get("/following", protectRoute, getFollowingPosts)
router.get("/user/:username", protectRoute, getUserPosts)
router.delete("/:id", protectRoute, deletePost)

export default router;