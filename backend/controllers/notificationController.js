import Notification from "../models/notificModel.js";

export const getNotifications = async (req,res)=>{
    try {

        const userId= req.user.id;
        const notifications = await Notification.find({to:userId})
        .sort({ createdAt: -1 })
        .populate({
            path:"from",
            select:" username profileImg"
        })
        await Notification.updateMany({to:userId},{read:true})

        res.status(200).json(notifications);
    } catch (error) {
        console.log(`Error in getNotifications controller:${error}`);
        res.status(500).json({error:"Internal server error"})
    }
}

export const deleteNotifications = async (req,res)=>{
    try {
        const userId = req.user._id;

        await Notification.deleteMany({to:userId})
        res.status(200).json({message:"notification deleted success"})
    } catch (error) {
        console.log(`Error in deleteNotifications controller:${error}`);
        res.status(500).json({error:"Internal server error"})
    }
}