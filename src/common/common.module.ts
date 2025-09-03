import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HttpLoggerMiddleware } from './middleware/http-logger.middleware';
import { HttpLog, HttpLogSchema } from './schemas/http-log.schema';
import { HttpLoggerService } from './services/http-logger.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: HttpLog.name, schema: HttpLogSchema }]),
  ],
  providers: [HttpLoggerService],
  exports: [HttpLoggerService],
})
export class CommonModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(HttpLoggerMiddleware)
      .forRoutes('*'); // Apply to all routes
  }
}
