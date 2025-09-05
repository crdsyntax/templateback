import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema({ timestamps: true })
export class ChatMessage extends Document {
  @Prop({ required: true })
  senderId: string;

  @Prop({ required: true })
  recipientId: string;

  @Prop({ type: Object, required: true })
  encryptedMessage: {
    iv: number[];
    content: number[];
  };

  @Prop({ type: String, required: true })
  encryptedKey: string;
}

export const ChatMessageSchema = SchemaFactory.createForClass(ChatMessage);
