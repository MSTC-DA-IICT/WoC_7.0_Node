import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173"], 
        methods: ["GET", "POST"],
    },
});

io.on("connection", (socket) => {
    console.log("A user connected", socket.id);
    
    io.emit("hello", "world");

    socket.on("connect_error", (err) => {
        console.error("Socket connection error:", err.message);
    });
    


    io.on("sendAnswer", (data) => {
        console.log("Received 'sendAnswer' event:", data); // Debugging
        io.emit("newAnswer", data);
    });

    socket.on("disconnect", () => {
        console.log("A user disconnected", socket.id);
    });
});

export { io, app, server };
