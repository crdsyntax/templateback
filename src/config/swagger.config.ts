import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

export function setupSwagger(app: INestApplication) {
 
  const config = new DocumentBuilder()
  .setTitle('API de Gestión de Proyectos')
  .setDescription('Sistema de gestión de proyectos con workflows personalizables')
  .setVersion('1.0')
  .addTag('projects', 'Operaciones relacionadas con proyectos')
  .addTag('tasks', 'Gestión de tareas')
  .addTag('auth', 'Autenticación y autorización')
  .addTag('documents', 'Gestión documental')
  .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'JWT')
  .build();

const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('api/docs', app, document, {
  swaggerOptions: {
    persistAuthorization: true,
    tagsSorter: 'alpha',
    operationsSorter: 'alpha',
  },
  customSiteTitle: 'API Documentation - Gestión de Proyectos',
});
}
