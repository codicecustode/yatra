import {
    createMessageRepo,
    findChatHistoryRepo,
    findMessageByIdRepo,
    updateMessageRepo,
    softDeleteMessageRepo
  } from "../repositories/message.repository";
  import { Types } from "mongoose";
  
  export const createMessageService = async (
    senderId: string,
    receiverId: string,
    content?: string,
    file?: {
        url: string;
        type: "image" | "pdf" | "other";
    }   
  ) => {
    if (!content && !file) {
      throw new Error("Message must contain text or file");
    }
  
    return createMessageRepo({
      sender: new Types.ObjectId(senderId),
      receiver: new Types.ObjectId(receiverId),
      content,
      file
    });
  };
  
  export const getChatService = (myId: string, otherId: string) => {
    return findChatHistoryRepo(myId, otherId);
  };
  
  export const updateMessageService = async (
    messageId: string,
    userId: string,
    content: string
  ) => {
    const msg = await findMessageByIdRepo(messageId);
  
    if (!msg) throw new Error("Message not found");
    if (msg.sender.toString() !== userId.toString()) throw new Error("Not authorized to edit");
  
    return updateMessageRepo(messageId, content);
  };
  
  export const deleteMessageService = async (
    messageId: string,
    userId: string
  ) => {
    const msg = await findMessageByIdRepo(messageId);
  
    if (!msg) throw new Error("Message not found");
    if (msg.sender.toString() !== userId.toString()) throw new Error("Not authorized to delete");
  
    return softDeleteMessageRepo(messageId);

  };
  