import User from "../models/user.model.js";
import Message from "../models/message.model.js"
import cloudinary from "../lib/cloudinary.js";
import { io, userSocketMap } from "../lib/socket.js";

// GET ALL USERS EXCEPT THE LOGGED-IN USER
export const getUsers = async (req,res)=>{
    try {
        const loggedInUserId=req.user._id;

        const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");

        // COUNT NUMBER OF MESSAGES NOT SEEN
        const unseenMessages={}
        const promises = filteredUsers.map(async (user)=>{
            const messages = await Message.find({
                senderId: user._id,
                receiverId : loggedInUserId,
                seen: false
            });
            if (messages.length>0){
                unseenMessages[user._id]= messages.length;
            }
        })
        await Promise.all(promises);

        res.status(200).json({ users: filteredUsers, unseenMessages });
    } catch (error) {
        console.error("Error in getUsers: ", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}

// GET ALL MESSAGES FOR SELECTED USER
export const getMessages= async (req,res)=>{
    try {
        const { id: selectedUserId } = req.params;

        const myId = req.user._id;

        const messages = await Message.find({ 
            $or : [ 
                { senderId: selectedUserId, receiverId: myId },
                { senderId: myId, receiverId: selectedUserId } 
            ] 
        });
        await Message.updateMany({
            senderId : selectedUserId,
            receiverId : myId 
        }, { seen : true });

        res.status(200).json({ selectedUserMessages: messages }); 
    } catch (error) {
        console.log("Error in getMessages controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
}

// MARK MESSAGES AS SEEN USING MESSAGE ID
export const markMessageAsSeen = async (req,res)=>{
    try {
        const { id }=req.params;

        await Message.findByIdAndUpdate(id, { seen: true });

        res.status(200).json({ success: true });
    } catch (error) {
        console.log("Error in markMessageAsSeen controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
}

// SEND MESSAGES TO SELECTED USER
export const sendMessage = async (req,res)=>{
    try {
        const { text, image } = req.body;

        const { id: receiverId } = req.params;
        const senderId = req.user._id;

        let imageUrl;
        if (image){
            // UPLOAD BASE64 IMAGE TO CLOUDINARY
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = await Message.create({
            senderId,
            receiverId,
            text,
            image : imageUrl
        })

        //EMIT THE NEW MESSAGE TO THE RECIEVER'S SOCKET
        const receiverSocketId = userSocketMap[receiverId];
        if (receiverSocketId){
            io.of("/api").to(receiverSocketId).emit("newMessage", newMessage);
        }

        res.status(200).json(newMessage);
    } catch (error) {
        console.log("Error in sendMessage controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
}