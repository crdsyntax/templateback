import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { ChatService } from "../services/chat.service";
import { Logger } from "@nestjs/common";

@WebSocketGateway({ cors: { origin: "*" }, namespace: "chat" })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(ChatGateway.name);

  @WebSocketServer()
  server: Server;

  constructor(private readonly chatService: ChatService) {}

  handleConnection(client: Socket) {
    const userId = client.handshake.query.userId as string;
    if (userId) {
      client.join(userId);
      this.logger.log(`✅ Client connected: ${client.id} as ${userId}`);
    } else {
      this.logger.warn(`❌ Client connected without userId: ${client.id}`);
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`❌ Client disconnected: ${client.id}`);
  }

  @SubscribeMessage("send_message")
  async handleMessage(
    @MessageBody()
    data: {
      senderId: string;
      recipientId: string;
      encryptedMessage: any;
      encryptedKey: string;
    },
    @ConnectedSocket() client: Socket
  ) {
    await this.chatService.saveMessage(data);

    this.server.to(data.recipientId).emit("receive_message", data);
    this.server.to(data.senderId).emit("receive_message", data);
  }

  @SubscribeMessage("load_messages")
  async loadMessages(
    @MessageBody()
    { userId, recipientId }: { userId: string; recipientId: string },
    @ConnectedSocket() client: Socket
  ) {
    const messages = await this.chatService.getMessagesBetween(
      userId,
      recipientId
    );
    client.emit("receive_messages_history", messages);
  }
}
