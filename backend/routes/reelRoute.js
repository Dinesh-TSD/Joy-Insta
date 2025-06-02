import express from "express"
import protectRoute from "../middleware/protectRoute.js";
import { createReel } from "../controllers/reelController.js";
import upload from '../middleware/upload.js'

const router = express.Router();

router.post("/create", protectRoute, upload.single("video"), createReel)

export default router;