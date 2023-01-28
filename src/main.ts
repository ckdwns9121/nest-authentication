import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
console.log(process.env.JWT_SECRET);

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
