import { createContext, useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-hot-toast";  
import { io } from "socket.io-client";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [authUser, setAuthUser] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [socket, setSocket] = useState(null);

    // CHECK IF USER IS AUTHENTICATED AND IF SO, SET THE USER DATA AND CONNECT THE SOCKET
    const checkAuth = async () => {
    try {
        const { data } = await axiosInstance.get("/auth/check");
        setAuthUser(data);
        connectSocket(data);
    } catch (error) {
        console.log("Error in checkAuth:", error.response?.data?.message);
    }
    }

    // HANDLE USER AUTHENTICATION AND SOCKET CONNECTION
    const signUp = async (credentials) => {
    try {
        const { data } = await axiosInstance.post("/auth/signup", credentials);
        setAuthUser(data);
        connectSocket(data);
        toast.success("Account created successfully");
    } catch (error){
        toast.error(error.response?.data?.message);
    }
    }

    // HANDLE USER AUTHENTICATION AND SOCKET CONNECTION
    const login = async (credentials) => {
    try {
        const { data } = await axiosInstance.post(`/auth/login`, credentials);
        setAuthUser(data);
        connectSocket(data);
        toast.success("Logged in successfully");
    } catch (error) {
        toast.error(error.response?.data?.message);
    }
    }

    // HANDLE USER LOGOUT AND SOCKET DISCONNECTION
    const logout = async () => {
    try {
        await axiosInstance.post("/auth/logout");
        setAuthUser(null);
        toast.success("Logged out successfully");
        if (socket?.connected) socket.disconnect();
    } catch (error) {
        toast.error(error.response?.data?.message);
    }
    }

    // HANDLE USER PROFILE UPDATES
    const updateProfile = async (credentials) => {
    try {
        const { data } = await axiosInstance.put("/auth/update-profile", credentials);
        console.log(data);
        setAuthUser(data);
        toast.success("Profile updated successfully");
    } catch (error) {
        toast.error(error.response?.data?.message);
    }
    }

    // HANDLE SOCKET CONNECTION AND ONLINE USERS UPDATES
    const connectSocket = (userData) => {
    if (!userData || socket?.connected) return;
    const newSocket = io(import.meta.env.VITE_BACKEND_URL, {
        query: {
            userId: userData._id,
        },
        transports: ["polling"],
    });
    newSocket.connect();
    setSocket(newSocket);
    newSocket.on("getOnlineUsers", (userIds) => {
        setOnlineUsers(userIds);
    })
    }

    // WHENEVER PAGE RENDER IT CHECK AUTHENTICATED USER OF NOT
    useEffect(() => {
    checkAuth();
    }, []);

    const value = {
    authUser,
    onlineUsers,
    socket,
    signUp,
    login,
    logout,
    updateProfile
    }

    return (
      <AuthContext.Provider value={value}>
        {children}
      </AuthContext.Provider>
    );

}
