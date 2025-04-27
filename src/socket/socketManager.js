import { getUserRole } from "../utils/auth.js";
import User from "../module/user/userModel.js";
import Message from "./messageModel.js";

// initializeSocket.js

const initializeSocket = (io) => {
  const PUBLIC_CHANNEL = "public";

  io.on("connection", async (socket) => {
    console.log("User connected:", socket.id);

    socket.on("join", async ({ userId, token }) => {
      socket.join(PUBLIC_CHANNEL);

      // Load message history and include the username of each message sender
      const history = await Message.find({ channel: PUBLIC_CHANNEL })
        .sort({ timestamp: 1 }) // oldest first
        .limit(50)
        .lean()
        .populate("userId", "username"); // Populate username field from User model

      socket.emit("joined", { channel: PUBLIC_CHANNEL, history });
    });

    socket.on("typing", ({ userId, username }) => {
      // Broadcast to others that someone is typing
      socket.broadcast.to(PUBLIC_CHANNEL).emit("typing", { userId, username });
    });

    socket.on("message", async ({ message, userId, senderRole, username }) => {
      try {
        // If username is not provided, fetch it from the User model
        const user = await User.findById(userId).select("username role");
        if (!user) {
          return console.error("User not found");
        }

        const newMessage = await Message.create({
          message,
          userId: user._id,
          senderRole: user.role,
          channel: PUBLIC_CHANNEL,
        });

        // Emit the message to all connected users (with username)
        io.to(PUBLIC_CHANNEL).emit("message", {
          message: newMessage.message,
          userId: {
            _id: user._id,
            username: user.username,
          },
          senderRole: user.role,
          channel: PUBLIC_CHANNEL,
          timestamp: newMessage.createdAt,
        });
      } catch (err) {
        console.error("Error handling message:", err);
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};

export default initializeSocket;
