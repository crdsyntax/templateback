import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { UserRole } from "../enums/user-role.enum";

export interface Permission {
  actions: string[];
  conditions?: Record<string, any>;
  _id?: Types.ObjectId;
}

export type RoleName = string;

export type RoleManagerDocument = RoleManager &
  Document & {
    _id: Types.ObjectId;
  };

@Schema({ timestamps: true })
export class RoleManager {
  @Prop({
    required: true,
    unique: true,
    enum: Object.values(UserRole),
  })
  name: UserRole;

  @Prop({ required: true, default: false })
  isDefault: boolean;

  @Prop({
    type: [String],
    default: [],
    description: "Array of role names that this role inherits permissions from",
  })
  inheritedRoles: RoleName[];

  @Prop({
    type: [Object],
    default: [],
    description:
      "Array of permission objects defining what actions this role can perform",
  })
  permissions: Permission[];

  @Prop({ type: String, required: false })
  description?: string;

  @Prop({ type: Boolean, default: true })
  isActive: boolean;

  @Prop({ type: Types.ObjectId, ref: "User" })
  createdBy: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: "User" })
  updatedBy: Types.ObjectId;

  @Prop({ type: Object, required: false })
  metadata?: Record<string, any>;
}

export const RoleManagerSchema = SchemaFactory.createForClass(RoleManager);

RoleManagerSchema.index({ name: 1 }, { unique: true });
RoleManagerSchema.index({ isDefault: 1 });
RoleManagerSchema.index({ isActive: 1 });
