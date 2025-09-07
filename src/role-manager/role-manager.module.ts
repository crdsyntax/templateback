import { Module, forwardRef } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { RoleManagerController } from "./controllers/role-manager.controller";
import { RoleManagerService } from "./services/role-manager.service";
import { RoleManager, RoleManagerSchema } from "./schemas/role-manager.schema";
import { AuthModule } from "../auth/auth.module";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: RoleManager.name, schema: RoleManagerSchema },
    ]),
    forwardRef(() => AuthModule),
  ],
  controllers: [RoleManagerController],
  providers: [RoleManagerService],
  exports: [RoleManagerService],
})
export class RoleManagerModule {}
