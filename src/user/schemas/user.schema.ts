import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true, minlength: 3, maxlength: 30 })
  username: string;

  @Prop({
    type: String,
    required: true,
  })
  name: string;

  @Prop({
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
  })
  email?: string;

  @Prop({ required: true })
  passwordHash: string;

  @Prop({ required: true, type: Number, default: 0 })
  attemps: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
