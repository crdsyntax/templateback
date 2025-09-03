import { CorsOptions } from "@nestjs/common/interfaces/external/cors-options.interface";


export const corsOptions: CorsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', '*'],
  credentials: true,
};
