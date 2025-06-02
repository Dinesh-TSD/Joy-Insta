import mongoose from "mongoose";

const reelSchema = new mongoose.Schema({
  videoUrl: { type: String, required: true },
  caption: { type: String },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  comments: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      text: String,
      createdAt: { type: Date, default: Date.now }
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

const Reel = mongoose.model("Reel", reelSchema);

export default Reel;