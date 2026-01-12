import { Request, Response } from "express";
import {
  createMessageService,
  getChatService,
  updateMessageService,
  deleteMessageService,
} from "../services/message.service";
import {uploadFileToCloudinary} from "../utils/cloudinary.util";

import {
  emitNewMessage,
  emitUpdateMessage,
  emitDeleteMessage,
} from "../sockets/socket.handler";

export const createMessage = async (req: Request, res: Response) => {
  try {
    const senderId = (req as any).user.id;
    const { receiverId, content } = req.body;

    let fileData = undefined;

    if (req.file) {
      let fileType: "image" | "pdf" = "image";

      if (req.file.mimetype === "application/pdf") {
        fileType = "pdf";
      }

      const fileUrl = await uploadFileToCloudinary(req.file.path);

      console.log("File uploaded to Cloudinary:", fileUrl);

      fileData = {
        url: fileUrl,
        type: fileType,
      };
    }

    const message = await createMessageService(
      senderId,
      receiverId,
      content,
      fileData
    );

    emitNewMessage(receiverId, {
      messageId: message._id,
      content: message.content,
      file: message.file,
      sender: message.sender,
    });

    return res.status(201).json(message);
  } catch (err: any) {
    return res.status(400).json({ message: err.message });
  }
};

export const getMessages = async (req: Request, res: Response) => {
  try {
    const myId = (req as any).user.id;
    const { otherUserId } = req.params as { otherUserId: string };

    const messages = await getChatService(myId, otherUserId);
    return res.status(200).json(messages);
  } catch (err: any) {
    return res.status(400).json({ message: err.message });
  }
};

export const updateMessage = async (req: Request, res: Response) => {
  try {
    const { messageId } = req.params as { messageId: string };
    const { content } = req.body;

    const updated = await updateMessageService(
      messageId,
      (req as any).user.id,
      content
    );

    if (!updated) {
      return res.status(404).json({ message: "Message not found" });
    }

    emitUpdateMessage(updated.receiver.toString(), {
      messageId: updated._id,
      content: updated.content,
      sender: updated.sender,
    });

    return res.status(200).json(updated);
  } catch (err: any) {
    return res.status(400).json({ message: err.message });
  }
};

export const deleteMessage = async (req: Request, res: Response) => {
  try {
    const { messageId } = req.params as { messageId: string };

    const deleted = await deleteMessageService(messageId, (req as any).user.id);

    if (!deleted) {
      return res.status(404).json({ message: "Message not found" });
    }

    emitDeleteMessage(deleted.receiver.toString(), {
      messageId: deleted._id,
      sender: deleted.sender,
    });

    return res.status(200).json(deleted);
  } catch (err: any) {
    return res.status(400).json({ message: err.message });
  }
};
