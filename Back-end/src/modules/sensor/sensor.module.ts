import { Module } from '@nestjs/common';
import { SensorController } from './sensor.controller';
import { SensorService } from './sensor.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MqttModule } from 'src/base/mqtt/mqtt.module';
import { SensorGateway } from './sensor.gateway';

@Module({
    imports: [TypeOrmModule.forFeature([]), MqttModule],
    controllers: [SensorController],
    providers: [SensorService, SensorGateway],
    exports: [SensorService],
})
export class SensorModule {}