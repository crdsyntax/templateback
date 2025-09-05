import { Module } from "@nestjs/common";
import { ChatService } from "./services/chat.service";
import { ChatController } from "./controllers/chat.controller";
import { ChatGateway } from "./gateways/chat.gateway";
import { MongooseModule } from "@nestjs/mongoose";
import { ChatMessage, ChatMessageSchema } from "./schemas/chat.schema";

@Module({
  imports: [MongooseModule.forFeature([
        { name: ChatMessage.name, schema: ChatMessageSchema }
      ])],
  providers: [ChatService,ChatGateway],
  controllers: [ChatController],
})
export class ChatModule {}
