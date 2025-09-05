import { MongooseModule } from "@nestjs/mongoose";

const CONNECTION = process.env.DB_URI;
const DATABASE = process.env.DB;

export const DatabaseProviders = [
  MongooseModule.forRoot(CONNECTION || "", {
    dbName: DATABASE,
  }),
];
