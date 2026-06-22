const dotenv = require("dotenv");
dotenv.config();
const app = require("./app");
const connectDB = require("./config/db");
const { Server } = require("socket.io");
const { initializeSocket } = require("./socket/socket");

connectDB();

const PORT = process.env.PORT || 5000;

const http = require("http");

const server = http.createServer(app);

//initiaize the socket io

const io = new Server(server, {
  cors: {
    origin: "https://smart-civic-portal-1.onrender.com",
  },
});

initializeSocket(io);

//for the connection of the sockets

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("joinRoom", (userId) => {
    socket.join(userId);
    console.log(`${socket.id} joined room ${userId}`);
  });

  socket.on("disconnect", () => {
    console.log(`User Disconnected${socket.id}`);
  });
});

server.listen(PORT, () => {
    console.log(`Server is Running on PORT ${PORT}`);
});
