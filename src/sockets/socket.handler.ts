import { Server } from "socket.io";
import { verifyAccessToken } from "../utils/jwt.util";

let io: Server;

export const initSocket = (server: any) => {
  io = new Server(server, {
    cors: { origin: "*" },
  });

  // Socket authentication middleware
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token;

      if (!token) {
        return next(
          new Error("No Access Token Provided for Socket Connection")
        );
      }

      const user = verifyAccessToken(token);

      (socket as any).user = user;

      next();
    } catch (err: any) {
      if (err.name === "TokenExpiredError") {
        return next(new Error("Token Expired for Socket Connection"));
      }

      return next(new Error("Invalid Token for Socket Connection"));
    }
  });

  io.on("connection", (socket) => {
    const userId = (socket as any).user.userId;

    socket.join(userId);

    console.log(`User connected: ${userId}`);

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${userId}`);
    });
  });
};

export const emitNewMessage = (receiverId: string, message: any) => {
  if (!io) return;

  io.to(receiverId).emit("new_message", message);
};


export const emitUpdateMessage = (receiverId: string, message: any) => {
  if (!io) return;
  io.to(receiverId).emit("message_updated", message);
};

export const emitDeleteMessage = (receiverId: string, message: any) => {
  if (!io) return;
  io.to(receiverId).emit("message_deleted", message);
};
