import { Types, Document } from "mongoose";

export interface IMessage extends Document {
  sender: Types.ObjectId;
  receiver: Types.ObjectId;
  content: string;
  file?: string;
  isDeleted?: boolean;
}
