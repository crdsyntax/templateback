import { MongooseModule } from '@nestjs/mongoose';

export const DatabaseProviders = [
  MongooseModule.forRoot('mongodb://localhost:27017/dbnow', {
    dbName: 'dbnow',
  }),
];
