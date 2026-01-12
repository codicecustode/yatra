import { Schema, model, Types, Document } from "mongoose";

export interface IMessage extends Document {
  sender: Types.ObjectId;
  receiver: Types.ObjectId;

  content?: string;

  file?: {
    url: string;
    type: "image" | "pdf" | "other";
  };

  isDeleted: boolean;

  status: "sent" | "delivered" | "read";

  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new Schema<IMessage>(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    receiver: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    content: {
      type: String,
      trim: true,
      maxlength: 2000,
    },

    file: {
        url: { type: String },
        type: { type: String, enum: ["image", "pdf", "other"] }
      },
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);


export const Message = model<IMessage>("Message", MessageSchema);
