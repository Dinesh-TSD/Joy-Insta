// middleware/upload.js
import multer from "multer";
import path from 'path'
const storage = multer.diskStorage({
  destination: "uploads/reels/",
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}${ext}`);
  }
});

const upload = multer({ storage });

export default upload;
