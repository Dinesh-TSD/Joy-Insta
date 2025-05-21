import express from "express"
import dotenv from "dotenv"
import authRoute from "./routes/authRoute.js"
import usersRoute from "./routes/usersRoute.js"
import postRoute from "./routes/postRoute.js"
import notificationRoute from "./routes/notificRoute.js"
import connectDB from "./db/connectDB.js";
import cookieParser from "cookie-parser";
import cloudinary from "cloudinary"
import cors from "cors"
import path from "path"

dotenv.config();
const __dirname = path.resolve()
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET_KEY
})

const app = express();
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))
app.use(express.urlencoded({
    extended: true,
    limit: "20mb"
}))
const PORT = process.env.PORT;

app.use(express.json(
    {
        limit: "20mb"
    }
));
app.use(cookieParser());

app.use("/api/auth", authRoute);
app.use("/api/users", usersRoute)
app.use("/api/posts", postRoute)
app.use("/api/notifications", notificationRoute)
 
if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "/frontend/dist")))
    app.get(/"*"/, (req, res) => {
        res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"))
    })
}

app.listen(PORT, () => {
    console.log(`server is running on port ${PORT} `);
    connectDB();
})  