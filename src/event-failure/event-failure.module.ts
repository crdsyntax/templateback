import { Module } from '@nestjs/common';
import { SafeEventEmitter } from './services/event-failure.service';
import { EventFailureController } from './controllers/event-failure.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { EventEmitter2 } from 'eventemitter2';
import { EventFailure, EventFailureSchema } from './schemas/event-failure.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: EventFailure.name, schema: EventFailureSchema }
    ])
  ],
  providers: [
    {
      provide: EventEmitter2,
      useValue: new EventEmitter2()
    },
    SafeEventEmitter
  ],
  controllers: [EventFailureController],
  exports: [SafeEventEmitter]
})
export class EventFailureModule {}
