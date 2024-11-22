import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as bodyParser from 'body-parser';
import { CustomIoAdapter } from './customIoAdap'; // Import CustomIoAdapter

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('IoT API')
    .setDescription('The IoT API description')
    .setVersion('1.0')
    .addTag('led')
    .addTag('sensor')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.use(bodyParser.json());

  app.enableCors({
    origin: 'http://localhost:3000', // Allow requests from http://localhost:3000
  });

  app.useWebSocketAdapter(new CustomIoAdapter(app));

  await app.listen(3001);
}
bootstrap();
