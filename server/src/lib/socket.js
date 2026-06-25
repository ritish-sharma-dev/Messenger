import { Server } from "socket.io";
import http from "http";
import express from "express";

// CREATE EXPRESS APP AND HTTP SERVER
const app=express();
const server=http.createServer(app);

import dotenv from "dotenv";
dotenv.config();

// INITIALIZE SOCKET.IO SERVER
const io = new Server(server, {
    cors : {
        origin: process.env.CLIENT_URL || "http://localhost:5173",
        credentials: true
    }
})

// STORE ONLINE USERS
const userSocketMap = {};

// SOCKET IO CONNECTION HANDLER
io.on("connection",(socket)=>{
    // READ THEIR USERID FROM THE QUERY SENT BY FRONTEND
    const userId = socket.handshake.query.userId;         
    console.log("User Connected", userId);
    if  (userId) userSocketMap[userId] = socket.id;

    // EMIT ONLINE USERS TO ALL CONNECTED CLIENTS
    // TELL ALL CLIENTS WHO IS ONLINE
    io.emit("getOnlineUsers",Object.keys(userSocketMap)); 

    // HANDLE DISCONNECTION
    socket.on("disconnect",()=>{
        console.log("User Disconnected",userId);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers",Object.keys(userSocketMap));
    })
});

export { io, app, userSocketMap, server };