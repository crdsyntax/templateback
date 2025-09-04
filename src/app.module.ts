import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { DatabaseModule } from "./config/data.module";
import { AuthModule } from "./auth/auth.module";
import { UserModule } from "./user/user.module";
import { CommonModule } from "./common/common.module";

@Module({
  imports: [DatabaseModule, AuthModule, UserModule, CommonModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
