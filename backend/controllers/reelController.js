import Reel from "../models/reelModel.js"

export const createReel = async (req, res) => {
    try {
        const { caption, userId } = req.body;
        const videoUrl = `/uploads/reels/${req.file.filename}`;

        const newReel = new Reel({ videoUrl, caption, userId });
        await newReel.save();

        res.status(201).json(newReel);
    } catch (error) {
        console.log(`Error in createReel controller: ${error}`);
        res.status(500).json({ error: "Internal server error" })
    }
}