import { Module } from '@nestjs/common';
import { LedController } from './led.controller';
import { LedService } from './led.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MqttService } from 'src/base/mqtt/mqtt.service';

@Module({
    imports: [TypeOrmModule.forFeature([])],
    controllers: [LedController],
    providers: [LedService, MqttService],
    exports: [LedService],
})
export class LedModule {}