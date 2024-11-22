import { Controller, Get, Post, Param, ParseIntPipe, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { LedService } from './led.service';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';

@ApiTags('led')
@Controller('led')
export class LedController {
  constructor(private readonly ledService: LedService) {}

  @Get('paginated')
  @ApiOperation({ summary: 'Phân trang' })
  @ApiQuery({ name: 'page', required: true, description: 'Trang' })
  @ApiQuery({ name: 'limit', required: true, description: 'Số bản ghi trên một trang' })
  @ApiResponse({ status: 200, description: 'Successful response' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async getPaginated(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Res() res: Response
  ) {
    try {
      const result = await this.ledService.getPaginatedSensors(page, limit);
      res.send(result);
    } catch (err) {
      res.status(400).send('Bad Request');
    }
  }

  @Get('status')
  @ApiOperation({ summary: 'Lấy status của thiết bị' })
  @ApiResponse({ status: 200, description: 'Successful response' })
  listStatus() {
    return this.ledService.listStatus();
  }

  @Post('turn-on/:id')
  @ApiOperation({ summary: 'Bật thiết bị' })
  @ApiParam({ name: 'id', required: true, description: 'ID của thiết bị muốn bật' })
  @ApiResponse({ status: 200, description: 'Successful response' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async turnOn(@Param('id', ParseIntPipe) id: number) {
    return await this.ledService.turnOn(id);
  }

  @Post('turn-off/:id')
  @ApiOperation({ summary: 'Tắt thiết bị' })
  @ApiParam({ name: 'id', required: true, description: 'ID của thiết bị muốn tắt' })
  @ApiResponse({ status: 200, description: 'Successful response' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async turnOff(@Param('id', ParseIntPipe) id: number) {
    return await this.ledService.turnOff(id);
  }
}