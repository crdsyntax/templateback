import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { RoleManagerDocument } from "src/role-manager/schemas/role-manager.schema";

export type UserDocument = User &
  Document & {
    _id: Types.ObjectId;
  };

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

  @Prop({ required: true, type: Boolean, default: true })
  isActive: boolean;

  @Prop({
    type: [{ type: Types.ObjectId, ref: "RoleManager" }],
    default: [],
  })
  roles: (Types.ObjectId | RoleManagerDocument)[];
}

export const UserSchema = SchemaFactory.createForClass(User);
