import User from "../models/userModel.js"
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js"

export const signup = async (req, res) => {
    try {
        const { username, fullName, email, password } = req.body;

        const emailRegex =  /^[^\s@]+@[^\s@]+\.[^\s@]+$/ ;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: "Invalid email format" })
        }

        const existingEmail = await User.findOne({ email })
        const existingUsername = await User.findOne({ username })

        if (existingEmail || existingUsername) {
            return res.status(400).json({ error: "Already Existing user or email" })
        }

        if (password.length < 6) {
            return res.status(400).json({ error: " Password must have 6 chart length" })
        }

        //hashing the password 
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new User({
            username,
            fullName,
            email,
            password: hashedPassword,
        })

        if (newUser) {
            generateToken(newUser._id, res)
            await newUser.save();
            res.status(200).json({
                message: "signup sucess",
            })
        } else {
            res.status(400).json({ error: "Invalid user data" })
        }

    } catch (error) {
        console.log(`Error in signup controller: ${error}`);
        res.status(500).json({ error: "Internal server error" })
    }
}

export const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username })
        const isPasswordCorrect = await bcrypt.compare(password, user?.password || "")

        if (!user || !isPasswordCorrect) {
            return res.status(400).json({ error: "Invalid user or Password" })
        }

        generateToken(user._id, res)

        res.status(200).json({
            message: "Login sucess",
        })
    } catch (error) {
        console.log(`Error in login controller :${error}`);
        res.status(500).json({ error: "Internal server error" })
    }
}

export const logout = async (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 })
        res.status(200).json({ message: "Logout success" })
    } catch (error) {
        console.log(`Error in logout controller: ${error}`);
        res.status(500).json({ error: "Internal server error" })
    }
}

export const getMe = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.user._id }).select("-password")
        res.status(200).json({user})
    } catch (error) {
        console.log(`Error in getme controller: ${error}`);
        res.status(500).json({ error: "Internal server error" })
    }
}