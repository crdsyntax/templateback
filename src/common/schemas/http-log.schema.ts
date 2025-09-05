import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type HttpLogDocument = HttpLog & Document;

@Schema({ timestamps: true })
export class HttpLog {
  @Prop({ required: true })
  method: string;

  @Prop({ required: true })
  url: string;

  @Prop({ type: Object })
  body: any;

  @Prop({ type: Object })
  query: any;

  @Prop({ type: Object })
  params: any;

  @Prop()
  statusCode: number;

  @Prop()
  contentLength: string;

  @Prop()
  responseTime: number;

  @Prop()
  ip: string;

  @Prop()
  userAgent: string;

  @Prop({ default: false })
  isError: boolean;

  @Prop()
  errorMessage?: string;

  @Prop()
  errorStack?: string;
}

export const HttpLogSchema = SchemaFactory.createForClass(HttpLog);
