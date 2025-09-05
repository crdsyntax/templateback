import { Injectable } from "@nestjs/common";
import EventEmitter2 from "eventemitter2";
import { EventFailure } from "../schemas/event-failure.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

@Injectable()
export class SafeEventEmitter {
  constructor(
    private readonly eventEmitter: EventEmitter2,
    @InjectModel(EventFailure.name)
    private readonly eventFailModel: Model<EventFailure>,
  ) {}

  async emitSafe(eventName: string, payload: any) {
    try {
      return await this.eventEmitter.emitAsync(eventName, payload);
    } catch (error) {
      await this.eventFailModel.create({
        eventName,
        payload,
        errorMessage: error.message ?? String(error),
      });
    }
    return [];
  }
}
