import { createContext, useContext, useState, useEffect } from "react";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { AuthContext } from "./AuthContext";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
    const [users, setUsers] = useState([]);
    const [messages, setMessages] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [unseenMessages, setUnseenMessages] = useState({});
    const { socket } = useContext(AuthContext);

    // GET ALL USERS
    const getUsers = async () => {
        try {
            const { data } = await axiosInstance.get("/messages/users");
            setUsers(data.users);
            setUnseenMessages(data.unseenMessages);
        } catch (error) {
            toast.error(error.response?.data?.message);
        }
    };

    // GET MESSAGES FOR SELECTED USER
    const getMessages = async (userId) => {
        try {
            const { data } = await axiosInstance.get(`/messages/${userId}`);
            setMessages(data.selectedUserMessages);
        } catch (error) {
            toast.error(error.response?.data?.message);
        }
    };

    // SEND MESSAGES TO SELECTED USER
    const sendMessage = async (messageData) => {
        try {
            const { data } = await axiosInstance.post(
                `/messages/send/${selectedUser._id}`,
                messageData
            );
            setMessages((prevMessages) => [...prevMessages, data]);
        } catch (error) {
            toast.error(error.response?.data?.message);
        }
    };

    // SUBSCRIBE TO MESSAGES FOR SELECTED USER
    const subscribeToMessages = async () => {
        if (!socket) return;

        socket.on("newMessage", (newMessage) => {
            if (selectedUser && newMessage.senderId === selectedUser._id) {
                newMessage.seen = true;
                setMessages((prevMessages) => [...prevMessages, newMessage]);
                axiosInstance.put(`/messages/mark/${newMessage._id}`);
            } else {
                setUnseenMessages((prevUnseenMessages) => ({
                    ...prevUnseenMessages,
                    [newMessage.senderId]: prevUnseenMessages[newMessage.senderId]
                        ? prevUnseenMessages[newMessage.senderId] + 1
                        : 1,
                }));
            }
        });
    };

    // UNSUBSCRIBE FROM MESSAGES
    const unsubscribeFromMessages = () => {
        if (socket) socket.off("newMessage");
    };

    useEffect(() => {
        subscribeToMessages();
        return () => unsubscribeFromMessages();
    }, [socket, selectedUser]);

    const value = {
        messages,
        users,
        selectedUser,
        unseenMessages,
        getUsers,
        getMessages,
        sendMessage,
        setSelectedUser,
        setUnseenMessages,
    };

    return (
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    );

};
