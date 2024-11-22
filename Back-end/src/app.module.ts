import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './base/db/database.module';
import { ConfigModule } from '@nestjs/config';
import { SensorModule } from './modules/sensor/sensor.module';
import { LedModule } from './modules/led/led.module';
import { MqttModule } from './base/mqtt/mqtt.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    SensorModule,
    LedModule,
    MqttModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
