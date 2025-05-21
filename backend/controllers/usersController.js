import Notification from "../models/notificModel.js";
import User from "../models/userModel.js";
import cloudinary from "cloudinary"

export const getProfile = async (req, res) => {
    try {
        const { username } = req.params;
        const user = await User.findOne({ username })

        if (!user) {
            return res.status(400).json({ error: "user not found" })
        }

        res.status(200).json(user)
    } catch (error) {
        console.log(`Error in get user profile controller: ${error}`);
        res.status(500).json({ error: "Internal server error" })
    }
}

export const followUnfollowUser = async (req, res) => {
    try {
        const { id } = req.params;
        
        const userToModify = await User.findById(id)
        const currentUser = await User.findById(req.user._id)

        if (id === req.user._id) {
            return res.status(400).json({ error: "you can`t follow/unfollow" })
        }

        if (!userToModify || !currentUser) {
            return res.status(400).json({ error: "user not found" })
        }

        const isFollowing = currentUser.following.includes(id);

        if (isFollowing) {
            //UnFollow
            await User.findByIdAndUpdate({ _id: id }, { $pull: { followers: req.user._id } })
            await User.findByIdAndUpdate({ _id: req.user._id }, { $pull: { following: id } })
            res.status(200).json({ message: "Unfollow success" })

        } else {
            //Follow
            await User.findByIdAndUpdate({ _id: id }, { $push: { followers: req.user._id } })
            await User.findByIdAndUpdate({ _id: req.user._id }, { $push: { following: id } })
            //send notification
            const newNotification = new Notification({
                type: "follow",
                from: req.user._id,
                to: userToModify._id
            })
            await newNotification.save();
            res.status(200).json({ message: "Follow success" })
        }
    } catch (error) {
        console.log(`Error in follow & Unfollow controller: ${error}`);
        res.status(500).json({ error: "Internal server error" })
    }
}

export const getSuggestedUsers = async (req, res) => {
    try {
        const userId = req.user._id;
        const userFollowedByMe = await User.findById({ _id: userId }).select("-password")

        const users = await User.aggregate([
            {
                $match: {
                    _id: { $ne: userId }
                }
            },
            {
                $sample: {
                    size: 10
                }
            }
        ])

        const fillteredUser = users.filter((user) => !userFollowedByMe.following.includes(user._id))
        const suggestedUsers = fillteredUser.slice(0, 4)

        suggestedUsers.forEach((user) => (user.password = null))
        res.status(200).json(suggestedUsers);

    } catch (error) {
        console.log(`Error in SuggestedUser controller: ${error}`);
        res.status(500).json({ error: "Internal server error" })
    }
}

export const updateUser = async (req, res) => {
    try {
        const userId = req.user._id;
        const { username, fullName, email, currentPassword, newPassword, bio, link } = req.body;
        let { profileImg, coverImg } = req.body;


        let user = await User.findById({ _id: userId })

        if (!user) {
            return res.status(400).json({ error: "user not found" })
        }

        if ((!currentPassword && newPassword) || (!newPassword && currentPassword)) {
            return res.status(400).json({ error: "Please provied both password" })
        }

        if (currentPassword && newPassword) {
            const isMatch = await bcrypt.compare(currentPassword, user.password)
            if (!isMatch) {
                return res.status(400).json({ error: "current password is incorrect" })
            }
            if (newPassword.length < 6) {
                return res.status(400).json({ error: "password must have atleast 6 char" })
            }

            const salt = await bcrypt.genSalt(10)
            user.password = await bcrypt.hash(newPassword, salt)
        }

        if (profileImg) {
            if (user.profileImg) {
                await cloudinary.uploader.destroy(user.profileImg.split("/").pop().split(".")[0])
            }
            const uploadedResponse = await cloudinary.uploader.upload(profileImg)
            profileImg = uploadedResponse.secure_url;
        }
        if (coverImg) {
            if (user.coverImg) {
                await cloudinary.uploader.destroy(user.coverImg.split("/").pop().split(".")[0])
            }
            const uploadedResponse = await cloudinary.uploader.upload(coverImg)
            coverImg = uploadedResponse.secure_url;
        }
        
        user.fullName = fullName || user.fullName;
        user.email = email || user.email;
        user.username = username || user.username;
        user.bio = bio || user.bio;
        user.link = link || user.link;
        user.profileImg = profileImg || user.profileImg;
        user.coverImg = coverImg || user.coverImg;

        user = await user.save();

        user.password = null;
        return res.status(200).json(user)

    } catch (error) {
        console.log(`Error in updateuser controller: ${error}`);
        res.status(500).json({ error: "Internal server error" })
    }
}