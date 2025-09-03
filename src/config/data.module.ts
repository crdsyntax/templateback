import { Module } from '@nestjs/common';
import { DatabaseProviders } from './data.provider';

@Module({
  imports: [...DatabaseProviders],
  exports: [...DatabaseProviders],
})
export class DatabaseModule {}
