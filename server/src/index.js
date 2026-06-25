import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { connectDB } from "./lib/db.js";
import { app, server } from "./lib/socket.js";

dotenv.config();

// MIDDLEWARE SETUP
app.use(express.json({ limit: "4mb" }));
app.use(cookieParser());
app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
}));
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// CONNECT TO MONGODB DATABASE
await connectDB();

if (process.env.NODE_ENV !== "production") {
    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => {
        console.log(`Server is running on port: ${PORT}`);
    });
}

export default server;
