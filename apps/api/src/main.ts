import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // ENABLE CORS: Allow Frontend (Port 3001) to talk to API (Port 3000)
  app.enableCors();
  
  await app.listen(3000);
}
bootstrap();