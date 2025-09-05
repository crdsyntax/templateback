import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ConfigService, ConfigModule } from "@nestjs/config";

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const uri = config.get<string>("DB_URI");
        const dbName = config.get<string>("DB");
        if (!uri) throw new Error("DB_URI no está definida");
        return {
          uri,
          dbName,
        };
      },
    }),
  ],
})
export class DatabaseModule {}
