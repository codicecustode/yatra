import http from "http";
import app from "./app";
import { connectDB } from "./config/db";
import { connectRedis } from "./config/redis";
import { initSocket } from "./sockets/socket.handler";

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

const startServer = async () => {
  try {
    await connectDB();
    await connectRedis();

    // Initialize socket connections
    initSocket(server);

    server.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    throw new Error("Failed to start server: " + (error as Error).message);
    process.exit(1);
  }
};

startServer();
