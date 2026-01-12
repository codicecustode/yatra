import { Message } from "../models/message.model";
import { Types } from "mongoose";

export const createMessageRepo = (data: any) => {
  return Message.create({
    sender: new Types.ObjectId(data.sender),
    receiver: new Types.ObjectId(data.receiver),
    content: data.content,
    file: data.file
  });
};

export const findChatHistoryRepo = (myId: string, otherUserId: string) => {
  const myIdObj = new Types.ObjectId(myId);
  const otherUserIdObj = new Types.ObjectId(otherUserId);
  return Message.find({
    isDeleted: false,
    $or: [
      { sender: myIdObj, receiver: otherUserIdObj },
      { sender: otherUserIdObj, receiver: myIdObj }
    ]
  }).sort({ createdAt: 1 });
};

export const findMessageByIdRepo = (id: string) => {
  return Message.findById(id);
};

export const updateMessageRepo = (id: string, content: string) => {
  return Message.findByIdAndUpdate(id, { content }, { new: true });
};

export const softDeleteMessageRepo = (id: string) => {
  return Message.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
};
