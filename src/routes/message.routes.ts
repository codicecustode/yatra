import { Router } from "express";
import {
  createMessage,
  getMessages,
  updateMessage,
  deleteMessage,
} from "../controllers/message.controller";
import { authenticate } from "../middleware/auth.middleware";
import { upload } from "../middleware/upload.middleware";

const router = Router();

// Create a new message 
router.post("/", authenticate, upload.single('file'), createMessage);

// Get chat messages with a specific user
router.get("/:otherUserId", authenticate, getMessages);

// Update message content by message ID
router.patch("/:messageId", authenticate, updateMessage);

// Soft delete a message by message ID
router.delete("/:messageId", authenticate, deleteMessage);

export default router;
