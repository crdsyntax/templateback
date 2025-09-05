import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ChatMessage } from "../schemas/chat.schema";

interface dataEncrypted {
  senderId: string;
  recipientId: string;
  encryptedMessage: any;
  encryptedKey: string;
}

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(ChatMessage.name)
    private chatModel: Model<ChatMessage>,
  ) {}

  async saveMessage(msg: dataEncrypted) {
    const newMessage = new this.chatModel(msg);
    return newMessage.save();
  }

  async getMessagesBetween(userA: string, userB: string) {
    return this.chatModel
      .find({
        $or: [
          { senderId: userA, recipientId: userB },
          { senderId: userB, recipientId: userA },
        ],
      })
      .sort({ createdAt: 1 })
      .exec();
  }
}
