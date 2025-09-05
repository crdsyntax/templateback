import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export type EventFailureDocument = EventFailure & Document;

@Schema({ timestamps: true })
export class EventFailure {
  @Prop({ type: Number })
  id: number;

  @Prop({ type: String, required: true })
  eventName: string;

  @Prop({ type: Boolean, default: false })
  retried: boolean;

  @Prop({ type: Object })
  payload: any;

  @Prop({ type: Number, default: 0 })
  retryCount: number;

  @Prop({ type: String, required: true })
  errorMessage: string;
}
export const EventFailureSchema = SchemaFactory.createForClass(EventFailure);
